const React = require('react');

exports.onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents([
    React.createElement('script', {
      key: 'theme-init',
      dangerouslySetInnerHTML: {
        __html: `
          (function () {
            try {
              var savedTheme = localStorage.getItem('theme-mode') || 'system';
              var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

              var resolvedTheme =
                savedTheme === 'light'
                  ? 'light'
                  : savedTheme === 'dark'
                  ? 'dark'
                  : prefersLight
                  ? 'light'
                  : 'dark';

              document.documentElement.setAttribute('data-theme', resolvedTheme);
            } catch (e) {}
          })();
        `,
      },
    }),
  ]);
};
