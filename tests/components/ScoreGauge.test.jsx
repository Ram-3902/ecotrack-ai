import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScoreGauge from '../../src/components/ScoreGauge';

describe('ScoreGauge Component', () => {
  it('renders score text and label', () => {
    render(<ScoreGauge score={58} size={150} />);
    
    // Check score number
    expect(screen.getByText('58')).toBeInTheDocument();
    // Check label
    expect(screen.getByText('Score')).toBeInTheDocument();
  });

  it('applies default props correctly', () => {
    const { container } = render(<ScoreGauge />);
    
    // Default score is 60, default size is 120
    expect(screen.getByText('60')).toBeInTheDocument();
    
    const wrapperDiv = container.firstChild;
    expect(wrapperDiv).toHaveStyle({
      width: '120px',
      height: '120px',
    });
  });

  it('renders correct color for excellent score (>= 80)', () => {
    const { container } = render(<ScoreGauge score={85} />);
    const circles = container.querySelectorAll('circle');
    
    // The second circle is the fill circle
    expect(circles[1]).toHaveAttribute('stroke', 'var(--color-primary)');
  });

  it('renders correct color for good score (>= 60)', () => {
    const { container } = render(<ScoreGauge score={70} />);
    const circles = container.querySelectorAll('circle');
    expect(circles[1]).toHaveAttribute('stroke', '#34d399');
  });

  it('renders correct color for average score (>= 40)', () => {
    const { container } = render(<ScoreGauge score={50} />);
    const circles = container.querySelectorAll('circle');
    expect(circles[1]).toHaveAttribute('stroke', '#fbbf24');
  });

  it('renders correct color for poor score (>= 20)', () => {
    const { container } = render(<ScoreGauge score={30} />);
    const circles = container.querySelectorAll('circle');
    expect(circles[1]).toHaveAttribute('stroke', '#f97316');
  });

  it('renders correct color for critical score (< 20)', () => {
    const { container } = render(<ScoreGauge score={10} />);
    const circles = container.querySelectorAll('circle');
    expect(circles[1]).toHaveAttribute('stroke', '#f43f5e');
  });
});
