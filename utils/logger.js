const {createLogger , format,transports} = require("winston");

const loggerOptions = {
    level:"info",
    format:format.json(),
    transports:[
        new transports.File({
            dirname:__dirname,
            filename :'user.js',
        })
    ]
}
const logger = createLogger(loggerOptions);

module.exports = logger;
