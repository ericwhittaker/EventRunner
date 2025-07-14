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
    return 'status-past'; // Bright green for "Live" events
  } else if (daysOut <= 3) {
    return 'status-urgent'; // Bright red for very urgent (1-3 days)
  } else if (daysOut <= 14) {
    return 'status-soon'; // Bright orange for soon (4-14 days)
  } else if (daysOut <= 30) {
    return 'status-future'; // Bright yellow for future (15-30 days)
  } else {
    return 'status-far-future'; // Purple for far future (30+ days)
  }
}
