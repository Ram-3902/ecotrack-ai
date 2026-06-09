import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import CommunityPage from '../../src/pages/CommunityPage';

describe('CommunityPage Component', () => {
  it('renders page header and global statistics', () => {
    render(<CommunityPage />);

    expect(screen.getByText('Global Community Sync')).toBeInTheDocument();
    expect(screen.getByText('CO₂ Mitigated')).toBeInTheDocument();
    expect(screen.getByText('Forest equivalent')).toBeInTheDocument();
    expect(screen.getByText('Active Guardians')).toBeInTheDocument();
    expect(screen.getByText('Global Regions')).toBeInTheDocument();
  });

  it('renders leaderboard table with user entries', () => {
    render(<CommunityPage />);

    expect(screen.getByText('Global Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('GreenMachine')).toBeInTheDocument();
    // Check our player placeholder is styled/shown
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('EcoWarrior23')).toBeInTheDocument();
  });

  it('renders milestone goals listing', () => {
    render(<CommunityPage />);

    expect(screen.getByText('Planetary Milestones')).toBeInTheDocument();
    expect(screen.getByText('1M kg CO₂ Reduced')).toBeInTheDocument();
    expect(screen.getByText('5M kg CO₂ Reduced')).toBeInTheDocument();
  });
});
