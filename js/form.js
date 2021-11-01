import { getDeclension } from './util.js';
import { sendData } from './data.js';
import { resetMap, getMarkerCoordinates, removeSimilarMarkers, addSimilarMarkers } from './map.js';
import { AMOUNT_OF_HOUSING } from './const.js';

const form = document.querySelector('.ad-form');
const filters = document.querySelector('.map__filters');
const formElements = ['fieldset', 'select'];
const inputTitle = form.querySelector('#title');
const inputType = form.querySelector('#type');
const inputPrice = form.querySelector('#price');
const inputCapacity = form.querySelector('#capacity');
const formButtonSubmit = form.querySelector('.ad-form__submit');
const roomNumber = form.querySelector('#room_number');
const checkIn = form.querySelector('#timein');
const checkOut = form.querySelector('#timeout');
const resetButton = form.querySelector('.ad-form__reset');
const address = form.querySelector('#address');

const TooltipText = {
  VALUE_1: 'символ',
  VALUE_2: 'символа',
  VALUE_3: 'символов',
};

const MIN_TITLE_LENGTH = 30;
const MAX_ROOM_CAPACITY = 100;
const DIGITS = 5;

const ApartmentMinPrice = {
  FLAT: 1000,
  BUNGALOW: 0,
  HOUSE: 5000,
  PALACE: 10000,
  HOTEL: 3000,
};

const Room = {
  VALUE_1: 'комнатe',
  VALUE_2: 'комнатах',
};

const Guest = {
  SINGLE: 'гость',
  SEVERAL: 'гостя',
  MANY: 'гостей',
};

const DisabledClass = {
  FORM: 'ad-form--disabled',
  FILTERS: 'map__filters--disabled',
};

const Price = {
  MIN: 10000,
  MAX: 50000,
};

const PriceLevel = {
  LOW: 'low',
  MIDDLE: 'middle',
  HIGH: 'high',
};

const DEFAULT_CHOICE = 'any';

const ATTENTION_STYLE = '0 0 2px 2px #ff6547';

const toggleBoxShadow = (elem, isAdded) => elem.style.boxShadow = isAdded ? ATTENTION_STYLE : '';

const toggleElementActivity = (node, isActive) => {
  [...node.elements]
    .filter((elem) => formElements.includes(elem.tagName.toLowerCase()))
    .forEach((elem) => elem.disabled = !isActive);
};

const toggleFormActivity = (isActive = false) => {
  toggleElementActivity(form, isActive);
  if (isActive) {
    form.classList.remove(DisabledClass.FORM);
    return;
  }

  form.classList.add(DisabledClass.FORM);
};

const toggleFiltersActivity = (isActive = false) => {
  toggleElementActivity(filters, isActive);
  if (isActive) {
    filters.classList.remove(DisabledClass.FILTERS);
    return;
  }

  filters.classList.add(DisabledClass.FILTERS);
};

const addCustomValidity = (elem, text) => {
  elem.setCustomValidity(text);
  elem.reportValidity();
};

const removeCustomValidity = (elem) => {
  elem.setCustomValidity('');
  toggleBoxShadow(elem);
};

const validateCapacity = () => {
  const rooms = Number(roomNumber.value);
  const guests = Number(inputCapacity.value);
  const roomDec = getDeclension(rooms, [Room.VALUE_1, Room.VALUE_2]);
  const guestDec = getDeclension(rooms, [Guest.SINGLE, Guest.SEVERAL, Guest.MANY]);

  if (rooms < guests && rooms !== MAX_ROOM_CAPACITY) {
    addCustomValidity(inputCapacity, `В ${rooms} ${roomDec} максимум ${rooms} ${guestDec}`);
    return;
  }

  if (rooms === MAX_ROOM_CAPACITY && guests !== 0) {
    addCustomValidity(inputCapacity, 'Не для гостей');
    return;
  }

  if (guests === 0 && rooms !== MAX_ROOM_CAPACITY) {
    addCustomValidity(inputCapacity, 'Укажите количество мест');
    return;
  }

  removeCustomValidity(inputCapacity);
};

const validatePrice = () => {
  if (Number(inputPrice.value) < Number(inputPrice.min)) {
    addCustomValidity(inputPrice, `Минимальная цена ${inputPrice.min}`);
    return;
  }

  removeCustomValidity(inputPrice);
};

const setMinPriceAttributes = () => {
  const minPrice = ApartmentMinPrice[inputType.value.toUpperCase()];
  inputPrice.placeholder = minPrice;
  inputPrice.min = minPrice;
};

const validateTitle = () => {
  const count = inputTitle.value.length;
  const message = getDeclension(
    MIN_TITLE_LENGTH - count,
    [TooltipText.VALUE_1, TooltipText.VALUE_2, TooltipText.VALUE_3],
  );

  if (count > 0 && count < MIN_TITLE_LENGTH) {
    addCustomValidity(inputTitle, `Еще ${MIN_TITLE_LENGTH - count} ${message}`);
    return;
  }

  removeCustomValidity(inputTitle);
};

const reset = (housings) => {
  resetMap();
  form.reset();
  filters.reset();
  setTimeout(() => {
    address.value = `${getMarkerCoordinates().lat.toFixed(DIGITS)}, ${getMarkerCoordinates().lng.toFixed(DIGITS)}`;
    setMinPriceAttributes();
  });

  removeSimilarMarkers();
  addSimilarMarkers(housings);
  [...form.elements].forEach((elem) => toggleBoxShadow(elem));
};

const setValidation = () => {
  inputTitle.addEventListener('input', () => {
    validateTitle();
  });

  inputPrice.addEventListener('input', () => {
    validatePrice();
  });

  inputType.addEventListener('change', () => {
    setMinPriceAttributes();
    validatePrice();
  });

  inputCapacity.addEventListener('change', () => {
    validateCapacity();
  });

  roomNumber.addEventListener('change', () => {
    validateCapacity();
  });

  formButtonSubmit.addEventListener('click', () => {
    [...form.elements]
      .filter((elem) => !elem.checkValidity())
      .forEach((elem) => toggleBoxShadow(elem, true));
  });

  checkIn.addEventListener('change', () => {
    checkOut.value = checkIn.value;
  });

  checkOut.addEventListener('change', () => {
    checkIn.value = checkOut.value;
  });
};

const setSubmit = (onSuccess, onError) => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    sendData(
      onSuccess,
      onError,
      new FormData(evt.target),
    );
  });
};

const setReset = (callback) => {
  resetButton.addEventListener('click', () => {
    callback();
  });
};

const getPriceCompare = (value, price) => {
  switch (value) {
    case PriceLevel.LOW:
      return price <= Price.MIN;
    case PriceLevel.MIDDLE:
      return price >= Price.MIN && price <= Price.MAX;
    case PriceLevel.HIGH:
      return price >= Price.MAX;
    default:
      return true;
  }
};

const getTypeCompare = (value, type) => value === DEFAULT_CHOICE ? true : value === type;
const getNumberCompare = (value, rooms) => value === DEFAULT_CHOICE ? true : Number(value) === rooms;

const getFeaturesCompare = (features, selectedFeatures) => {
  if (!features && selectedFeatures.length > 0) { return false; }
  if (selectedFeatures.length === 0) { return true; }

  for (let i = 0; i < selectedFeatures.length; i++) {
    const isHavingFeature = features.some((feature) => feature === selectedFeatures[i]);
    if (!isHavingFeature) { return false; }
  }

  return true;
};

const getFiltered = (housings) => {
  const type = filters.elements['housing-type'].value;
  const price = filters.elements['housing-price'].value;
  const rooms = filters.elements['housing-rooms'].value;
  const guests = filters.elements['housing-guests'].value;

  const selectedFeatures = [...filters.elements['features']]
    .filter(({checked}) => checked)
    .map(({defaultValue}) => defaultValue);

  const filteredHousings = housings.slice()
    .filter(
      ({offer}) => getTypeCompare(type, offer.type)
      && getPriceCompare(price, offer.price)
      && getNumberCompare(rooms, offer.rooms)
      && getNumberCompare(guests, offer.guests)
      && getFeaturesCompare(offer.features, selectedFeatures),
    );

  removeSimilarMarkers();
  addSimilarMarkers(filteredHousings.slice(0, AMOUNT_OF_HOUSING));
};

const setFiltersChange = (callback) => {
  filters.addEventListener('change', () => {
    callback();
  });
};

export {
  setValidation as setValidationForm,
  toggleFormActivity,
  toggleFiltersActivity,
  setSubmit as setFormSubmit,
  reset as resetForm,
  setReset as setFormReset,
  setFiltersChange,
  getFiltered
};
