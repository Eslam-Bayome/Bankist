'use strict';

///////////////////////////////////////
// Modal window

const header = document.querySelector('header');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const allOpr = document.querySelectorAll('.operations__content');
const oprationBtns = document.querySelector('.operations__tab-container');

const navLink = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');

const ourMassage = document.createElement('div');

//* slider
const allSlid = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const theDots = document.querySelector('.dots');

//&==============================================================
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//! ==============================================================
navLink.addEventListener('click', function (e) {
  if (e.target.getAttribute('href') === 'accountPage.html') return;
  e.preventDefault();
  if (
    e.target.hasAttribute('href') ||
    e.target.classList.contains('nav__link')
  ) {
    console.log(e.target.getAttribute('href'));
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});
//! ==============================================================

oprationBtns.addEventListener('click', function (e) {
  const click = e.target.closest('.operations__tab');

  let theNum = click.dataset.tab;

  if (!click) return;

  tabs.forEach(v => v.classList.remove('operations__tab--active'));

  allOpr.forEach(v => v.classList.remove('operations__content--active'));

  click.classList.add('operations__tab--active');

  [...allOpr]
    .find(v => v.classList.contains(`operations__content--${theNum}`))
    .classList.add('operations__content--active');
});
//? ==============================================================

function hoverNav(e) {
  if (e.target.classList.contains('nav__link')) {
    const clicked = e.target;
    let allSpl = clicked.closest('.nav').querySelectorAll('.nav__link');
    let logo = clicked.closest('.nav').querySelector('img');
    allSpl.forEach(sp => {
      if (sp !== clicked) {
        sp.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
}
nav.addEventListener('mouseover', hoverNav.bind(0.5));

nav.addEventListener('mouseout', hoverNav.bind(1));
//? ==============================================================
//* sticky nav

let theEleObs = document.querySelector('.header');
let navHeight = nav.getBoundingClientRect().height;
let observer = new IntersectionObserver(
  function (entries) {
    if (!entries[0].isIntersecting) {
      nav.classList.add('sticky');
    } else {
      nav.classList.remove('sticky');
    }
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  }
);
observer.observe(theEleObs);

//? ==============================================================
//* lazy img

let ourImg = document.querySelectorAll('img[data-src]');
let imgObserv = new IntersectionObserver(imgFun, {
  root: null,
  thresholdL: 0,
  rootMargin: '200px',
});
ourImg.forEach(img => {
  imgObserv.observe(img);
});
function imgFun(ent, obs) {
  let entry = ent[0];
  if (!entry.isIntersecting) return;
  entry.target.setAttribute('src', entry.target.dataset.src);
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  obs.unobserve(entry.target);
}
//? ==============================================================
// !Slider
let curSlid = 0;
// ^================================

function goToSlid(slide = 0) {
  allSlid.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
}
// ^================================

function rightslide() {
  if (curSlid == allSlid.length - 1) {
    curSlid = 0;
  } else {
    curSlid++;
  }
  goToSlid(curSlid);
  changeActiveBtn(curSlid);
}
// ^================================

function leftslide() {
  if (curSlid == 0) {
    curSlid = allSlid.length - 1;
  } else {
    curSlid--;
  }
  goToSlid(curSlid);
  changeActiveBtn(curSlid);
}
// ^================================
function createDot(numslid) {
  let cartona = '';
  for (let i = 0; i < numslid; i++) {
    cartona += `<button class="dots__dot" data-slide="${i}"></button>`;
  }
  theDots.innerHTML = cartona;
}
// ^================================
//~ dragger Slider
let isDragged = false;
let pxMoved = 0;
slider.addEventListener('mousedown', function (e) {
  isDragged = true;
  pxMoved = e.screenX;
});
slider.addEventListener('mousemove', function (e) {
  e.preventDefault();
  if (!isDragged) return;

  let scroll = e.screenX - pxMoved;
  if (scroll > 100) {
    leftslide();
    isDragged = false;
  } else if (scroll < -100) {
    rightslide();
    isDragged = false;
  }
});

slider.addEventListener('mouseup', function (e) {
  isDragged = false;
});
// ^================================
function changeActiveBtn(slide = 0) {
  let allBtn = theDots.children;
  for (let i = 0; i < allBtn.length; i++) {
    allBtn[i].classList.remove('dots__dot--active');
  }
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
}
// ^================================
createDot(allSlid.length);
goToSlid();
changeActiveBtn();
// ^================================

btnRight.addEventListener('click', rightslide);
btnLeft.addEventListener('click', leftslide);
// ^================================
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    rightslide();
  } else if (e.key === 'ArrowLeft') {
    leftslide();
  }
});
// ^================================

theDots.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  goToSlid(e.target.dataset.slide);
  changeActiveBtn(e.target.dataset.slide);
});
