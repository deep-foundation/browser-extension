const dotenvLoad = require('dotenv-load');
const nextEnv = require('next-env');
 
dotenvLoad();
 
const withNextEnv = nextEnv();
 
module.exports = withNextEnv({
  distDir: 'app',
  
  webpack: (config) => {
    config.resolve.fallback = {
      "buffer": false,
      "events": false,
      "os": false,
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
    };

    return config;
  },
});