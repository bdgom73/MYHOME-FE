const {createProxyMiddleware} =  require('http-proxy-middleware');


module.exports = (app) => {
  app.use(
    '/v1', 
    createProxyMiddleware({
        target: 'https://openapi.naver.com',
        changeOrigin: true,
    }));
  app.use(
    '/openapi', 
    createProxyMiddleware({
        target: 'http://whois.kisa.or.kr',
        changeOrigin: true,
    }));
};
