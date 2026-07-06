import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PunchRing } from '../components/employee/PunchRing';
import { LeaveModal } from '../components/employee/LeaveModal';
import { PipWindow } from '../components/pwa/PipWindow';
import { CompactWidget } from '../components/employee/CompactWidget';
import { Calendar, Clock, LogOut } from 'lucide-react';
import { getCompanySettings, calculateDistance, type CompanySettings } from '../lib/settings';
import { supabase } from '../lib/supabase';
import { getExpectedShiftEnd, evaluateDeparture } from '../lib/attendanceRules';

export function EmployeeDashboard() {
  const { profile, signOut } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Dummy data for now if profile is null (for UI testing without auth)
  const balances = profile?.leave_balances || { yearly: 30, sick: 14, pregnancy: 0 };

  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState('00:00');
  const [now, setNow] = useState(new Date());
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  // New States
  const [companyName, setCompanyName] = useState<string>('');
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [breakElapsed, setBreakElapsed] = useState('00:00');

  useEffect(() => {
    if (profile?.company_id) {
      getCompanySettings(profile.company_id).then(setSettings);

      // Fetch company name
      supabase.from('companies').select('name').eq('id', profile.company_id).single()
        .then(({ data }) => {
          if (data) setCompanyName(data.name);
        });
    }
  }, [profile?.company_id]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update elapsed time every second while checked in
  useEffect(() => {
    if (!isCheckedIn || !checkInTime) {
      setElapsedTime('00:00');
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - checkInTime.getTime()) / 1000);

      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);

      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');

      setElapsedTime(`${formattedHours}:${formattedMinutes}`);
    }, 1000); // Update every second for accuracy

    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTime]);

  // Update break elapsed time
  useEffect(() => {
    if (!isOnBreak || !breakStartTime) {
      setBreakElapsed('00:00');
      return;
    }
    const interval = setInterval(() => {
      const diffInSeconds = Math.floor((new Date().getTime() - breakStartTime.getTime()) / 1000);
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;
      setBreakElapsed(`${hours > 0 ? hours + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOnBreak, breakStartTime]);

  const handlePunch = async () => {
    // If checking out, we usually don't strictly require location, but we can check anyway or just let them out.
    // Let's enforce it for Check In to be safe.
    if (!isCheckedIn && settings) {
      try {
        let isAuthorized = false;

        // 1. FAST CHECK: Network IP
        if (settings.office_ip) {
          try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            if (ipData.ip === settings.office_ip) {
              isAuthorized = true;
              console.log("Authorized via Office IP Match");
            }
          } catch (e) {
            console.warn("IP Check failed, falling back to GPS", e);
          }
        }

        // 2. FALLBACK CHECK: GPS Location (50m radius)
        if (!isAuthorized && settings.office_latitude && settings.office_longitude) {
          if ('geolocation' in navigator) {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
            });

            const distance = calculateDistance(
              position.coords.latitude,
              position.coords.longitude,
              settings.office_latitude,
              settings.office_longitude
            );

            console.log(`Calculated distance to office: ${Math.round(distance)} meters`);

            if (distance <= 50) {
              isAuthorized = true;
            } else {
              alert(`Punch Denied: You are ${Math.round(distance)}m away from the office. You must be within 50m to check in.`);
              return; // Halt punch
            }
          } else {
            alert("Geolocation is not supported by your browser. Please use the Office Wi-Fi.");
            return;
          }
        }

        if (!isAuthorized && (!settings.office_latitude || !settings.office_longitude)) {
          // If settings exist but neither IP nor GPS are configured yet, warn and allow (or deny)
          alert("Warning: Office location is not fully configured by HR. Proceeding anyway.");
        }

      } catch (error) {
        console.error("Geofencing Error:", error);
        alert("Failed to verify location. Please allow location access.");
        return; // Halt punch
      }
    }

    // In a real app, call Supabase here.
    console.log(`Punching ${isCheckedIn ? 'out' : 'in'}`);

    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));

    if (!isCheckedIn) {
      setCheckInTime(new Date());
    } else {
      setCheckInTime(null);
    }
    setIsCheckedIn(!isCheckedIn);
  };

  const handleLeaveSubmit = async (data: any) => {
    console.log("Submitting leave request:", data);
    await new Promise(r => setTimeout(r, 1000));
  };

  const [isPipActive, setIsPipActive] = useState(false);

  // Nationality-Based Schedule Check (Basic Client Side)
  const isOmani = profile?.nationality === 'Omani';
  const today = new Date().getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday

  let disabledMessage = null;
  // Temporarily bypassed weekend lock so you can test it today!
  /*
  if (isOmani && (today === 5 || today === 6)) {
    disabledMessage = "Weekend (Friday/Saturday) - System Locked";
  } else if (!isOmani && today === 5) {
    disabledMessage = "Rest Day (Friday) - System Locked";
  }
  */

  const handleBreakPunch = () => {
    if (!isOnBreak) {
      setBreakStartTime(new Date());
    } else {
      setBreakStartTime(null);
    }
    setIsOnBreak(!isOnBreak);
  };

  const getBreakColorClass = () => {
    if (!isOnBreak || !breakStartTime) return 'text-white bg-surface';
    const diffMins = Math.floor((new Date().getTime() - breakStartTime.getTime()) / 60000);
    if (diffMins < 45) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (diffMins <= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    if (diffMins <= 75) return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10 animate-pulse';
  };

  const renderJourneyBar = () => {
    if (!profile) return null;
    const { hour, minute } = getExpectedShiftEnd(profile.nationality);

    const start = new Date(now);
    start.setHours(8, 30, 0, 0);
    const end = new Date(now);
    end.setHours(hour, minute, 0, 0);

    const totalMs = end.getTime() - start.getTime();
    const elapsedMs = now.getTime() - start.getTime();
    let progress = (elapsedMs / totalMs) * 100;
    progress = Math.max(0, Math.min(100, progress));

    return (
      <div className="w-full max-w-md mt-8">
        <div className="flex justify-between text-xs text-gray-400 font-medium mb-2 px-1">
          <span>8:30 AM (Start)</span>
          <span>{hour > 12 ? hour - 12 : hour}:{minute.toString().padStart(2, '0')} PM (End)</span>
        </div>
        <div className="h-3 w-full bg-surface border border-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-white/30" />
          </div>
        </div>
      </div>
    );
  };

  const renderPunchUI = () => {
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formattedDate = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-4">
        {/* Main Panel Clock */}
        <div className="text-center mb-12">
          <div className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent drop-shadow-sm mb-3">
            {formattedTime}
          </div>
          <div className="text-slate-400 font-medium uppercase tracking-widest text-sm flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </div>
        </div>

        <PunchRing
          isCheckedIn={isCheckedIn}
          onPunch={handlePunch}
          disabledMessage={disabledMessage}
        />
        {isCheckedIn && (
          <div className="mt-8 flex items-center gap-2 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-full font-medium shadow-lg shadow-emerald-500/5">
            <Clock className="w-5 h-5" />
            <span>Shift Active • Elapsed: {elapsedTime}</span>
          </div>
        )}

        {isCheckedIn && !isOnBreak && (
          <button
            onClick={handleBreakPunch}
            className="mt-6 px-6 py-3 rounded-xl font-medium border border-white/10 hover:bg-white/5 transition-all text-gray-300 flex items-center gap-2"
          >
            ☕ Take a Break
          </button>
        )}
        {isCheckedIn && isOnBreak && (
          <button
            onClick={handleBreakPunch}
            className={`mt-6 px-8 py-4 rounded-xl font-bold border transition-all ${getBreakColorClass()}`}
          >
            End Break • {breakElapsed}
          </button>
        )}

        {renderJourneyBar()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-12 px-4 pb-24 relative">
      <div className="w-full max-w-4xl flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold mb-1">Hello, {profile?.name || 'Employee'}</h1>
          <p className="text-gray-400">
            {profile?.role || 'Staff'} • {profile?.nationality || 'Omani'}
            {companyName && <span className="ml-2 text-primary font-medium">@ {companyName}</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* PiP Button */}
          {('documentPictureInPicture' in window) && (
            <button
              onClick={() => setIsPipActive(true)}
              disabled={isPipActive}
              className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 rounded-xl transition-all font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="12" y="12" width="7" height="5"></rect><line x1="12" y1="12" x2="19" y2="17"></line></svg>
              Pop-out Widget
            </button>
          )}

          <button
            onClick={signOut}
            className="p-3 bg-surface hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Render main UI if PiP is not active, otherwise show a placeholder */}
        {isPipActive ? (
          <div className="text-center p-12 border border-dashed border-gray-700 rounded-3xl glass opacity-60">
            <h2 className="text-xl font-medium mb-2">Widget is Active</h2>
            <p className="text-gray-400 text-sm">Your check-in ring is hovering on your screen.</p>
          </div>
        ) : (
          renderPunchUI()
        )}
      </div>

      {/* Floating Action Button for Leave */}
      <button
        onClick={() => setIsLeaveModalOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-4 md:right-8 bg-surface border border-white/10 hover:bg-white/10 text-white p-4 rounded-2xl shadow-xl transition-all flex items-center gap-3 group"
      >
        <Calendar className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
        <span className="font-medium pr-2">Request Leave</span>
      </button>

      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={handleLeaveSubmit}
        balances={balances}
      />

      {isPipActive && (
        <PipWindow width={300} height={220} onClose={() => setIsPipActive(false)}>
          <CompactWidget
            isCheckedIn={isCheckedIn}
            onPunch={handlePunch}
            elapsedTime={elapsedTime}
          />
        </PipWindow>
      )}
    </div>
  );
}
