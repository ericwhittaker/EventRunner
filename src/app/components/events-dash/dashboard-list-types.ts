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
