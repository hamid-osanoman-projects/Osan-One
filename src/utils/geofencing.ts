// Haversine formula to calculate distance between two coordinates in meters
function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Radius of the earth in m
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in m
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export async function verifyLocation(): Promise<{ success: boolean; error?: string; ip?: string }> {
  // 1. IP Validation
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    const currentIp = data.ip;
    
    const whitelistedIp = import.meta.env.VITE_OFFICE_WHITELISTED_IP;
    
    if (whitelistedIp && currentIp === whitelistedIp) {
      return { success: true, ip: currentIp };
    }
  } catch (error) {
    console.warn("IP Check failed, falling back to Geolocation", error);
  }

  // 2. HTML5 Geolocation Check (Fallback if IP fails or doesn't match)
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ success: false, error: 'Geolocation is not supported by your browser.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const targetLat = parseFloat(import.meta.env.VITE_OFFICE_LATITUDE || '0');
        const targetLon = parseFloat(import.meta.env.VITE_OFFICE_LONGITUDE || '0');
        
        if (!targetLat || !targetLon) {
          resolve({ success: false, error: 'Office coordinates not configured.' });
          return;
        }

        const distance = getDistanceFromLatLonInMeters(
          position.coords.latitude,
          position.coords.longitude,
          targetLat,
          targetLon
        );

        // 50-meter radius
        if (distance <= 50) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: `You are ${Math.round(distance)}m away from the office. Must be within 50m.` });
        }
      },
      (error) => {
        resolve({ success: false, error: `Geolocation error: ${error.message}` });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
}
