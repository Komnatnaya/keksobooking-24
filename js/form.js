import { getDeclension ,getImageChecking } from './util.js';
import { sendData } from './data.js';
import { resetMap, getMarkerCoordinates, removeSimilarMarkers, addSimilarMarkers } from './map.js';
import { AMOUNT_OF_HOUSING } from './const.js';

const userFormElement = document.querySelector('.ad-form');
const filtersFormElement = document.querySelector('.map__filters');
const titleElement = userFormElement.querySelector('#title');
const typeElement = userFormElement.querySelector('#type');
const priceElement = userFormElement.querySelector('#price');
const capacityElement = userFormElement.querySelector('#capacity');
const buttonSubmitElement = userFormElement.querySelector('.ad-form__submit');
const roomElement = userFormElement.querySelector('#room_number');
const checkInElement = userFormElement.querySelector('#timein');
const checkOutElement = userFormElement.querySelector('#timeout');
const buttonResetElement = userFormElement.querySelector('.ad-form__reset');
const addressElement = userFormElement.querySelector('#address');
const housingTypeElement = filtersFormElement.querySelector('#housing-type');
const housingPriceElement = filtersFormElement.querySelector('#housing-price');
const housingRoomsElement =  filtersFormElement.querySelector('#housing-rooms');
const housingGuestsElement =  filtersFormElement.querySelector('#housing-guests');
const featuresElements = filtersFormElement.querySelectorAll('.map__checkbox');
const avatarChooseElement = userFormElement.querySelector('#avatar');
const previewElement = userFormElement.querySelector('.ad-form-header__preview img');
const imageChooseElement = userFormElement.querySelector('#images');
const imageContainerElement = userFormElement.querySelector('.ad-form__photo');

const formTags = ['fieldset', 'select'];
const initialPreviewSrc = previewElement.src;

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

const toggleBoxShadow = (elem, isAdded) => elem.style.boxShadow = (isAdded === true) ? ATTENTION_STYLE : '';

const toggleElementActivity = (node, isActive) => {
  [...node.elements]
    .filter((elem) => formTags.includes(elem.tagName.toLowerCase()))
    .forEach((elem) => elem.disabled = !isActive);
};

const toggleFormActivity = (isActive = false) => {
  toggleElementActivity(userFormElement, isActive);
  if (isActive) {
    userFormElement.classList.remove(DisabledClass.FORM);
    return;
  }

  userFormElement.classList.add(DisabledClass.FORM);
};

const toggleFiltersActivity = (isActive = false) => {
  toggleElementActivity(filtersFormElement, isActive);
  if (isActive) {
    filtersFormElement.classList.remove(DisabledClass.FILTERS);
    return;
  }

  filtersFormElement.classList.add(DisabledClass.FILTERS);
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
  const rooms = Number(roomElement.value);
  const guests = Number(capacityElement.value);
  const roomDec = getDeclension(rooms, [Room.VALUE_1, Room.VALUE_2]);
  const guestDec = getDeclension(rooms, [Guest.SINGLE, Guest.SEVERAL, Guest.MANY]);

  if (rooms < guests && rooms !== MAX_ROOM_CAPACITY) {
    addCustomValidity(capacityElement, `В ${rooms} ${roomDec} максимум ${rooms} ${guestDec}`);
    return;
  }

  if (rooms === MAX_ROOM_CAPACITY && guests !== 0) {
    addCustomValidity(capacityElement, 'Не для гостей');
    return;
  }

  if (guests === 0 && rooms !== MAX_ROOM_CAPACITY) {
    addCustomValidity(capacityElement, 'Укажите количество мест');
    return;
  }

  removeCustomValidity(capacityElement);
};

const validatePrice = () => {
  if (Number(priceElement.value) < Number(priceElement.min)) {
    addCustomValidity(priceElement, `Минимальная цена ${priceElement.min}`);
    return;
  }

  removeCustomValidity(priceElement);
};

const setMinPriceAttributes = () => {
  const minPrice = ApartmentMinPrice[typeElement.value.toUpperCase()];
  priceElement.placeholder = minPrice;
  priceElement.min = minPrice;
};

const validateTitle = () => {
  const count = titleElement.value.length;
  const message = getDeclension(
    MIN_TITLE_LENGTH - count,
    [TooltipText.VALUE_1, TooltipText.VALUE_2, TooltipText.VALUE_3],
  );

  if (count > 0 && count < MIN_TITLE_LENGTH) {
    addCustomValidity(titleElement, `Еще ${MIN_TITLE_LENGTH - count} ${message}`);
    return;
  }

  removeCustomValidity(titleElement);
};

const reset = (housings) => {
  resetMap();
  userFormElement.reset();
  previewElement.src = initialPreviewSrc;
  imageContainerElement.innerHTML = '';
  filtersFormElement.reset();
  setTimeout(() => {
    addressElement.value = `${getMarkerCoordinates().lat.toFixed(DIGITS)}, ${getMarkerCoordinates().lng.toFixed(DIGITS)}`;
    setMinPriceAttributes();
  });

  housings && removeSimilarMarkers();
  housings && addSimilarMarkers(housings);
  [...userFormElement.elements].forEach((elem) => toggleBoxShadow(elem));
};

const setValidation = () => {
  titleElement.addEventListener('input', () => {
    validateTitle();
  });

  priceElement.addEventListener('input', () => {
    validatePrice();
  });

  typeElement.addEventListener('change', () => {
    setMinPriceAttributes();
    validatePrice();
  });

  capacityElement.addEventListener('change', () => {
    validateCapacity();
  });

  roomElement.addEventListener('change', () => {
    validateCapacity();
  });

  buttonSubmitElement.addEventListener('click', () => {
    [...userFormElement.elements]
      .filter((elem) => !elem.checkValidity())
      .forEach((elem) => toggleBoxShadow(elem, true));
  });

  checkInElement.addEventListener('change', () => {
    checkOutElement.value = checkInElement.value;
  });

  checkOutElement.addEventListener('change', () => {
    checkInElement.value = checkOutElement.value;
  });
};

const setSubmit = (onSuccess, onError) => {
  userFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();

    sendData(
      onSuccess,
      onError,
      new FormData(evt.target),
    );
  });
};

const setReset = (callback) => {
  buttonResetElement.addEventListener('click', () => {
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
  const selectedFeatures = [...featuresElements]
    .filter(({checked}) => checked)
    .map(({defaultValue}) => defaultValue);

  const filteredHousings = housings.slice()
    .filter(
      ({offer}) => getTypeCompare(housingTypeElement.value, offer.type)
      && getPriceCompare(housingPriceElement.value, offer.price)
      && getNumberCompare(housingRoomsElement.value, offer.rooms)
      && getNumberCompare(housingGuestsElement.value, offer.guests)
      && getFeaturesCompare(offer.features, selectedFeatures),
    );

  removeSimilarMarkers();
  addSimilarMarkers(filteredHousings.slice(0, AMOUNT_OF_HOUSING));
};

const setFiltersChange = (callback) => {
  filtersFormElement.addEventListener('change', () => {
    callback();
  });
};

const setAvatarUploading = () => {
  avatarChooseElement.addEventListener('change', () => {
    if (getImageChecking(avatarChooseElement)) {
      previewElement.src = URL.createObjectURL(avatarChooseElement.files[0]);
    }
  });
};

const setPhotoUploading = () => {
  imageChooseElement.addEventListener('change', () => {
    if (getImageChecking(imageChooseElement)) {
      const styleWidth = getComputedStyle(imageContainerElement).width;
      const styleHeight = getComputedStyle(imageContainerElement).height;
      const image = document.createElement('img');
      image.src = URL.createObjectURL(imageChooseElement.files[0]);
      image.width = parseInt(styleWidth, 10);
      image.height = parseInt(styleHeight, 10);
      image.style.objectFit = 'fill';
      imageContainerElement.innerHTML = '';
      imageContainerElement.append(image);
    }
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
  getFiltered,
  setAvatarUploading,
  setPhotoUploading
};
