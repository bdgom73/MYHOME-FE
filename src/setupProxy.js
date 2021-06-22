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
  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'http://127.0.0.1:1337',
      changeOrigin: true,
  }));  
};
