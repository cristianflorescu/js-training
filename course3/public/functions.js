// DOM handling functions
let getInputValue = function(button, selector = '.input') {
  let inputGroup = button.closest('.input-group');
  return inputGroup.querySelector(selector).value;
};
let setOutputValue = function(button, out, selector = '.output') {
  let inputGroup = button.closest('.input-group');
  inputGroup.querySelector(selector).value = out;
};

// algorithm functions
let leapYear = function() {
  // read the input value
  let input = parseInt(getInputValue(this), 10);
  // calculate the output
  let output = 'No';
  if (0 === input % 400 || (0 === input % 4 && 0 !== input % 100)) {
    output = 'Yes'
  }
  // set the output value
  setOutputValue(this, output);
};

let fibonacci = function() {
  // read the input value
  let input = getInputValue(this);
  // calculate the output
  let fibonacciRecursive = function(n, memo = {}) {
    // "caching" - if we have computed this value already, return it
    if (memo[n]) {
      return memo[n];
    }
    // stop condition
    if (n === 0 || n === 1) {
      return n;
    }
    // calculate
    memo[n] = fibonacciRecursive(n - 1, memo) + fibonacciRecursive(n - 2, memo);
    return memo[n];
  };
  let memo = {},
    fibNr = fibonacciRecursive(parseInt(input, 10), memo);
  let output = Object.values(memo).join(', ');
  // set the output value
  setOutputValue(this, output);
};

String.prototype.reverse = function() {
  return this.split('').reverse().join('')
};

let reverse = function() {
  // read the input value
  let input = getInputValue(this);
  // calculate the output
  let output = input.reverse();
  // set the output value
  setOutputValue(this, output);
};


let Palindrome = function() {
  this.removeSpaces = function(input) {
    return input.replace(/\s/, '');
  }
};

Palindrome.prototype.check = function(input) {
  // prepare the input value
  input = this.removeSpaces(input);
  // calculate the output
  return input.reverse === input;
}

// Register click handlers

// NOTE: showAlert(); or showAlert(param); will NOT work here.
// Must be a reference to a function name, not a function call.
document.getElementById('leapYearBtn').onclick = leapYear;
document.getElementById('fibonacciBtn').onclick = fibonacci;
document.getElementById('reverseBtn').onclick = reverse;
let palindrome = new Palindrome();
document.getElementById('palindromeBtn').onclick = function() {
  let isPalindrome = palindrome.check(getInputValue(this));
  setOutputValue(this, isPalindrome ? 'Yes' : 'No');
};
