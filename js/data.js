const LOAD_FROM = 'https://24.javascript.pages.academy/keksobooking/data';

const loadHousings = (onSuccess, onError) => {
  fetch(LOAD_FROM)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.status} ${response.statusText}. Ошибка загрузки данных. Попробуйте перезагрузить страницу.`);
    })
    .then((housings) => onSuccess(housings))
    .catch(onError);
};

export { loadHousings };
