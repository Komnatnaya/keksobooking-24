import { getHousing } from './get-housing.js';

const AMOUNT_OF_HOUSING = 10;

const housings = Array.from({length: AMOUNT_OF_HOUSING}, getHousing);

housings;
