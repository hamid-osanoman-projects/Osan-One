import type { Nationality } from '../types';

// Constants
export const SHIFT_START_HOUR = 8;
export const SHIFT_START_MINUTE = 30;
export const OMANI_SHIFT_END_HOUR = 17; // 5:00 PM
export const EXPAT_SHIFT_END_HOUR = 18; // 6:00 PM

export const GRACE_PERIOD_LATE_MINUTES = 15; // 8:30 to 8:45
export const SEVERE_LATE_MINUTES = 30; // After 9:00

export const STANDARD_BREAK_MINUTES = 60;
export const GRACE_BREAK_MINUTES = 75; // Up to 1h 15m

export const SEVERE_EARLY_MINUTES = 30; // Leaving > 30 mins early

export function getExpectedShiftEnd(nationality: Nationality | string): { hour: number, minute: number } {
  const isOmani = nationality === 'Omani';
  return {
    hour: isOmani ? OMANI_SHIFT_END_HOUR : EXPAT_SHIFT_END_HOUR,
    minute: 0
  };
}

export function evaluateArrival(clockInTime: Date): 'On-Time' | 'Grace Period' | 'Late Warning' | 'Severe Late' {
  const shiftStart = new Date(clockInTime);
  shiftStart.setHours(SHIFT_START_HOUR, SHIFT_START_MINUTE, 0, 0);

  const diffMs = clockInTime.getTime() - shiftStart.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes <= 0) return 'On-Time';
  if (diffMinutes <= GRACE_PERIOD_LATE_MINUTES) return 'Grace Period';
  if (diffMinutes <= SEVERE_LATE_MINUTES) return 'Late Warning';
  return 'Severe Late';
}

export function evaluateBreak(durationInMinutes: number): 'Normal' | 'Grace Period' | 'Over-Break' {
  if (durationInMinutes <= STANDARD_BREAK_MINUTES) return 'Normal';
  if (durationInMinutes <= GRACE_BREAK_MINUTES) return 'Grace Period';
  return 'Over-Break';
}

export function evaluateDeparture(clockOutTime: Date, expectedEndHour: number, expectedEndMinute: number): 'Normal' | 'Early Warning' | 'Severe Early' {
  const expectedEnd = new Date(clockOutTime);
  expectedEnd.setHours(expectedEndHour, expectedEndMinute, 0, 0);

  const diffMs = expectedEnd.getTime() - clockOutTime.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes <= 0) return 'Normal';
  if (diffMinutes <= SEVERE_EARLY_MINUTES) return 'Early Warning';
  return 'Severe Early';
}
