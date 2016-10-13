exports.shuffle = (array) => {
  let m = array.length;
  let t;
  let i;
  while (m > 0) {
    i = Math.floor(Math.random() * (m -= 1));
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
};

exports.toDays = (days, weeks, months, years) => {
  let time = 0;

  if (years) {
    time += years * 365;
  }
  if (months) {
    time += months * 30;
  }
  if (weeks) {
    time += weeks * 10;
  }
  if (days) {
    time += days;
  }

  return time;
};

exports.randomNumberBetween = (l, r) => {
  if (l > r) {
    return r;
  }

  r = Math.floor(r);
  l = Math.floor(l);
  const random = Math.floor((Math.random() * (r - l)) + l);
  // console.log("A random number between " + l + " and " + r +" is " + random+".");
  return random;
};

exports.cloneObject = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const temp = obj.constructor(); // give temp the original obj's constructor
  for (const key in obj) {
    temp[key] = exports.cloneObject(obj[key]);
  }

  return temp;
};

exports.generateName = (length) => {
  let name = '';
  for (let i = 0; i < length; i += 1) {
    if (i % 2 === 0) {
      // We want a consonant
      let index = 0;

      // If you found a vowel keep looking
      while (index === 0 || index === 4 || index === 8 || index === 14 || index === 20) {
        index = Math.floor(Math.random() * 26);
      }

      // We found our consonant
      const nextLetter = String.fromCharCode(97 + index);

      // Add the character
      name += nextLetter;

      // If its a q add the u
      if (nextLetter === 'q') {
        name += 'u';
      }
    } else {
      // We are looking for a vowel
      let index = 1;

      // If you found a vowel keep looking
      while (index !== 0 && index !== 4 && index !== 8 && index !== 14 && index !== 20) {
        index = Math.floor(Math.random() * 26);
      }

      const nextLetter = String.fromCharCode(97 + index);

      // Add the character
      name += nextLetter;
    }
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
};
