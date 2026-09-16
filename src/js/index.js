import { createKeyboardNavigation } from './keyboard.js';

const container = document.querySelector('.content');
const pagesList = Array.from(document.querySelectorAll('.content > .page'));

if (container && pagesList.length > 0) {
    createKeyboardNavigation(container, pagesList);
}
