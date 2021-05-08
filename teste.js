require('dotenv-safe').config();
const auth = require('./tools/subheaven-auth');

(async() => {
    try {
        await auth.teste();
    } catch (e) {
        throw e;
    }
})();