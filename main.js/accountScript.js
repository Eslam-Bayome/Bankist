'use strict';

const account1 = {
  owner: 'Karem Mohamed',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Sayed Rgab',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

let accounts = [account1, account2];

if (JSON.parse(localStorage.getItem('bankAccounts'))) {
  accounts = JSON.parse(localStorage.getItem('bankAccounts'));
}
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const createAcc = document.getElementById('createAcc');
const fName = document.getElementById('fName');
const lName = document.getElementById('lName');
const pin = document.getElementById('pin');
const email = document.getElementById('email');
const accountForm = document.querySelector('.open');
const overlay = document.querySelector('.overlay');
const cloeForm = document.querySelector('.btn--close-modal');
const loginForm = document.querySelector('#logIn');
const fNameAlert = document.getElementById('fNameAlert');
const lNameAlert = document.getElementById('lNameAlert');
const emailAlert = document.getElementById('emailAlert');
const passAlert = document.getElementById('passAlert');
const loginAlert = document.getElementById('loginAlert');

const goToMain = document.querySelector('#goToMain');
let currentAcc, ourTimer;
// =================================================================

function clearInput() {
  fName.value = lName.value = pin.value = email.value = '';
}
//! /////////////////////////////////////////////////////////////

function closeForm() {
  accountForm.classList.add('d-none');
  overlay.classList.add('d-none');
}
//! /////////////////////////////////////////////////////////////

function myRegex(input, reg) {
  let myurl = input.value;
  return reg.test(myurl);
}
//! /////////////////////////////////////////////////////////////

function formatCur(value, locale, curr) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: curr,
  }).format(value);
}
//! /////////////////////////////////////////////////////////////

function setCountDown() {
  let mtime = 300 * 1000;

  function tick() {
    let ourDate = new Intl.DateTimeFormat('en-US', {
      minute: 'numeric',
      second: '2-digit',
    }).format(mtime);
    labelTimer.textContent = ourDate;
    if (mtime === 0) {
      clearInterval(ourTimer);
      containerApp.style.opacity = 0;
      containerApp.classList.add('d-none');
      labelWelcome.textContent = 'Log in to get started';
    }
    mtime -= 1000;
  }
  tick();
  ourTimer = setInterval(tick, 1000);
  return ourTimer;
}
//! /////////////////////////////////////////////////////////////

function validateForm() {
  if (
    myRegex(fName, /^[a-zA-Z]+$/) &&
    myRegex(lName, /^[a-zA-Z]+$/) &&
    myRegex(email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) &&
    myRegex(pin, /^\d{4}$/) &&
    !accounts.some(account => account.email === email.value)
  ) {
    loginForm.removeAttribute('disabled');
  } else {
    loginForm.setAttribute('disabled', true);
  }
}
//! /////////////////////////////////////////////////////////////
//~ create a id for your account
function idpw(userArr) {
  userArr.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(v => v[0])
      .join('');
  });
}
//! /////////////////////////////////////////////////////////////
//~ clear your login Input
function clearLoginInput() {
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();
}

//! /////////////////////////////////////////////////////////////
// ~  display everymovement you do

function addMove(acco, sort = false) {
  containerMovements.innerHTML = '';
  let movSort = sort
    ? acco.movements.slice().sort((a, b) => a - b)
    : acco.movements;
  movSort.forEach(function (v, i) {
    let ourCurrency = formatCur(v, acco.locale, acco.currency);
    let dateo = new Date(acco.movementsDates[i]);
    let ourDate = formatMovement(dateo, acco.locale);
    let type = v > 0 ? 'deposit' : 'withdrawal';
    let html = `   
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
      ${i + 1}  ${type}</div>
       <div class="movements__date">${ourDate}</div> 

      <div class="movements__value">${ourCurrency}</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

//! /////////////////////////////////////////////////////////////
// ~ calculate all your income and outcome to display them
function inoutCome(move, acco) {
  acco.balance = move.reduce((acc, v) => acc + v);

  labelBalance.textContent = formatCur(
    acco.balance,
    acco.locale,
    acco.currency
  );
  //==========================================
  let income = move.filter(v => v > 0).reduce((acc, v) => acc + v);
  labelSumIn.textContent = formatCur(income, acco.locale, acco.currency);
  let outcome = move ? move.filter(v => v < 0).reduce((acc, v) => acc + v) : 0;
  labelSumOut.textContent = formatCur(
    Math.abs(outcome),
    acco.locale,
    acco.currency
  );

  let interest = move
    .filter(v => v > 0)
    .map(v => v * (acco.interestRate / 100))
    .filter(v => v >= 1)
    .reduce((acc, v) => acc + v);
  labelSumInterest.textContent = formatCur(
    interest,
    acco.locale,
    acco.currency
  );
}

//! /////////////////////////////////////////////////////////////
// ~  format the movement date to display it
function formatMovement(date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.trunc(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'today';
  let theDate = new Intl.DateTimeFormat(locale).format(date);
  return theDate;
}
//! /////////////////////////////////////////////////////////////

createAcc.addEventListener('click', function (e) {
  e.preventDefault();
  accountForm.classList.remove('d-none');
  overlay.classList.remove('d-none');
});

cloeForm.addEventListener('click', function () {
  clearInput();
  closeForm();
});

goToMain.addEventListener('click', function () {
  window.location = '../index.html';
});
//! /////////////////////////////////////////////////////////////
//~ Validation for our in inputs
fName.addEventListener('input', function () {
  if (!myRegex(fName, /^[a-zA-Z]+$/)) {
    fNameAlert.classList.remove('d-none');
  } else {
    fNameAlert.classList.add('d-none');
  }
  validateForm();
});

lName.addEventListener('input', function () {
  if (!myRegex(lName, /^[a-zA-Z]+$/)) {
    lNameAlert.classList.remove('d-none');
  } else {
    lNameAlert.classList.add('d-none');
  }
  validateForm();
});

email.addEventListener('input', function () {
  if (!myRegex(email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
    emailAlert.textContent = ` Email not valid *exemple@yyy.zzz`;
    emailAlert.classList.remove('d-none');
  } else if (accounts.some(account => account.email === email.value)) {
    emailAlert.textContent = 'This Email Is Already Exist';
    emailAlert.classList.remove('d-none');
  } else {
    emailAlert.classList.add('d-none');
  }
  validateForm();
});

pin.addEventListener('input', function () {
  if (!myRegex(pin, /^\d{4}$/)) {
    passAlert.classList.remove('d-none');
  } else {
    passAlert.classList.add('d-none');
  }
  validateForm();
});

//! /////////////////////////////////////////////////////////////
idpw(accounts);
//~ btn to register your account in the system
loginForm.addEventListener('click', function (e) {
  e.preventDefault();
  let newAccount = {
    owner: `${fName.value} ${lName.value}`,
    pin: pin.value,
    email: email.value,
    interestRate: 1.2,
    movements: [1000, -400],
    movementsDates: [new Date().toISOString(), new Date().toISOString()],
    currency: 'USD',
    locale: 'en-US',
  };
  clearInput();
  closeForm();
  accounts.push(newAccount);
  localStorage.setItem('bankAccounts', JSON.stringify(accounts));
  idpw(accounts);
});

//! /////////////////////////////////////////////////////////////
//~ btn to log in in system

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    !accounts.some(
      v =>
        inputLoginUsername.value === v.username &&
        +inputLoginPin.value === +v.pin
    )
  ) {
    loginAlert.classList.remove('d-none');
  } else {
    currentAcc = accounts.find(
      v =>
        inputLoginUsername.value === v.username &&
        +inputLoginPin.value === +v.pin
    );
    loginAlert.classList.add('d-none');
    labelWelcome.textContent = `Welcome back, ${
      currentAcc.owner.split(' ')[0]
    }`;

    if (ourTimer) clearInterval(ourTimer);

    ourTimer = setCountDown();

    addMove(currentAcc);
    inoutCome(currentAcc.movements, currentAcc);

    containerApp.style.opacity = 100;
    containerApp.classList.remove('d-none');

    clearLoginInput();

    const now = new Date();
    let option = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'short',
    };
    let locale = currentAcc.locale;
    labelDate.textContent = new Intl.DateTimeFormat(locale, option).format(now);
  }
});

// =================================================================

//! /////////////////////////////////////////////////////////////
//~ btn to transfer money to other account
btnTransfer.addEventListener('click', function (ev) {
  ev.preventDefault();
  let amount = +inputTransferAmount.value;
  let recieveAcc = accounts.find(v => v.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  if (
    currentAcc.balance >= amount &&
    amount > 0 &&
    recieveAcc &&
    currentAcc.username !== recieveAcc.username
  ) {
    localStorage.setItem('bankAccounts', JSON.stringify(accounts));
    recieveAcc.movements.push(amount);
    currentAcc.movements.push(-amount);
    currentAcc.movementsDates.push(new Date().toISOString());
    recieveAcc.movementsDates.push(new Date().toISOString());
    addMove(currentAcc);
    inoutCome(currentAcc.movements, currentAcc);
    clearInterval(ourTimer);
    setCountDown();
  }
});

//! /////////////////////////////////////////////////////////////
//~ btn to request a loan from the bank
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let amountTwo = Math.floor(inputLoanAmount.value);
  if (amountTwo > 0 && currentAcc.movements.some(v => v >= amountTwo * 0.1)) {
    currentAcc.movements.push(amountTwo);
    currentAcc.movementsDates.push(new Date().toISOString());
    localStorage.setItem('bankAccounts', JSON.stringify(accounts));
    setTimeout(addMove, 1000, currentAcc);
    setTimeout(inoutCome, 1000, currentAcc.movements, currentAcc);
    clearInterval(ourTimer);
    setCountDown();
  }

  inputLoanAmount.value = '';
});
//! /////////////////////////////////////////////////////////////
//~ btn to delete your account from the system
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    +inputClosePin.value === +currentAcc.pin &&
    inputCloseUsername.value === currentAcc.username
  ) {
    accounts.splice(
      accounts.findIndex(v => v.username === currentAcc.username),
      1
    );
    localStorage.setItem('bankAccounts', JSON.stringify(accounts));
    containerApp.style.opacity = 0;
    containerApp.classList.add('d-none');
    inputClosePin.value = inputCloseUsername.value = '';
    inputClosePin.blur();
  }
});

//! ///////////////////////////////////////////////

let theTru = false;
btnSort.addEventListener('click', function () {
  addMove(currentAcc, !theTru);
  theTru = !theTru;
});
//! ///////////////////////////////////////////////
