const MIN_VALUE = 0;

const getRandomInteger = (min, max) => {
  if (min > max || min < MIN_VALUE || max < MIN_VALUE) {
    return null;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomFloat = (min, max, floatValue) => {
  if (
    min > max ||
    min < MIN_VALUE ||
    max < MIN_VALUE ||
    floatValue <= MIN_VALUE
  ) {
    return null;
  }

  const randValue = Math.random() * (max - min) + min;
  return Number(randValue.toFixed(floatValue));
};

getRandomInteger(0, 42);
getRandomFloat(1.2, 1.4, 3);
