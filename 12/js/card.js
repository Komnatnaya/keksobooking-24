import { getDeclension } from './util.js';

const templateCardElement = document.querySelector('#card').content.querySelector('.popup');

const Apartment = {
  FLAT: 'Квартира',
  BUNGALOW: 'Бунгало',
  HOUSE: 'Дом',
  PALACE: 'Дворец',
  HOTEL: 'Отель',
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

const getNode = ({author, offer}) => {
  const card = templateCardElement.cloneNode(true);

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
  const capacityDescription = `${offer.rooms} ${rooms} для ${offer.guests} ${guests}`;
  const timeDescription = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;

  avatar.src = author.avatar || avatar.remove();
  title.textContent = offer.title;
  address.textContent= offer.address;
  price.textContent = offer.price ? `${offer.price} ₽/ночь`: price.remove();
  type.textContent = offer.type ? Apartment[offer.type.toUpperCase()] : type.remove();
  capacity.textContent = offer.rooms && offer.guests ? capacityDescription : capacity.remove();
  time.textContent = offer.checkin && offer.checkout ? timeDescription : time.remove();
  description.textContent = offer.description || description.remove();

  if (offer.photos && offer.photos.length) {
    photoContainer.append(getPhotoNodes(templatePhoto, offer.photos));
    templatePhoto.remove();
  } else { photoContainer.remove(); }

  offer.features && features.forEach((elem) => {
    const classSlice = elem.className.split('--')[1];
    if (!offer.features.includes(classSlice)) { elem.remove(); }
  });

  if (!offer.features || !offer.features.length) { featureContainer.remove(); }

  return card;
};

export { getNode as getCardNode };
