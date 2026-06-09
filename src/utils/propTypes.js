import PropTypes from 'prop-types';

/**
 * Reusable PropType shapes for core domain objects in EcoTrack AI.
 */

export const CarbonDataShape = PropTypes.shape({
  monthlyTotal: PropTypes.number,
  yearlyTotal: PropTypes.number,
  yearlyTons: PropTypes.number,
  score: PropTypes.number,
  breakdown: PropTypes.objectOf(PropTypes.number),
  timestamp: PropTypes.string,
});

export const ChallengeProgressShape = PropTypes.shape({
  completed: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentStreak: PropTypes.number.isRequired,
  longestStreak: PropTypes.number.isRequired,
  totalPoints: PropTypes.number.isRequired,
  lastCompletedDate: PropTypes.string,
});
