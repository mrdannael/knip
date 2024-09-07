const isRegexLike = /[*+\\(|{^$]/;
export const toRegexOrString = (value: string | RegExp) =>
  typeof value === 'string' && isRegexLike.test(value) ? new RegExp(value) : value;

export const findMatch = (haystack: undefined | (string | RegExp)[], needle: string) =>
  haystack?.find(n => (typeof n === 'string' ? n === needle : n.test(needle)));

const idCharMatch = /[a-zA-Z0-9$_]/;
export const isIdChar = (text: string) => idCharMatch.test(text);
