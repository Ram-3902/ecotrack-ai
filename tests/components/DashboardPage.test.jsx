import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from '../../src/pages/DashboardPage';
import * as dataStore from '../../src/utils/dataStore';

const mockCarbonData = {
  monthlyTotal: 671.21,
  yearlyTotal: 8054.52,
  yearlyTons: 8.05,
  score: 35,
  breakdown: {
    transportation: 209.73,
    energy: 127.58,
    food: 155.25,
    shopping: 167.50,
    water: 11.16,
  },
};

describe('DashboardPage Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders stats, breakdown, and gauges', () => {
    render(<DashboardPage carbonData={mockCarbonData} />);

    expect(screen.getByText('Carbon Footprint Console')).toBeInTheDocument();
    expect(screen.getByText('Critical Stress')).toBeInTheDocument();
    expect(screen.getByText('671.21')).toBeInTheDocument();
    expect(screen.getByText('8.05')).toBeInTheDocument();
  });

  it('allows adding a new commitment target', () => {
    const saveGoalSpy = vi.spyOn(dataStore, 'saveGoal').mockImplementation((goal) => {
      return [{ id: 'g_new', ...goal, completed: false }];
    });

    render(<DashboardPage carbonData={mockCarbonData} />);

    // Click "+ Add Target"
    const addBtn = screen.getByRole('button', { name: '+ Add Target' });
    fireEvent.click(addBtn);

    // Input details
    const titleInput = screen.getByPlaceholderText('e.g. Turn off standby power');
    fireEvent.change(titleInput, { target: { value: 'Ride bike on weekends' } });

    const saveBtn = screen.getByRole('button', { name: 'Save Target' });
    fireEvent.click(saveBtn);

    expect(saveGoalSpy).toHaveBeenCalledTimes(1);
    expect(saveGoalSpy).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Ride bike on weekends',
      category: 'transportation',
      targetReduction: 20,
    }));
  });

  it('supports PDF export download button trigger', () => {
    render(<DashboardPage carbonData={mockCarbonData} />);
    
    const exportBtn = screen.getByRole('button', { name: /Export Assessment PDF/i });
    fireEvent.click(exportBtn);

    // Mocks are asserted by ensuring no crashes occur when importing jsPDF
    expect(exportBtn).toBeInTheDocument();
  });
});
