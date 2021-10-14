export const getRandomPositiveInteger = (alpha, beta) => {
  const lower = Math.ceil(Math.min(Math.abs(alpha), Math.abs(beta)));
  const upper = Math.floor(Math.max(Math.abs(alpha), Math.abs(beta)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

export const getRandomPositiveFloat = (alpha, beta, digits = 1) => {
  const lower = Math.min(Math.abs(alpha), Math.abs(beta));
  const upper = Math.max(Math.abs(alpha), Math.abs(beta));
  const result = Math.random() * (upper - lower) + lower;

  return result.toFixed(digits);
};

export const getDeclension = (number, titles) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[ (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5] ];
};
