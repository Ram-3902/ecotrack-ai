import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import React from 'react';

// Mock scrollTo as a no-op
window.scrollTo = () => {};
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock ResizeObserver
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock recharts using React.createElement to avoid JSX syntax parsing in pure .js files
vi.mock('recharts', () => {
  return {
    ResponsiveContainer: ({ children }) => React.createElement('div', { 'data-testid': 'responsive-container' }, children),
    AreaChart: ({ children }) => React.createElement('svg', { 'data-testid': 'area-chart' }, children),
    Area: () => React.createElement('g'),
    XAxis: () => React.createElement('g'),
    YAxis: () => React.createElement('g'),
    CartesianGrid: () => React.createElement('g'),
    Tooltip: () => React.createElement('div'),
    BarChart: ({ children }) => React.createElement('svg', { 'data-testid': 'bar-chart' }, children),
    Bar: () => React.createElement('g'),
    Cell: () => React.createElement('g'),
  };
});

// Mock jspdf
vi.mock('jspdf', () => {
  return {
    jsPDF: vi.fn().mockImplementation(function () {
      return {
        setFont: vi.fn(),
        setFontSize: vi.fn(),
        setTextColor: vi.fn(),
        text: vi.fn(),
        setDrawColor: vi.fn(),
        line: vi.fn(),
        save: vi.fn(),
      };
    }),
  };
});

// Reset all mock functions and local storage after each test
afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});
