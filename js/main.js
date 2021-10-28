import { loadHousings } from './data.js';
import { setValidationForm, toggleFormActivity, toggleFiltersActivity } from './form.js';
import { createMap, addSimilarMarkers } from './map.js';
import { onErrorNotice } from './util.js';

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
  loadHousings(onSuccess, onErrorNotice);
};

createMap(onMapLoading);
