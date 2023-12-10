require('./global');
const app = require('./src/app');

const { port } = require('./src/configs');

const server = app.listen(port, () => {
  console.log(`WSV eCommerce start with ${port}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log('Exit Server Express'));
});
