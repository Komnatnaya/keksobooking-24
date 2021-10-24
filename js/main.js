import { getHousing } from './mock-data.js';
import { togglePageActivity, setValidationForm } from './form.js';
import { createMap, addSimilarMarkers } from './map.js';

const AMOUNT_OF_HOUSING = 10;

const onMapSuccessLoading = () => {
  togglePageActivity(true);
  setValidationForm();
};

togglePageActivity(false);

createMap(onMapSuccessLoading);

const housings = Array.from({length: AMOUNT_OF_HOUSING}, getHousing);

addSimilarMarkers(housings);
