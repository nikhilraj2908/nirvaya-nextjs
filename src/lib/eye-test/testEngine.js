/**
 * Nirvaya Eyecare Centre — Online Vision Screening Test Engine
 * Implements standard adaptive Landolt C trial progression.
 */

import { DIRECTIONS, ACUITY_LEVELS, TRIALS_PER_LEVEL, PASS_THRESHOLD } from './constants';

const ALL_DIRECTIONS = [DIRECTIONS.UP, DIRECTIONS.RIGHT, DIRECTIONS.DOWN, DIRECTIONS.LEFT];

/**
 * Generate a random direction with balanced distribution, avoiding immediate repetition
 */
export function generateRandomDirection(previousDirection = null) {
  const choices = previousDirection
    ? ALL_DIRECTIONS.filter((d) => d !== previousDirection)
    : ALL_DIRECTIONS;
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

/**
 * Initialize a clean state for one eye
 */
export function createEyeState() {
  const firstDirection = generateRandomDirection();
  return {
    levelIndex: 0,
    trialIndex: 0,
    currentLevel: ACUITY_LEVELS[0],
    currentDirection: firstDirection,
    trialsInCurrentLevel: [],
    levelCorrectCount: 0,
    isComplete: false,
    achievedAcuity: null,
    history: []
  };
}

/**
 * Process a user's direction answer and advance or complete the eye screening
 *
 * @param {object} currentState
 * @param {string} userChoice - 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'
 * @returns {object} nextState
 */
export function evaluateTrialAnswer(currentState, userChoice) {
  if (currentState.isComplete) return currentState;

  const isCorrect = userChoice === currentState.currentDirection;
  const currentLevel = ACUITY_LEVELS[currentState.levelIndex];

  const trialRecord = {
    levelIndex: currentState.levelIndex,
    levelId: currentLevel.id,
    target: currentState.currentDirection,
    selected: userChoice,
    isCorrect
  };

  const updatedTrials = [...currentState.trialsInCurrentLevel, trialRecord];
  const updatedHistory = [...currentState.history, trialRecord];
  const newCorrectCount = currentState.levelCorrectCount + (isCorrect ? 1 : 0);
  const nextTrialIndex = currentState.trialIndex + 1;

  // Have we completed all trials for this level?
  if (nextTrialIndex >= TRIALS_PER_LEVEL) {
    const passed = newCorrectCount >= PASS_THRESHOLD;

    if (passed) {
      const isLastLevel = currentState.levelIndex >= ACUITY_LEVELS.length - 1;

      if (isLastLevel) {
        // Achieved highest 20/20 level
        return {
          ...currentState,
          history: updatedHistory,
          isComplete: true,
          achievedAcuity: currentLevel
        };
      } else {
        // Advance to next sharper level
        const nextLevelIndex = currentState.levelIndex + 1;
        const nextLevel = ACUITY_LEVELS[nextLevelIndex];
        return {
          ...currentState,
          levelIndex: nextLevelIndex,
          trialIndex: 0,
          currentLevel: nextLevel,
          currentDirection: generateRandomDirection(currentState.currentDirection),
          trialsInCurrentLevel: [],
          levelCorrectCount: 0,
          achievedAcuity: currentLevel,
          history: updatedHistory
        };
      }
    } else {
      // Failed this level - record highest previously achieved level (or level 0 if failed first)
      const achieved = currentState.levelIndex > 0
        ? ACUITY_LEVELS[currentState.levelIndex - 1]
        : { id: '< 20/100', snellenUS: '< 20/100', snellenMetric: '< 6/30', label: 'Below 20/100 baseline' };

      return {
        ...currentState,
        history: updatedHistory,
        isComplete: true,
        achievedAcuity: achieved
      };
    }
  }

  // Next trial within same level
  return {
    ...currentState,
    trialIndex: nextTrialIndex,
    currentDirection: generateRandomDirection(currentState.currentDirection),
    trialsInCurrentLevel: updatedTrials,
    levelCorrectCount: newCorrectCount,
    history: updatedHistory
  };
}
