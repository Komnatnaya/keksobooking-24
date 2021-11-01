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
import { AMOUNT_OF_HOUSING } from './const.js';

toggleFiltersActivity(false);
toggleFormActivity(false);

const onSuccess = (housings) => {
  addSimilarMarkers(housings.slice(0, AMOUNT_OF_HOUSING));
  toggleFiltersActivity(true);
  setFiltersChange(
    debounce(()=> {
      getFiltered(housings);
    }));
};

const onMapLoading = () => {
  let initialHousings = null;

  toggleFormActivity(true);
  setValidationForm();
  loadHousings()
    .then((housings) => {
      onSuccess(housings);
      initialHousings = housings.slice(0, AMOUNT_OF_HOUSING);
    })
    .catch(onErrorNotice);

  setFormSubmit(() => {
    onSuccessUserNotice();
    resetForm(initialHousings);
  },
  onErrorUserNotice,
  );

  setFormReset(() => {
    resetForm(initialHousings);
  });
};

createMap(onMapLoading);
