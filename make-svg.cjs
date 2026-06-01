const fs = require('fs');

const base64 = fs.readFileSync('public/logo.png').toString('base64');
const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="100" fill="#030509" />
  <image href="data:image/png;base64,${base64}" x="100" y="100" width="312" height="312" />
</svg>`;

fs.writeFileSync('public/logo-card.svg', svg);
console.log('SVG written');
