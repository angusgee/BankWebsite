'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

///////////////////////////////////////
// MODAL WINDOW
// open modal and prevent scroll to top of page
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// loop over all CTA btns and add event listeners
btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

// close modal on click outside modal or on close btn
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// close modal on Esc key press
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///////////////////////////////////////

////////////////////////////////////////
// SMOOTH SCROLLING

// "Learn more" btn
btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Nav links
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', function (e) {
    // prevent the href from overriding the event handler
    e.preventDefault();
    // get the ID of the target section from the href attribute
    const sectionId = this.getAttribute('href');
    // get the target section using its ID
    const section = document.querySelector(sectionId);
    // if the target exists, scroll to it smoothly
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

////////////////////////////////////////

////////////////////////////////////////
// TABBED COMPONENT

// adding event listeners to all elements by looping over them all is avoidable
// this would result in many unnecessary copies of this code
// tabs.forEach(tab => tab.addEventListener('click', () => console.log('Tab clicked')))

// let's use event delegation instead
// apply the event handler to the parent element
tabsContainer.addEventListener('click', function (e) {
  // use closest method to avoid accidentally selection the span element
  const clicked = e.target.closest('.operations__tab');

  // log the target to check the event handler works
  console.log(clicked);

  // guard clause
  if (!clicked) return;

  // remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // add the active class to the target
  clicked.classList.add('operations__tab--active');

  // activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
////////////////////////////////////////

////////////////////////////////////////
// STICKY NAVIGATION

//////////////////
//  OLD WAY - SCROLL EVENT - avoid! use intersection API instead
//
// const initialXY = section1.getBoundingClientRect();
// console.log(initialXY);
//
// scroll event is not efficient - AVOID
// far too many events are generated as the user moves around the page
// window.addEventListener('scroll', function (e) {
//   console.log(this.scrollY);

//   if (window.scrollY > initialXY.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });
//////////////////

//////////////////
//  INTERSECTION API
//
// Create an instance of an intersection observer
// Pass it a callback func and config
// The cb func adds the sticky class to the nav bar

// get height of nav bar
const navHeight = nav.getBoundingClientRect().height;

// Callback func
const stickyNav = function (entries) {
  // get first element of array using destructuring
  const [entry] = entries;

  // if the entry is not intersecting, add sticky class
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};

// Threshold of 0 captures the header section disappearing from view
// Subtract height of nav bar to align the hr at the start of section--1
const headerObserverOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

// Intersection observer (callback func, config)
const headerObserver = new IntersectionObserver(
  stickyNav,
  headerObserverOptions
);

// Call observe on the header
headerObserver.observe(header);

////////////////////////////////////////

////////////////////////////////////////
//  REVEAL SECTIONS
//

const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  console.log(typeof entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

////////////////////////////////////////
