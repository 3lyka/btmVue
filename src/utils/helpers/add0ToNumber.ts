/**
 * 1 -> 01,
 * 9 -> 09,
 * 10 -> 10,
 * 100 -> 100.
 * */
export function add0ToNumber(number: number) {
  return ('0' + number).slice(-2);
}
