import { getRandomPositiveInteger } from './util.js';
import { getRandomPositiveFloat } from './util.js';

const features = ['wifi' ,'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
const apartments = ['palace', 'flat', 'house', 'bungalow', 'hotel'];
const time = ['12:00', '13:00', '14:00'];
const TARGET_LENGTH = 2;
const PAD_STRING = '0';
const INITIAL_VALUE = 0;
const MAX_PHOTOS = 10;
const DIGITS = 5;
const Latitude = {
  MIN: 35.65000,
  MAX: 35.70000,
};
const Longitude = {
  MIN: 139.70000,
  MAX: 139.80000,
};
const Price = {
  MIN: 100,
  MAX: 10000,
};
const Rooms = {
  MIN: 1,
  MAX: 10,
};
const Guests = {
  MIN: 1,
  MAX: 15,
};

const photos = [
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg',
];

const getRandomPhotos = (arr) => {
  let amountPhotos = getRandomPositiveInteger(INITIAL_VALUE, MAX_PHOTOS);
  let index = null;
  const result = [];

  while (amountPhotos) {
    index = getRandomPositiveInteger(INITIAL_VALUE, arr.length - 1);
    result.push(arr.slice(index, index + 1).join(''));
    --amountPhotos;
  }

  return result;
};

const getRandomArray = (arr) => {
  const computedLength = getRandomPositiveInteger(INITIAL_VALUE + 1, arr.length);
  let count = computedLength;
  const result = new Set();
  let index = null;

  while (count) {
    index = getRandomPositiveInteger(INITIAL_VALUE, arr.length - 1);
    result.add(arr.slice(index, index + 1).join(''));
    --count;

    if (count === INITIAL_VALUE) {
      if (result.size !== computedLength) {
        ++count;
      }
    }
  }

  return Array.from(result);
};

const getNumberWithZero = () => {
  let number = INITIAL_VALUE;
  return () => String(++number).padStart(TARGET_LENGTH, PAD_STRING);
};

const getNumber = getNumberWithZero();

const getHousing = () => {
  const lat = getRandomPositiveFloat(Latitude.MIN, Latitude.MAX, DIGITS);
  const lng = getRandomPositiveFloat(Longitude.MIN, Longitude.MAX, DIGITS);

  return ({
    author: {
      avatar: `img/avatars/user${getNumber()}.png`,
    },
    offer: {
      title: 'Заголовок предложения',
      address: `${lat}, ${lng}`,
      price: getRandomPositiveInteger(Price.MIN, Price.MAX),
      type: apartments[getRandomPositiveInteger(INITIAL_VALUE, apartments.length - 1)],
      rooms: getRandomPositiveInteger(Rooms.MIN, Rooms.MAX),
      guests: getRandomPositiveInteger(Guests.MIN, Guests.MAX),
      checkin: time[getRandomPositiveInteger(INITIAL_VALUE, time.length - 1)],
      checkout: time[getRandomPositiveInteger(INITIAL_VALUE, time.length - 1)],
      features: getRandomArray(features),
      description: 'Описание помещения',
      photos: getRandomPhotos(photos),
    },
    location: {
      lat,
      lng,
    },
  });
};

export { getHousing };
