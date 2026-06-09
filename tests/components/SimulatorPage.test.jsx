import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SimulatorPage from '../../src/pages/SimulatorPage';

const mockCarbonData = {
  monthlyTotal: 671.21,
  breakdown: {
    transportation: 209.73,
    energy: 127.58,
    food: 155.25,
    shopping: 167.50,
    water: 11.16,
  },
  formData: {
    transportation: { carType: 'gasoline', carKmPerWeek: 80 },
    energy: { electricityKwhPerMonth: 350, renewablePercent: 15, heatingType: 'electric' },
    food: { dietType: 'mixed', foodWastePercent: 15 },
    shopping: { clothingItemsPerMonth: 2, monthlySpending: 200 },
    water: { showerMinutesPerDay: 8, litersPerDay: 120 },
  }
};

describe('SimulatorPage Component', () => {
  it('renders title and sections correctly', () => {
    render(<SimulatorPage carbonData={mockCarbonData} />);

    expect(screen.getByText('Carbon Impact Simulator')).toBeInTheDocument();
    expect(screen.getByText('Lifestyle Adjustments')).toBeInTheDocument();
    expect(screen.getByText('Projected Annualized Savings')).toBeInTheDocument();
  });

  it('toggles lifestyle switches and updates savings estimates dynamically', () => {
    render(<SimulatorPage carbonData={mockCarbonData} />);

    const checkText = (text) => {
      const match = screen.getByText((content, node) => {
        const hasText = (el) => el.textContent.replace(/\s+/g, ' ').includes(text);
        const nodeHasText = hasText(node);
        const childrenWithoutText = Array.from(node.children).every(child => !hasText(child));
        return nodeHasText && childrenWithoutText;
      });
      expect(match).toBeInTheDocument();
    };

    // CO2 savings should start at 0
    checkText('0 kg / year');
    checkText('absorption of 0 mature');

    // Click "Transition to Green Energy / Solar"
    const solarSwitch = screen.getByText(/Transition to Green Energy \/ Solar/i);
    fireEvent.click(solarSwitch);

    // After clicking, savings should increase
    // electricityMonthly = 350, currentRenewable = 15
    // nonRenewableKwh = 350 * 0.85 = 297.5
    // savingsPerMonth = 297.5 * 0.37 = 110.075
    // co2Reduction = 110.075 * 12 = 1320.9 kg/yr ~ 1321 kg/yr
    checkText('1321 kg / year');
    // Trees = 1321 / 22 ~ 60 trees
    checkText('absorption of 60 mature');

    // Click "Switch to Plant-Based Diet"
    const veganSwitch = screen.getByText(/Switch to Plant-Based Diet/i);
    fireEvent.click(veganSwitch);

    // diffDaily = 4.5 (mixed) - 1.5 (vegan) = 3.0
    // co2Reduction = 3.0 * 365 = 1095 kg/yr
    // Total = 1321 + 1095 = 2416 kg/yr
    checkText('2416 kg / year');

    // Click "Commute with Electric Vehicle / Transit"
    const evSwitch = screen.getByText(/Commute with Electric Vehicle \/ Transit/i);
    fireEvent.click(evSwitch);
    checkText('3082 kg / year');

    // Click "Eliminate Food Waste"
    const wasteSwitch = screen.getByText(/Eliminate Food Waste/i);
    fireEvent.click(wasteSwitch);
    checkText('3325 kg / year');

    // Click "Buy Second-Hand Clothes"
    const thriftSwitch = screen.getByText(/Buy Second-Hand Clothes/i);
    fireEvent.click(thriftSwitch);
    checkText('3505 kg / year');

    // Click "Limit Showers to 5 Minutes"
    const showerSwitch = screen.getByText(/Limit Showers to 5 Minutes/i);
    fireEvent.click(showerSwitch);
    checkText('3550 kg / year');
    checkText('absorption of 161 mature');
  });
});
