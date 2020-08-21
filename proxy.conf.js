// const API_HOST = 'http://shop.fotaboss.com:5000';
// const API_HOST = "http://localhost:5000";
const API_HOST = 'http://localhost:3000';
const PROXY_CONFIG = {
  "/api/": {
    target: API_HOST,
    changeOrigin: true
  },
  "/AbpUserConfiguration/": {
    target: API_HOST,
    changeOrigin: true
  },
  "/signalr": {
    target: API_HOST,
    changeOrigin: true,
    ws: true
  }
};

module.exports = PROXY_CONFIG;
