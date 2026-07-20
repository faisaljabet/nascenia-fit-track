/**
 * Parses raw members and weights data into a structured history format.
 * 
 * @param {Array} members List of member objects
 * @param {Object} weights Mapping of date -> memberId -> weight
 * @returns {Object} { parsedMembers, dates }
 */
export function parseWeightData(members, weights) {
  // Sort all dates in ascending order
  const dates = Object.keys(weights).sort((a, b) => new Date(a) - new Date(b));
  
  const parsedMembers = members.map(member => {
    const history = [];
    
    dates.forEach(date => {
      if (weights[date] && weights[date][member.id] !== undefined) {
        history.push({
          date,
          weight: weights[date][member.id]
        });
      }
    });

    const startingWeight = history.length > 0 ? history[0].weight : 0;
    const currentWeight = history.length > 0 ? history[history.length - 1].weight : 0;
    const totalChange = history.length > 0 ? currentWeight - startingWeight : 0;
    
    // BMI Calculations
    const heightM = member.heightCm ? member.heightCm / 100 : 0;
    const startingBmi = heightM > 0 ? startingWeight / (heightM * heightM) : 0;
    const currentBmi = heightM > 0 ? currentWeight / (heightM * heightM) : 0;
    const bmiChange = currentBmi - startingBmi;
    
    // Weekly change represents the difference between the latest week and the previous week
    let weeklyChange = 0;
    if (history.length >= 2) {
      weeklyChange = history[history.length - 1].weight - history[history.length - 2].weight;
    }

    return {
      ...member,
      weightHistory: history,
      startingWeight,
      currentWeight,
      totalChange,
      weeklyChange,
      startingBmi,
      currentBmi,
      bmiChange
    };
  });

  return { parsedMembers, dates };
}

/**
 * Calculates the weekly winner (largest weight loss from previous week).
 * 
 * @param {Array} parsedMembers Members with their history and calculated deltas
 * @param {Array} dates List of all sorted dates
 * @returns {Object|null} Winner object or null if no one lost weight
 */
export function calculateWeeklyWinner(parsedMembers, dates) {
  if (dates.length < 2) return null;
  
  const latestDate = dates[dates.length - 1];
  const previousDate = dates[dates.length - 2];
  
  let winner = null;
  let maxLoss = 0; // weight loss is negative delta, so we look for the most negative delta (positive loss)

  parsedMembers.forEach(member => {
    // Find weight for latest and previous date
    const latestEntry = member.weightHistory.find(h => h.date === latestDate);
    const previousEntry = member.weightHistory.find(h => h.date === previousDate);
    
    if (latestEntry && previousEntry) {
      const delta = latestEntry.weight - previousEntry.weight;
      const loss = -delta; // e.g. if delta is -0.9, loss is 0.9
      
      if (loss > maxLoss) {
        maxLoss = loss;
        winner = {
          member,
          loss,
          previousWeight: previousEntry.weight,
          currentWeight: latestEntry.weight,
          delta
        };
      }
    }
  });

  return winner;
}
