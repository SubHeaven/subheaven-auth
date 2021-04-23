const jwt = require('jsonwebtoken');
const log = require('debug')('subheaven-auth:controller.auth');

exports.go_to_login = async(status, req, res) => {
    if (req.headers.origin) res.status(status).redirect(`${req.headers.origin.split(':')[0]}:33327/account/login`);
    else {
        res.status(status).redirect(`http://${req.headers.host.split(':')[0]}:33327/account/login`);
    }
}

exports.signin = async(req, res, next) => {
    let token = req.headers.authorization;
    let you_shall_not_pass = () => {
        return res.status(401).json({ result: false, message: 'You should not pass' });
    }

    if (!token) return you_shall_not_pass();

    try {
        token = token.split(' ')[1];

        if (token === 'null' || !token) return you_shall_not_pass();

        let buff = Buffer.from(token, 'base64');
        token = buff.toString('utf8');
        token = token.split(":");
        if (token[0] == 'SubHeaven' && token[1] == '123456') {
            let actoken = {
                name: 'SubHeaven',
                id: 1,
                agent: req.headers['user-agent']
            }
            actoken = jwt.sign(actoken, process.env.SECRET, { expiresIn: '1h' });
            res.cookie('sbh_tkn', actoken, { httpOnly: true });
            if (req.cookies.sbh_next) {
                res.status(200).json({ result: true, next: req.cookies.sbh_next });
            } else {
                res.status(200).json({ result: true, next: '/' });
            }
        } else {
            res.status(403).json({ result: false, message: 'You should not pass' });
        }
    } catch (error) {
        res.status(400).send("Invalid Token");
    }
};

exports.logout = async(req, res) => {
    res.clearCookie("sbh_tkn");
    this.go_to_login(200, req, res);
};

exports.validate = async(req, res, next) => {
    let token = req.cookies.sbh_tkn;
    res.cookie('sbh_next', req.originalUrl);

    if (!token) return this.go_to_login(200, req, res);

    try {
        let data = jwt.verify(token, process.env.SECRET);
        if (!data || req.headers['user-agent'] !== data.agent) return this.go_to_login(200, req, res);

        req.user = {
            name: data.name,
            id: data.id,
        };
    } catch (e) {
        return this.go_to_login(200, req, res);
    }
    next();
};