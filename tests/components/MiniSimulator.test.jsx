import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MiniSimulator from '../../src/components/MiniSimulator';

describe('MiniSimulator Component', () => {
  it('renders default state correctly', () => {
    render(<MiniSimulator />);

    expect(screen.getByText('Estimate Your Footprint')).toBeInTheDocument();
    expect(screen.getByText('120 km')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('mixed');

    // Default estimate calculation checking
    // carEmissions = 120 * 4.33 * 0.21 * 12 = 1309.39 kg
    // dietEmissions = 4.5 * 365 = 1642.5 kg
    // total = 1309.39 + 1642.5 + 1800 = 4751.89 kg ~ 4.8 tons
    // trees = 4751.89 / 22 ~ 216 trees
    expect(screen.getByText(/4\.8/)).toBeInTheDocument();
    expect(screen.getByText(/216/)).toBeInTheDocument();
  });

  it('updates emissions when weekly driving distance is adjusted', async () => {
    render(<MiniSimulator />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '300' } });

    expect(screen.getByText('300 km')).toBeInTheDocument();

    // Recalculated estimate checking
    // carEmissions = 300 * 4.33 * 0.21 * 12 = 3273.48 kg
    // diet = 1642.5 kg
    // total = 3273.48 + 1642.5 + 1800 = 6715.98 kg ~ 6.7 tons
    // trees = 6715.98 / 22 ~ 305 trees
    expect(screen.getByText(/6\.7/)).toBeInTheDocument();
    expect(screen.getByText(/305/)).toBeInTheDocument();
  });

  it('updates emissions when diet option is changed', () => {
    render(<MiniSimulator />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'vegan' } });

    expect(select).toHaveValue('vegan');

    // Recalculated estimate checking with vegan diet factor (1.5)
    // car = 1309.39 kg
    // diet = 1.5 * 365 = 547.5 kg
    // total = 1309.39 + 547.5 + 1800 = 3656.89 kg ~ 3.7 tons
    // trees = 3656.89 / 22 ~ 166 trees
    expect(screen.getByText(/3\.7/)).toBeInTheDocument();
    expect(screen.getByText(/166/)).toBeInTheDocument();
  });
});
