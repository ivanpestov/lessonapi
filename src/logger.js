const {WINSTON_LEVEL} = process.env;
const winston = require('winston');
const {combine, timestamp, json} = winston.format;

const myFormat = winston.format.printf(({level, message, module, timestamp}) => {
    return `${timestamp} ${level} [${module}]: ${message}`;
});

const logger = winston.createLogger({
    level: WINSTON_LEVEL,
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        myFormat
    ),
    defaultMeta: {module: 'main'},
    transports: [
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'}),
    ],
});

module.exports = logger;
