import { getDeclension } from './util.js';

const templateCard = document.querySelector('#card').content.querySelector('.popup');
const fragment = document.createDocumentFragment();
const container = document.querySelector('.map__canvas');

const apartment = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};

const Guest = {
  SINGLE: 'гостя',
  MANY: 'гостей',
};

const Room = {
  VALUE_1: 'комната',
  VALUE_2: 'комнаты',
  VALUE_3: 'комнат',
};

const getPhotoNodes = (template, photos) => {
  const photoNodes = document.createDocumentFragment();

  photos.forEach((photoSrc) => {
    const node = template.cloneNode(true);
    node.src = photoSrc;
    photoNodes.append(node);
  });

  return photoNodes;
};

const getCardNode = ({author, offer}) => {
  const card = templateCard.cloneNode(true);

  const avatar = card.querySelector('.popup__avatar');
  const title = card.querySelector('.popup__title');
  const address = card.querySelector('.popup__text--address');
  const price = card.querySelector('.popup__text--price');
  const type = card.querySelector('.popup__type');
  const capacity = card.querySelector('.popup__text--capacity');
  const time = card.querySelector('.popup__text--time');
  const description = card.querySelector('.popup__description');
  const photoContainer = card.querySelector('.popup__photos');
  const templatePhoto = photoContainer.querySelector('.popup__photo');
  const featureContainer = card.querySelector('.popup__features');
  const features = featureContainer.querySelectorAll('.popup__feature');

  const rooms = getDeclension(offer.rooms, [Room.VALUE_1, Room.VALUE_2, Room.VALUE_3]);
  const guests = getDeclension(offer.guests, [Guest.SINGLE, Guest.MANY, Guest.MANY]);

  avatar.src = author.avatar || avatar.remove();
  title.textContent = offer.title;
  address.textContent= offer.address;
  price.textContent = `${offer.price} ₽/ночь`;
  type.textContent = apartment[offer.type];
  capacity.textContent = `${offer.rooms} ${rooms} для ${offer.guests} ${guests}`;
  time.textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;
  description.textContent = offer.description || description.remove();

  if (offer.photos.length) {
    photoContainer.append(getPhotoNodes(templatePhoto, offer.photos));
    templatePhoto.remove();
  } else { photoContainer.remove(); }

  features.forEach((elem) => {
    const classSlice = elem.className.split('--')[1];
    if (!offer.features.includes(classSlice)) { elem.remove(); }
  });

  if (!offer.features.length) { featureContainer.remove(); }

  return card;
};

const renderCards = (housings) => {
  housings.forEach((housing) => fragment.append(getCardNode(housing)));
  container.append(fragment);
};

export { renderCards };
