import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import ChallengesPage from '../../src/pages/ChallengesPage';

const mockChallengeProgress = {
  completed: ['d1', 'd2'],
  currentStreak: 2,
  longestStreak: 5,
  lastCompletedDate: '2026-06-08',
  totalPoints: 20,
};

describe('ChallengesPage Component', () => {
  it('renders progress and XP cards correctly', () => {
    const handleUpdate = vi.fn();
    render(
      <ChallengesPage
        challengeProgress={mockChallengeProgress}
        onUpdateChallenges={handleUpdate}
      />
    );

    expect(screen.getByText('Guardian Missions Board')).toBeInTheDocument();
    expect(screen.getByText('20 XP')).toBeInTheDocument();
    expect(screen.getByText('2 🔥')).toBeInTheDocument();
    expect(screen.getByText('Unlocked Achievements')).toBeInTheDocument();
  });

  it('renders daily challenges list and supports tab clicking', () => {
    const handleUpdate = vi.fn();
    render(
      <ChallengesPage
        challengeProgress={mockChallengeProgress}
        onUpdateChallenges={handleUpdate}
      />
    );

    // Default daily tab items
    expect(screen.getByText('Meatless Meal')).toBeInTheDocument();

    // Click on weekly tab
    const weeklyTabBtn = screen.getByRole('tab', { name: /weekly/i });
    fireEvent.click(weeklyTabBtn);

    expect(screen.getByText('Meatless Week')).toBeInTheDocument();
  });

  it('calls onUpdateChallenges when completing a challenge', () => {
    const handleUpdate = vi.fn();
    render(
      <ChallengesPage
        challengeProgress={mockChallengeProgress}
        onUpdateChallenges={handleUpdate}
      />
    );

    // Completed challenges have disabled buttons
    const completedBtns = screen.getAllByRole('button', { name: '✓ Completed' });
    expect(completedBtns.length).toBeGreaterThanOrEqual(1);
    completedBtns.forEach(btn => expect(btn).toBeDisabled());

    // Challenge d3 is not completed (Unplug & Disconnect) -> click it (+10 XP)
    const d3Card = screen.getByText('Unplug & Disconnect').closest('.saas-card');
    const d3Btn = within(d3Card).getByRole('button', { name: '+10 XP' });
    fireEvent.click(d3Btn);

    expect(handleUpdate).toHaveBeenCalledTimes(1);
    expect(handleUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        completed: expect.arrayContaining(['d1', 'd2', 'd3']),
        totalPoints: 30, // 20 + 10 = 30
      })
    );
  });
});
