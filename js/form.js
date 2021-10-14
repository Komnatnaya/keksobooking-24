const form = document.querySelector('.ad-form');
const filters = document.querySelector('.map__filters');
const formElements = ['fieldset', 'select'];

const togglePageActivity = (isActive = false) => {
  if (isActive) {
    form.classList.remove('ad-form--disabled');
    filters.classList.remove('map__filters--disabled');
  } else {
    form.classList.add('ad-form--disabled');
    filters.classList.add('map__filters--disabled');
  }

  [...form.elements, ...filters.elements]
    .filter((elem) => formElements.includes(elem.tagName.toLowerCase()))
    .forEach((elem) => elem.disabled = !isActive);
};

export { togglePageActivity };

