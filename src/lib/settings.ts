import { supabase } from './supabase';

export interface CompanySettings {
  id: string;
  company_id: string;
  office_latitude: number | null;
  office_longitude: number | null;
  office_ip: string | null;
  updated_at: string;
}

export async function getCompanySettings(companyId: string): Promise<CompanySettings | null> {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching company settings:', error);
      return null;
    }

    return data as CompanySettings | null;
  } catch (error) {
    console.error('Unexpected error fetching company settings:', error);
    return null;
  }
}

export async function updateCompanySettings(
  companyId: string, 
  latitude: number | null, 
  longitude: number | null, 
  ip: string | null
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('company_settings')
      .upsert(
        {
          company_id: companyId,
          office_latitude: latitude,
          office_longitude: longitude,
          office_ip: ip,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'company_id' }
      );

    if (error) {
      console.error('Error updating company settings:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error updating company settings:', error);
    return false;
  }
}

// Haversine formula to calculate distance in meters between two coordinates
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
