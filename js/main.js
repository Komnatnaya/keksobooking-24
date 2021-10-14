import { getHousing } from './mock-data.js';
import { renderCards } from './render-cards.js';

const AMOUNT_OF_HOUSING = 10;

const housings = Array.from({length: AMOUNT_OF_HOUSING}, getHousing);

renderCards([housings[0]]);
