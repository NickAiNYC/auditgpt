const sharp = require('sharp');
sharp('public/logo-full.png')
  .extract({ left: 0, top: 0, width: 571, height: 571 })
  .toFile('public/logo-shield.png')
  .then(() => console.log('Crop successful!'))
  .catch(err => console.error(err));
