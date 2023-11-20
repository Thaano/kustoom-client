/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
function* combinations(combo, list, k) {
  if (k === 0) {
    yield combo;
  } else {
    for (let i = 0; i < list.length; i += 1) {
      yield* combinations([...combo, list[i]], list.slice(i + 1), k - 1);
    }
  }
}

export const generateBalancedTeams = (summoners) => {
  if (summoners.length < 2) {
    return null;
  }

  console.log('generating balanced teams...');
  let teams = {
    team1: { summoners: [], totalRating: 0 },
    team2: { summoners: [], totalRating: 0 },
  };

  const team1Combinations = combinations([], summoners, 5);
  let bestCombo;

  const goodCombos = [];
  const MAX_ITERATIONS = 100000;
  let iterations = 0;
  const MAX_COMBOS_TO_COLLECT = 100; // Limite arbitraire sur le nombre de combinaisons à collecter

  let diffTreshold = 1;
  // const maxDiffTreshold = 15;

  while (goodCombos.length < 2 && iterations < MAX_ITERATIONS) {
    console.log('diffTreshold', diffTreshold, 'iterations', iterations);
    // eslint-disable-next-line no-restricted-syntax
    for (const combo of team1Combinations) {
      const team1Rating = combo.reduce(
        (sum, summoner) => sum + summoner.rating,
        0
      );
      const team2 = summoners.filter((summoner) => !combo.includes(summoner));
      const team2Rating = team2.reduce(
        (sum, summoner) => sum + summoner.rating,
        0
      );

      const diff = Math.abs(team1Rating - team2Rating);

      if (diff <= diffTreshold) {
        goodCombos.push(combo);
      }
      if (goodCombos.length >= MAX_COMBOS_TO_COLLECT) {
        break;
      }
    }

    diffTreshold += 1;
    iterations += 1;
  }

  if (goodCombos.length > 0) {
    bestCombo = goodCombos[Math.floor(Math.random() * goodCombos.length)];
  }

  if (bestCombo) {
    const team2 = summoners.filter((summoner) => !bestCombo.includes(summoner));
    teams = {
      team1: {
        summoners: bestCombo,
        totalRating: bestCombo.reduce(
          (sum, summoner) => (sum += summoner.rating),
          0
        ),
      },
      team2: {
        summoners: team2,
        totalRating: team2.reduce(
          (sum, summoner) => (sum += summoner.rating),
          0
        ),
      },
    };
  } else {
    return null;
  }

  console.log('generated balanced teams');
  return teams;
};
