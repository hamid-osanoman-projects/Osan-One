import { useState, useEffect, useRef } from 'react';
import { Clock, Calendar, LogIn, LogOut } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

interface CompactWidgetProps {
  isCheckedIn: boolean;
  onPunch: () => Promise<void>;
  elapsedTime: string;
}

export function CompactWidget({ isCheckedIn, onPunch, elapsedTime }: CompactWidgetProps) {
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const pressTimer = useRef<number | null>(null);
  const progressInterval = useRef<number | null>(null);
  const controls = useAnimation();
  const HOLD_DURATION = 2000; // 2 seconds

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const startPress = () => {
    if (loading) return;

    controls.start({ scale: 0.95 });
    let startTime = Date.now();

    progressInterval.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setProgress(newProgress);
    }, 16);

    pressTimer.current = window.setTimeout(async () => {
      handleSuccessfulHold();
    }, HOLD_DURATION);
  };

  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
    setProgress(0);
    controls.start({ scale: 1 });
  };

  const handleSuccessfulHold = async () => {
    cancelPress();
    setLoading(true);
    await onPunch();
    setLoading(false);
  };

  useEffect(() => {
    return () => cancelPress();
  }, []);

  const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const buttonBaseClass = isCheckedIn
    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
    : 'bg-slate-800 text-white border border-emerald-500/20 shadow-lg';

  const fillClass = isCheckedIn ? 'bg-rose-500/30' : 'bg-emerald-500/80';

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 p-4 font-sans text-white select-none touch-none">
      {/* Top Bar: Date & Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          {formattedDate}
        </div>
        <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${isCheckedIn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
          {isCheckedIn ? 'SHIFT ACTIVE' : 'OFF DUTY'}
        </div>
      </div>

      {/* Main Clock */}
      <div className="flex-1 flex flex-col items-center justify-center mb-4">
        <div className="text-4xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
          {formattedTime}
        </div>
        {isCheckedIn && (
          <div className="mt-2 flex items-center gap-1.5 text-emerald-500 text-sm font-medium">
            <Clock className="w-4 h-4" />
            Elapsed: {elapsedTime}
          </div>
        )}
      </div>

      {/* Action Button with Progress Fill */}
      <motion.div
        animate={controls}
        onPointerDown={startPress}
        onPointerUp={cancelPress}
        onPointerLeave={cancelPress}
        onContextMenu={(e) => e.preventDefault()}
        className={`relative w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 overflow-hidden cursor-pointer ${buttonBaseClass}`}
      >
        {/* Progress Background */}
        <div
          className={`absolute left-0 top-0 bottom-0 ${fillClass} transition-none`}
          style={{ width: `${progress}%` }}
        />

        {/* Button Content */}
        <div className="relative z-10 flex items-center gap-2 pointer-events-none">
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isCheckedIn ? (
            <>
              <LogOut className="w-4 h-4" />
              CHECK OUT (Hold 2s)
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-50">CHECK IN (Hold 2s)</span>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
