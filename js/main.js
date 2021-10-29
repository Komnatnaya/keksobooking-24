import { loadHousings } from './data.js';
import {
  setValidationForm,
  toggleFormActivity,
  toggleFiltersActivity,
  setFormSubmit,
  resetForm
} from './form.js';
import { createMap, addSimilarMarkers } from './map.js';
import { onErrorNotice, onSuccessUserNotice, onErrorUserNotice } from './util.js';

const AMOUNT_OF_HOUSING = 10;

toggleFiltersActivity(false);
toggleFormActivity(false);

const onSuccess = (housings) => {
  addSimilarMarkers(housings.slice(0, AMOUNT_OF_HOUSING));
  toggleFiltersActivity(true);
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
  loadHousings(onSuccess, onErrorNotice);
};

createMap(onMapLoading);
