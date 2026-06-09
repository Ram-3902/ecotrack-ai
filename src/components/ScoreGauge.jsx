export default function ScoreGauge({ score = 60, size = 120 }) {
  const radius = size * 0.4;
  const strokeWidth = size * 0.08;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Determine color matching carbonEngine.js thresholds
  const getColor = (s) => {
    if (s >= 80) return 'var(--color-primary)'; // Emerald green
    if (s >= 60) return '#34d399'; // Bright green
    if (s >= 40) return '#fbbf24'; // Yellow
    if (s >= 20) return '#f97316'; // Orange
    return '#f43f5e'; // Red
  };

  const color = getColor(score);

  return (
    <div
      role="img"
      aria-label={`Planetary Health Score: ${score} out of 100`}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg aria-hidden="true" width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Fill circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.8s ease' }}
        />
      </svg>
      
      {/* Score Label inside center */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{
          fontSize: `${size * 0.22}px`,
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: 1,
        }}>
          {score}
        </span>
        <span style={{
          fontSize: `${size * 0.09}px`,
          fontWeight: 500,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginTop: '2px',
        }}>
          Score
        </span>
      </div>
    </div>
  );
}
