// Utility functions for dashboard calculations
export function calculateDaysOut(dateString: string): number {
  const eventDate = new Date(dateString);
  const today = new Date();
  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getStatusIcon(daysOut: number): string {
  if (daysOut < 0) {
    return '🔴'; // Red for past events
  } else if (daysOut <= 7) {
    return '🟠'; // Orange for events within 7 days
  } else if (daysOut <= 30) {
    return '🟡'; // Yellow for events within 30 days
  } else {
    return '🟢'; // Green for future events
  }
}

export function getStatusClass(daysOut: number | undefined): string {
  if (daysOut === undefined) {
    return 'status-live'; // Green for "Live" events (happening now)
  } else if (daysOut <= 0) {
    return 'status-past'; // Past events (shouldn't appear in main dashboard)
  } else if (daysOut <= 14) {
    return 'status-urgent'; // Red for urgent (1-14 days)
  } else if (daysOut <= 30) {
    return 'status-soon'; // Orange for soon (15-30 days)  
  } else if (daysOut <= 60) {
    return 'status-future'; // Yellow for future (31-60 days)
  } else {
    return 'status-far-future'; // Blue/purple for far future (60+ days)
  }
}
