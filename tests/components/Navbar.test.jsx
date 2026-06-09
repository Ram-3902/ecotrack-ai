import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import Navbar from '../../src/components/Navbar';

describe('Navbar Component', () => {
  it('renders branding logo and text', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('EcoTrack AI')).toBeInTheDocument();
    expect(screen.getByText('🌿')).toBeInTheDocument();
  });

  it('renders all main navigation links with correct paths', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const dashboardLink = screen.getByText('Dashboard');
    const coachLink = screen.getByText('AI Coach');
    const simulatorLink = screen.getByText('Simulator');
    const challengesLink = screen.getByText('Challenges');
    const communityLink = screen.getByText('Community');

    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');

    expect(coachLink).toBeInTheDocument();
    expect(coachLink).toHaveAttribute('href', '/coach');

    expect(simulatorLink).toBeInTheDocument();
    expect(simulatorLink).toHaveAttribute('href', '/simulator');

    expect(challengesLink).toBeInTheDocument();
    expect(challengesLink).toHaveAttribute('href', '/challenges');

    expect(communityLink).toBeInTheDocument();
    expect(communityLink).toHaveAttribute('href', '/community');
  });

  it('renders CTA Start Assessment button', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const btn = screen.getByText('Start Assessment');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('href', '/coach');
  });
});
