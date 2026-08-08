const fs = require('fs');
const path = require('path');

const cacheDir = path.join(__dirname, '..', '.cache');
const dev404Source = path.join(
  __dirname,
  '..',
  'node_modules/gatsby/dist/internal-plugins/dev-404-page/raw_dev-404-page.js',
);
const dev404Destination = path.join(cacheDir, 'dev-404-page.js');

fs.mkdirSync(cacheDir, { recursive: true });

if (fs.existsSync(dev404Source)) {
  fs.copyFileSync(dev404Source, dev404Destination);
}
