import { loadHousings } from './data.js';
import {
  setValidationForm,
  toggleFormActivity,
  toggleFiltersActivity,
  setFormSubmit,
  resetForm,
  setFormReset,
  setFiltersChange,
  getFiltered
} from './form.js';
import { createMap, addSimilarMarkers } from './map.js';
import { onErrorNotice, onSuccessUserNotice, onErrorUserNotice, debounce } from './util.js';
import { ZERO, AMOUNT_OF_HOUSING, INITIAL_KEY } from './const.js';

toggleFiltersActivity(false);
toggleFormActivity(false);

const onSuccess = (housings) => {
  addSimilarMarkers(housings.slice(ZERO, AMOUNT_OF_HOUSING));
  toggleFiltersActivity(true);
  setFiltersChange(
    debounce(()=> {
      getFiltered(housings);
    }));
  localStorage.removeItem(INITIAL_KEY);
  localStorage.setItem(INITIAL_KEY, JSON.stringify(housings.slice(ZERO, AMOUNT_OF_HOUSING)));
};

const onMapLoading = () => {
  toggleFormActivity(true);
  setValidationForm();
  setFormSubmit(
    () => {
      onSuccessUserNotice();
      resetForm();
    },
    onErrorUserNotice,
  );
  setFormReset(resetForm);
  loadHousings(onSuccess, onErrorNotice);
};

createMap(onMapLoading);
