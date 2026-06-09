import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../../src/components/Footer';

describe('Footer Component', () => {
  it('renders branding and description', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getAllByText('EcoTrack AI').length).toBeGreaterThan(0);
    expect(screen.getByText(/An educational and open-source project designed/i)).toBeInTheDocument();
  });

  it('renders column headings and links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText('Modules')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Project')).toBeInTheDocument();
    expect(screen.getByText('Guidelines')).toBeInTheDocument();

    // Check module links
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: 'AI Coach' })).toHaveAttribute('href', '/coach');
    expect(screen.getByRole('link', { name: 'Simulator' })).toHaveAttribute('href', '/simulator');
  });

  it('renders social media and copyright links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Discord')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} EcoTrack AI. All rights reserved.`))).toBeInTheDocument();
  });
});
