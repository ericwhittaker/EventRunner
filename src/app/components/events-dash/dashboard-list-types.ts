// Shared interfaces and utilities for dashboard list components

export interface BaseDashboardRow {
  start: string;
  end: string;
  eventName: string;
}

export interface DashboardListConfig {
  title: string;
  tableClass: string;
  maxRows: number;
  trackBy: string;
}

// Utility function for empty rows calculation
export function calculateEmptyRows(currentRowCount: number, maxRows: number): number[] {
  const emptyCount = Math.max(0, maxRows - currentRowCount);
  return Array(emptyCount).fill(0).map((_, i) => i);
}

export interface MainDashboardRow extends BaseDashboardRow {
  eventId: { html: string };
  venue: string;
  cityState: string;
  providing: string;
  toDo: number; // Count of todos
  daysOut?: number; // Days until/since event (shows in Status column)
}
