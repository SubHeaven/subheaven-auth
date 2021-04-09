const log = require('debug')('subheaven-auth:controller.auth');

exports.validate = async(req, res, next) => {
    let { user, pass } = req.body;
    log(`Login requested:`);
    log(`    ${user}`);
    if (user == 'SubHeaven' && pass == 'MinhaSenha') {
        res.status(200).send('Ok dude');
    } else {
        res.status(403).send('You should not pass');
    }
}