import dotenv from 'dotenv';

dotenv.config();

const config = {
    mongo: {
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            socketTimeoutMS: 30000,
            keepAlive: true,
            autoIndex: false,
            retryWrites: false
        },
        url: process.env.MONGO_URL ?? ''
    },
    server: {
        host: 'localhost', // Local ip from `ipconfig getifaddr en0`: 192.168.0.103
        port: process.env.PORT ? +process.env.PORT : 8001
    },
    security: {
        charCodeShiftNumber: process.env.CHAR_CODE_SHIFT_NUMBER ?? 1
    }
};

export default config;
