const main = document.querySelector("#scroll-id");
const scrollPage1 = document.querySelector("#scroll-page-1");
const scrollPage2 = document.querySelector("#scroll-page-2");
const scrollPage3 = document.querySelector("#scroll-page-3");

const pages = [scrollPage1, scrollPage2, scrollPage3];
const scroll = new ScrollPage(main, pages);
scroll.init();