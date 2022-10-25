import is from '@sindresorhus/is';
import does from 'not-exist';
import has, { program } from './dep.js';

const what = is(has);

const match = typeof program === 'function';

console.log(what, match);
