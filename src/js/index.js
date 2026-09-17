import { createKeyboardNavigation } from './keyboard.js';
import { createHintNavigation } from './hints.js';

const container = document.querySelector('.content');
const pagesList = Array.from(document.querySelectorAll('.content > .page'));
const hintsList = Array.from(document.querySelectorAll('.page__hint'));

if (container && pagesList.length > 0) {
    createKeyboardNavigation(container, pagesList);
}

if (hintsList.length > 0) {
    createHintNavigation(hintsList);
}
