import { createKeyboardNavigation } from './keyboard.js';

const pagesList = Array.from(document.querySelectorAll('.content > .page'));

if (pagesList.length > 0) {
    createKeyboardNavigation(pagesList);
}
