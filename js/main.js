const MIN_VALUE = 0;

const getRandomInteger = (min, max) => {
  if (min > max || min < MIN_VALUE || max < MIN_VALUE) {
    return null;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

getRandomInteger(0, 42);
