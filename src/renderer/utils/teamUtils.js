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

  let teams = {
    team1: { summoners: [], totalRating: 0 },
    team2: { summoners: [], totalRating: 0 },
  };

  let bestCombo;
  const goodCombos = [];
  const MAX_COMBOS_TO_COLLECT = 100; // Limite arbitraire sur le nombre de combinaisons à collecter

  let diffTreshold = 1; // Différence de rating maximale par défaut entre les deux équipes
  const maxDiffTreshold = 25; // Différence de rating maximale que peut atteindre les deux équipes pour rentrer dans un goodCombo

  while (goodCombos.length < 2 && diffTreshold <= maxDiffTreshold) {
    const team1Combinations = combinations(
      [],
      summoners,
      Math.ceil(summoners.length / 2)
    );
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
