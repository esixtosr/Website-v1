const fs = require('fs');
const path = require('path');

const cacheDir = path.join(__dirname, '..', '.cache');
const dev404Destination = path.join(cacheDir, 'dev-404-page.js');
const dev404PageSource = `import React from 'react';

const Dev404Page = ({ location }) => (
  <main style={{ padding: '3rem', fontFamily: 'system-ui, sans-serif' }}>
    <h1>Page not found</h1>
    <p>
      Gatsby could not find a development page for <code>{location?.pathname}</code>.
    </p>
  </main>
);

export default Dev404Page;
`;

fs.mkdirSync(cacheDir, { recursive: true });
fs.writeFileSync(dev404Destination, dev404PageSource);
