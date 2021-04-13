const jwt = require('jsonwebtoken');
const log = require('debug')('subheaven-auth:controller.auth');

exports.signin = async(req, res, next) => {
    let token = req.headers.authorization;
    let you_shall_not_pass = () => {
        return res.status(401).json({ result: false, message: 'You should not pass' });
    }
    console.log(`Login requested:`);
    console.log(`    ${token}`);

    if (!token) return you_shall_not_pass();

    try {
        token = token.split(' ')[1];

        if (token === 'null' || !token) return you_shall_not_pass();

        let buff = Buffer.from(token, 'base64');
        token = buff.toString('utf8');
        token = token.split(":");
        if (token[0] == 'SubHeaven' && token[1] == '123456') {
            console.log('Ok dude');
            console.log(req);
            let actoken = {
                name: 'SubHeaven',
                id: 1,
                agent: req.headers['user-agent']
            }
            actoken = jwt.sign(actoken, process.env.SECRET, { expiresIn: '1h' });
            res.cookie('sbh_tkn', actoken, { httpOnly: true });
            if (req.cookies.sbh_next) {
                res.status(401).redirect(req.cookies.sbh_next);
            } else res.status(200).json({ result: true, token: actoken });
        } else {
            console.log('You should not pass');
            res.status(403).json({ result: false, message: 'You should not pass' });
        }
    } catch (error) {
        res.status(400).send("Invalid Token");
    }
};

exports.validate = async(req, res, next) => {
    let token = req.cookies.sbh_tkn;
    console.log(`${req.headers.host.split(':')[0]}:33327/account/login`);
    res.cookie('sbh_next', req.originalUrl);

    let back_to_login = () => res.status(401).redirect(`http://${req.headers.host.split(':')[0]}:33327/account/login`);

    if (!token) return back_to_login();

    let data = jwt.verify(token, process.env.SECRET);
    if (!data || req.headers['user-agent'] !== data.agent) return back_to_login();

    req.user = {
        name: data.name,
        id: data.id,
    };
    next();
};