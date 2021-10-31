import { loadHousings } from './data.js';
import {
  setValidationForm,
  toggleFormActivity,
  toggleFiltersActivity,
  setFormSubmit,
  resetForm,
  setFiltering,
  setFormReset
} from './form.js';
import { createMap, addSimilarMarkers } from './map.js';
import { onErrorNotice, onSuccessUserNotice, onErrorUserNotice } from './util.js';
import { ZERO, AMOUNT_OF_HOUSING } from './const.js';

toggleFiltersActivity(false);
toggleFormActivity(false);

const onSuccess = (housings) => {
  addSimilarMarkers(housings.slice(ZERO, AMOUNT_OF_HOUSING));
  toggleFiltersActivity(true);
  setFiltering(housings);
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
