const LOAD_FROM = 'https://24.javascript.pages.academy/keksobooking/data';
const UPLOAD_TO = 'https://24.javascript.pages.academy/keksobooking';

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

const send = (onSuccess, onError, body) => {
  fetch(
    UPLOAD_TO,
    {
      method: 'POST',
      body,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSuccess();
        return;
      }
      throw new Error('Не удалось отправить форму. Попробуйте ещё раз');
    })
    .catch(onError);
};

export { loadHousings, send as sendData };
