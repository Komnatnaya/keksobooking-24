const successNode = document.querySelector('#success')
  .content.querySelector('.success')
  .cloneNode(true);

const errorNode = document.querySelector('#error')
  .content.querySelector('.error')
  .cloneNode(true);

const container = document.querySelector('body');

const ESC_KEY = 'Escape';
const DELAY = 500;

const getDeclension = (number, titles) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[ (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5] ];
};

const onErrorNotice = (message) => {
  const notice = document.createElement('div');
  notice.style.padding = '5px';
  notice.style.backgroundColor = 'crimson';
  notice.style.position = 'absolute';
  notice.style.top = '0';
  notice.style.left = '0';
  notice.style.right = '0';
  notice.style.color = 'white';
  notice.style.zIndex = '999';
  notice.style.fontSize = '26px';
  notice.style.textAlign = 'center';
  notice.textContent = message;
  document.querySelector('main').append(notice);
};

const showNotice = (node) => {
  const onWindowKeydown = (evt) => {
    if (evt.key === ESC_KEY) {
      node.remove();
      window.removeEventListener('keydown', onWindowKeydown);
    }
  };

  container.append(node);
  node.addEventListener('click', () => {
    node.remove();
    window.removeEventListener('keydown', onWindowKeydown);
  });

  window.addEventListener('keydown', onWindowKeydown);
};

const onSuccessUserNotice = () => showNotice(successNode);
const onErrorUserNotice = () => showNotice(errorNode);

const debounce = (callback, timeoutDelay = DELAY) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export {
  getDeclension,
  onErrorNotice,
  onSuccessUserNotice,
  onErrorUserNotice,
  debounce
};
