const logger = require('./src/logger');
const {HOSTNAME, PORT} = process.env;
const app = require('./src/app');

app.listen(PORT, () => {
    logger.info(`Server listen on port: ${PORT}`);
});
