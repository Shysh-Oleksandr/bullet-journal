import { createLogger } from 'redux-logger';

const isDebuggingInChrome = Boolean(window.navigator.userAgent);

const loggerMiddleware = createLogger({
    predicate: () => isDebuggingInChrome,
    collapsed: true,
    duration: true,
    titleFormatter: (action) => {
        const endpoint = action?.meta?.arg?.endpointName;

        if (endpoint) {
            const status = action.type.split('/').slice(-1);
            const [module] = action.type.split('/');

            return `${module}/${endpoint}/${status}`;
        }

        return action.type;
    }
});

export default loggerMiddleware;
