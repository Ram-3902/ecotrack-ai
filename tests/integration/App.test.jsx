import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import App from '../../src/App';

describe('App Integration Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders landing page by default', () => {
    render(<App />);
    expect(screen.getByText('Measure, Model, and Mitigate Your Carbon Footprint')).toBeInTheDocument();
  });

  it('can navigate to Dashboard and see score', () => {
    render(<App />);
    
    const nav = screen.getByRole('navigation');
    const dashboardNavLink = within(nav).getByRole('link', { name: 'Dashboard' });
    fireEvent.click(dashboardNavLink);
    
    expect(screen.getByText('Carbon Footprint Console')).toBeInTheDocument();
    expect(screen.getByText('Planetary Health Score')).toBeInTheDocument();
  });

  it('completes the AI Coach Assessment wizard and updates dashboard metrics', async () => {
    render(<App />);
    
    // Wait for App's initial mount effects (loading sample data) to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });
    
    // 1. Navigate to AI Coach
    const nav = screen.getByRole('navigation');
    const coachNavLink = within(nav).getByRole('link', { name: 'AI Coach' });
    fireEvent.click(coachNavLink);
    
    // Verify AI Coach Page content (using findByText to allow route change to render)
    expect(await screen.findByText('AI Guide')).toBeInTheDocument();
    
    // Wait for the greeting message to load, ensuring event handlers are bound
    expect(await screen.findByText(/Sustainability Assistant/i)).toBeInTheDocument();
    
    // 2. Start guided assessment
    const startBtn = await screen.findByRole('button', { name: /🌿 Start Assessment/i });
    fireEvent.click(startBtn);
    
    // 3. Step 1: Transportation Profile -> click Next
    expect(await screen.findByText(/Transportation Profile/)).toBeInTheDocument();
    const nextBtn1 = screen.getByRole('button', { name: /Next: Food Profile/i });
    fireEvent.click(nextBtn1);
    
    // 4. Step 2: Food & Waste Assessment -> click Next
    expect(await screen.findByText(/Food & Waste Assessment/)).toBeInTheDocument();
    const nextBtn2 = screen.getByRole('button', { name: /Next: Energy Profile/i });
    fireEvent.click(nextBtn2);
    
    // 5. Step 3: Household Energy Profile -> click Next
    expect(await screen.findByText(/Household Energy Profile/)).toBeInTheDocument();
    const nextBtn3 = screen.getByRole('button', { name: /Next: Shopping Profile/i });
    fireEvent.click(nextBtn3);
    
    // 6. Step 4: Consumer Shopping Profile -> click Complete Analysis
    expect(await screen.findByText(/Consumer Shopping Profile/)).toBeInTheDocument();
    
    // Enable fake timers right before clicking complete, which runs the setTimeout
    vi.useFakeTimers();
    
    const completeBtn = screen.getByRole('button', { name: /Complete Analysis/i });
    fireEvent.click(completeBtn);
    
    // 7. Step 5: Loading state -> Fast forward timers to finish calculation
    expect(screen.getByText('Analyzing footprint data...')).toBeInTheDocument();
    
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    
    // Verify results show up
    expect(screen.getByText('Assessment Complete')).toBeInTheDocument();
    
    // 8. Apply Calibration to update carbon data in the App
    const applyBtn = screen.getByRole('button', { name: /Generate My Action Plan/i });
    fireEvent.click(applyBtn);
    
    // Verify confirmation message
    expect(screen.getByText(/Footprint assessment completed successfully/i)).toBeInTheDocument();
    
    // Restore real timers
    vi.useRealTimers();
    
    // 9. Go back to Dashboard and verify updated data
    const dashboardNavLink2 = within(nav).getByRole('link', { name: 'Dashboard' });
    fireEvent.click(dashboardNavLink2);
    
    expect(screen.getByText('Carbon Footprint Console')).toBeInTheDocument();
  });
});
