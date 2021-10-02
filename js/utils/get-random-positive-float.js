const getRandomPositiveFloat = (alpha, beta, digits = 1) => {
  const lower = Math.min(Math.abs(alpha), Math.abs(beta));
  const upper = Math.max(Math.abs(alpha), Math.abs(beta));
  const result = Math.random() * (upper - lower) + lower;

  return result.toFixed(digits);
};
