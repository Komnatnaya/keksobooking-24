import { getHousing } from './mock-data.js';
import { setValidationForm, toggleFormActivity, toggleFiltersActivity } from './form.js';
import { createMap, addSimilarMarkers } from './map.js';

const AMOUNT_OF_HOUSING = 10;

const onMapSuccessLoading = () => {
  toggleFiltersActivity(true);
  toggleFormActivity(true);
  setValidationForm();
};

toggleFiltersActivity(false);
toggleFormActivity(false);

createMap(onMapSuccessLoading);

const housings = Array.from({length: AMOUNT_OF_HOUSING}, getHousing);

addSimilarMarkers(housings);
