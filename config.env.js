// Environment Configuration for Marrow Grow
// Switch ENVIRONMENT to 'production' when deploying to live

const ENVIRONMENT = 'production'; // 'development' or 'production'

const ENV_CONFIG = {
  development: {
    TITLE_ID: '15C4CB',
    NAME: 'DEV',
    DEBUG: true
  },
  production: {
    TITLE_ID: 'B6749',
    NAME: 'LIVE',
    DEBUG: false
  }
};

// Get current environment config
const CURRENT_ENV = ENV_CONFIG[ENVIRONMENT];

// Console warning for dev mode
if (ENVIRONMENT === 'development') {
  console.log('%c🔧 DEVELOPMENT MODE - Using Test PlayFab Backend', 'color: orange; font-weight: bold; font-size: 14px;');
  console.log('%cTitle ID: ' + CURRENT_ENV.TITLE_ID, 'color: orange;');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ENVIRONMENT, CURRENT_ENV, ENV_CONFIG };
}
