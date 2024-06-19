import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { main } from '../src/index.js';
import { resolve } from '../src/util/path.js';
import baseArguments from './helpers/baseArguments.js';
import baseCounters from './helpers/baseCounters.js';

const cwd = resolve('fixtures/jsdoc-exports');

test('Find exports from jsdoc @type tags', async () => {
  const { issues, counters } = await main({
    ...baseArguments,
    cwd,
    tags: [[], ['ignoreunresolved']],
  });

  assert(issues.exports['module.js']['alphaFn']);
  assert(issues.exports['module.js']['internalUnusedFn']);
  assert(issues.exports['module.js']['invalidTaggedFn']);
  assert(issues.exports['module.js']['unusedFn']);

  assert.deepEqual(counters, {
    ...baseCounters,
    exports: 4,
    processed: 3,
    total: 3,
  });
});

test('Find exports from jsdoc @type tags (production)', async () => {
  const { issues, counters } = await main({
    ...baseArguments,
    cwd,
    isProduction: true,
    tags: [[], ['ignoreunresolved']],
  });

  assert(issues.exports['module.js']['alphaFn']);
  assert(issues.exports['module.js']['invalidTaggedFn']);
  assert(issues.exports['module.js']['unusedFn']);

  assert.deepEqual(counters, {
    ...baseCounters,
    exports: 3,
    processed: 2,
    total: 2,
  });
});
