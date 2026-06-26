const sharp = require('sharp');
sharp('public/logo-full.png')
  .extract({ left: 571, top: 0, width: 453, height: 571 })
  .toFile('public/logo-text.png')
  .then(() => console.log('Crop text successful!'))
  .catch(err => console.error(err));
