function normalizeCard(card) {
  const ranks = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    T: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
  };
  return { rank: ranks[card[0]], suit: card[1] };
}

function sortCards(cards) {
  return cards.sort((a, b) => b.rank - a.rank);
}

function findGroups(cards) {
  let counts = {};
  cards.forEach((card) => (counts[card.rank] = (counts[card.rank] || 0) + 1));
  let groups = Object.entries(counts).sort(
    (a, b) => b[1] - a[1] || b[0] - a[0]
  );
  return groups;
}

function isRoyalFlush(cards) {
  let sf = isStraightFlush(cards);
  if (sf && sf.cards[0].rank === 14) {
    return { rank: 10, cards: sf.cards };
  }
  return null;
}

function isStraightFlush(cards) {
  let flush = isFlush(cards);
  if (flush) {
    let straightFlush = isStraight(flush.cards);
    if (straightFlush) {
      return { rank: 9, cards: straightFlush.cards };
    }
  }
  return null;
}

function isFourOfAKind(cards) {
  let groups = findGroups(cards);
  if (groups[0][1] === 4) {
    return {
      rank: 8,
      cards: cards
        .filter((card) => card.rank === parseInt(groups[0][0]))
        .slice(0, 4),
    };
  }
  return null;
}

function isFullHouse(cards) {
  let groups = findGroups(cards);
  if (groups[0][1] === 3 && groups[1][1] >= 2) {
    return {
      rank: 7,
      cards: cards
        .filter(
          (card) =>
            card.rank === parseInt(groups[0][0]) ||
            card.rank === parseInt(groups[1][0])
        )
        .slice(0, 5),
    };
  }
  return null;
}

function isFlush(cards) {
  let suits = cards.reduce((acc, card) => {
    acc[card.suit] = acc[card.suit] ? acc[card.suit].concat(card) : [card];
    return acc;
  }, {});

  for (let suit in suits) {
    if (suits[suit].length >= 5) {
      return { rank: 6, cards: suits[suit].slice(0, 5) };
    }
  }
  return null;
}

function isStraight(cards) {
  let normalizedRanks = cards.map((card) =>
    card.rank === 14 ? [14, 1] : [card.rank]
  );
  let rankSets = [].concat(...normalizedRanks);
  let uniqueRanks = [...new Set(rankSets)].sort((a, b) => a - b);

  for (let i = 0; i <= uniqueRanks.length - 5; i++) {
    if (uniqueRanks[i + 4] - uniqueRanks[i] === 4) {
      // Extract the cards that form the straight
      let straightRanks = uniqueRanks.slice(i, i + 5);
      let straightCards = cards
        .filter(
          (card) =>
            straightRanks.includes(card.rank) ||
            (card.rank === 14 && straightRanks.includes(1))
        )
        .sort((a, b) => b.rank - a.rank);

      return { rank: 5, cards: straightCards.slice(0, 5) };
    }
  }
  return null;
}

function isThreeOfAKind(cards) {
  let groups = findGroups(cards);
  if (groups[0][1] === 3) {
    return {
      rank: 4,
      cards: cards
        .filter((card) => card.rank === parseInt(groups[0][0]))
        .slice(0, 3),
    };
  }
  return null;
}

function isTwoPair(cards) {
  let groups = findGroups(cards);
  if (groups[0][1] === 2 && groups[1][1] === 2) {
    return {
      rank: 3,
      cards: cards
        .filter(
          (card) =>
            card.rank === parseInt(groups[0][0]) ||
            card.rank === parseInt(groups[1][0])
        )
        .slice(0, 4),
    };
  }
  return null;
}

function isOnePair(cards) {
  let groups = findGroups(cards);
  if (groups[0][1] === 2) {
    return {
      rank: 2,
      cards: cards
        .filter((card) => card.rank === parseInt(groups[0][0]))
        .slice(0, 2),
    };
  }
  return null;
}

function highCard(cards) {
  return { rank: 1, cards: cards.slice(0, 5) };
}

function evaluateHand(hand, community) {
  let cards = hand.concat(community).map(normalizeCard);
  cards = sortCards(cards); // Sorts cards by rank from highest to lowest

  let evaluatedHand =
    isRoyalFlush(cards) ||
    isStraightFlush(cards) ||
    isFourOfAKind(cards) ||
    isFullHouse(cards) ||
    isFlush(cards) ||
    isStraight(cards) ||
    isThreeOfAKind(cards) ||
    isTwoPair(cards) ||
    isOnePair(cards) ||
    highCard(cards);

  // Add remaining cards as potential kickers in sorted order
  if (evaluatedHand) {
    let handRanks = evaluatedHand.cards.map((card) => card.rank);
    let kickers = cards
      .filter((card) => !handRanks.includes(card.rank))
      .slice(0, 5 - evaluatedHand.cards.length);
    evaluatedHand.cards = evaluatedHand.cards.concat(kickers); // Combine hand cards with kickers
  }

  return evaluatedHand;
}

function determineWinner(hand1, hand2, communityCards) {
  let player1Hand = evaluateHand(hand1, communityCards);
  let player2Hand = evaluateHand(hand2, communityCards);

  if (player1Hand.rank > player2Hand.rank) {
    return "Player 1 wins with " + handRankToString(player1Hand.rank);
  } else if (player1Hand.rank < player2Hand.rank) {
    return "Player 2 wins with " + handRankToString(player2Hand.rank);
  } else {
    // Compare each card for kicker determination, given that the ranks are the same
    for (let i = 0; i < player1Hand.cards.length; i++) {
      if (player1Hand.cards[i].rank > player2Hand.cards[i].rank) {
        return "Player 1 wins with higher kicker: " + player1Hand.cards[i].rank;
      } else if (player1Hand.cards[i].rank < player2Hand.cards[i].rank) {
        return "Player 2 wins with higher kicker: " + player2Hand.cards[i].rank;
      }
    }
    return "It's a tie";
  }
}

function handRankToString(rank) {
  const rankNames = [
    "",
    "High Card",
    "One Pair",
    "Two Pair",
    "Three of a Kind",
    "Straight",
    "Flush",
    "Full House",
    "Four of a Kind",
    "Straight Flush",
    "Royal Flush",
  ];
  return rankNames[rank];
}

console.log(
  determineWinner(["9c", "8c"], ["Ah", "Kh"], ["7c", "6h", "9c", "Js", "2s"])
);
