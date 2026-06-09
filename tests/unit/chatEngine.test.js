import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getResponse, getGreeting } from '../../src/utils/chatEngine';

describe('chatEngine - getResponse', () => {
  it('should return default response for unrecognized query', () => {
    const res = getResponse('random gibberish that does not match');
    expect(res.text).toContain('That\'s an interesting question!');
    expect(res.followUps).toContain('How can I reduce my carbon footprint?');
  });

  it('should match keywords case-insensitively and return matched response', () => {
    const res = getResponse('Tell me about my CARBON FOOTPRINT please');
    expect(res.text).toContain('Your **carbon footprint** is the total amount');
    expect(res.followUps).toContain('How can I reduce my carbon footprint?');
  });

  it('should select the best match with the highest score', () => {
    // "electric car" matches "electric car", "ev", "electric vehicle" (longer matches yield higher score)
    const res = getResponse('electric car');
    expect(res.text).toContain('Electric vehicles are significantly better for the climate');
    expect(res.followUps).toContain('How do I charge an EV at home?');
  });

  it('should match short keywords like "hello" or "hi"', () => {
    const res = getResponse('hi');
    expect(res.text).toContain('I\'m your **EcoTrack AI Sustainability Assistant**');
  });
});

describe('chatEngine - getGreeting', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return Good morning for AM hours', () => {
    const date = new Date(2026, 5, 9, 8, 0, 0); // 8:00 AM
    vi.setSystemTime(date);
    const greeting = getGreeting();
    expect(greeting.text).toContain('Good morning!');
  });

  it('should return Good afternoon for midday/early PM hours', () => {
    const date = new Date(2026, 5, 9, 14, 0, 0); // 2:00 PM
    vi.setSystemTime(date);
    const greeting = getGreeting();
    expect(greeting.text).toContain('Good afternoon!');
  });

  it('should return Good evening for late PM hours', () => {
    const date = new Date(2026, 5, 9, 20, 0, 0); // 8:00 PM
    vi.setSystemTime(date);
    const greeting = getGreeting();
    expect(greeting.text).toContain('Good evening!');
  });
});
