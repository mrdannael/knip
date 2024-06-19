import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { main } from '../src/index.js';
import { resolve } from '../src/util/path.js';
import baseArguments from './helpers/baseArguments.js';
import baseCounters from './helpers/baseCounters.js';

test('Support JSX/TSX files', async () => {
  const cwd = resolve('fixtures/react');

  const { counters } = await main({
    ...baseArguments,
    cwd,
  });

  assert.deepEqual(counters, {
    ...baseCounters,
    dependencies: 0,
    processed: 2,
    total: 2,
  });
});
