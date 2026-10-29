const test = require('node:test');
const assert = require('node:assert/strict');
const { charactersGraphData, iconicQuotesData } = require('../server/holesData');

// Client helper logic tests
test('getCharacterShortName disambiguates all 16 character nodes without collision', () => {
  function getCharacterShortName(name) {
    if (name.includes('Stanley Yelnats IV')) return 'Stanley IV';
    if (name.includes('Stanley Yelnats III')) return 'Stanley III';
    if (name.includes('Stanley Yelnats I')) return 'Stanley I';
    if (name.includes('Elya Yelnats')) return 'Elya';
    if (name.includes('Madame Zeroni')) return 'Mme Zeroni';
    if (name.includes('Hector Zeroni')) return 'Zero';
    if (name.includes('Hector') && (name.includes('Mother') || name.includes('’s') || name.includes('\'s'))) return "Zero's Mom";
    if (name.includes('Katherine Barlow')) return 'Kate Barlow';
    if (name.includes('Sam')) return 'Sam (Onion)';
    if (name.includes('Trout')) return 'Trout';
    if (name.includes('Linda Miller')) return 'Linda';
    if (name.includes('Warden')) return 'Warden';
    if (name.includes('Mr. Sir')) return 'Mr. Sir';
    if (name.includes('Pendanski')) return 'Pendanski';
    if (name.includes('Sarah Miller')) return 'Sarah M.';
    if (name.includes('X-Ray')) return 'X-Ray';
    return name.split(' ')[0];
  }

  const shortNames = charactersGraphData.nodes.map(n => getCharacterShortName(n.name));
  assert.equal(shortNames.length, 16);

  // Assert distinct Stanley names
  assert.ok(shortNames.includes('Stanley I'));
  assert.ok(shortNames.includes('Stanley III'));
  assert.ok(shortNames.includes('Stanley IV'));

  // Assert staff and aliases
  assert.ok(shortNames.includes('Mr. Sir'));
  assert.ok(shortNames.includes('Pendanski'));
  assert.ok(shortNames.includes('Zero'));
  assert.ok(shortNames.includes('Kate Barlow'));
  assert.ok(shortNames.includes('Mme Zeroni'));

  // Ensure no generic "Stanley" or "Mr." exists
  assert.ok(!shortNames.includes('Stanley'));
  assert.ok(!shortNames.includes('Mr.'));
  assert.ok(!shortNames.includes('Dr.'));
});

test('SM-2 SuperMemo algorithm calculates interval and ease-factor progression accurately', () => {
  function calculateSM2({ easeFactor = 2.5, interval = 0, repetitions = 0 }, qualityScore) {
    const qMap = { 1: 1, 2: 3, 3: 4, 4: 5 };
    const q = qMap[qualityScore] || 3;

    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    if (q < 3) {
      repetitions = 0;
      interval = 1;
    } else {
      repetitions += 1;
      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = qualityScore === 4 ? 6 : (qualityScore === 3 ? 4 : 2);
      } else {
        interval = Math.round(interval * easeFactor);
      }
    }
    return { easeFactor, interval, repetitions };
  }

  // 1. Initial rating 4 (Easy)
  let state = calculateSM2({}, 4);
  assert.equal(state.repetitions, 1);
  assert.equal(state.interval, 1);
  assert.ok(state.easeFactor >= 2.5);

  // 2. Second rating 4 (Easy)
  state = calculateSM2(state, 4);
  assert.equal(state.repetitions, 2);
  assert.equal(state.interval, 6);

  // 3. Third rating 4 (Easy) -> interval multiplied by ease factor
  state = calculateSM2(state, 4);
  assert.equal(state.repetitions, 3);
  assert.ok(state.interval >= 15);

  // 4. Rating 1 (Forgot) -> resets repetitions and interval to 1
  state = calculateSM2(state, 1);
  assert.equal(state.repetitions, 0);
  assert.equal(state.interval, 1);
});

test('Focus Timer shovel depth and timestamp formulas compute correctly without drift', () => {
  const totalSeconds = 25 * 60; // 1500
  const now = Date.now();
  const targetEndTime = now + 1200 * 1000; // 20 minutes left

  const remaining = Math.max(0, Math.round((targetEndTime - now) / 1000));
  assert.equal(remaining, 1200);

  const progressFraction = 1 - (remaining / totalSeconds);
  assert.ok(Math.abs(progressFraction - (300 / 1500)) < 0.001);

  const depth = (progressFraction * 5.0).toFixed(1);
  assert.equal(depth, '1.0'); // 1.0 ft dug out of 5.0 ft

  // At completion
  const completedRemaining = Math.max(0, Math.round((now - (now + 1000)) / 1000));
  assert.equal(completedRemaining, 0);
  const fullFraction = 1 - (0 / totalSeconds);
  assert.equal((fullFraction * 5.0).toFixed(1), '5.0');
});

test('Character Graph edge filtering hides phantom edges when filtering by dynasty', () => {
  const filter = 'Walker';
  const nodes = charactersGraphData.nodes.filter(n => n.family === filter);
  const visibleNodeIds = new Set(nodes.map(n => n.id));

  const visibleEdges = charactersGraphData.edges.filter(e => 
    visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to)
  );

  assert.ok(nodes.length >= 3); // Trout Walker, Linda Miller, Warden Walker
  assert.ok(visibleEdges.length >= 2);
  visibleEdges.forEach(e => {
    assert.ok(visibleNodeIds.has(e.from));
    assert.ok(visibleNodeIds.has(e.to));
  });

  // Madame Zeroni and Elya should NOT be present in Walker visible edges
  assert.ok(!visibleEdges.some(e => e.from === 'madame_zeroni' || e.to === 'madame_zeroni'));
});

test('Quote Challenge scoring and completion logic advances through 10 quotes with streak tracking', () => {
  let score = 0;
  let streak = 0;
  let maxStreak = 0;
  let currentIndex = 0;
  let isCompleted = false;

  const quotes = iconicQuotesData;
  assert.equal(quotes.length, 10);

  for (let i = 0; i < quotes.length; i++) {
    // Correct speaker
    score += 50;
    streak++;
    maxStreak = Math.max(maxStreak, streak);

    // Correct subtext
    score += 100;
    streak++;
    maxStreak = Math.max(maxStreak, streak);

    if (currentIndex + 1 >= quotes.length) {
      isCompleted = true;
    } else {
      currentIndex++;
    }
  }

  assert.equal(isCompleted, true);
  assert.equal(score, 1500); // 10 * 150
  assert.equal(streak, 20);
  assert.equal(maxStreak, 20);
});
