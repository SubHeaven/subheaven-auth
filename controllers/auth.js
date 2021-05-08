const crypto = require('crypto');
const auth = require('../tools/subheaven-auth');
const db = require('../tools/subheaven-sqlite');
const jwt = require('jsonwebtoken');
const log = require('debug')('subheaven:controllers.auth');

exports.go_to_login = async(status, req, res) => {
    if (req.headers.origin) res.status(status).redirect(`${req.headers.origin.split(':')[0]}:33327/account/login`);
    else {
        res.status(status).redirect(`http://${req.headers.host.split(':')[0]}:33327/account/login`);
    }
}

exports.signin = async(req, res, next) => {
    let token = req.headers.authorization;
    console.log("token:");
    console.log(token);
    let user = await auth.signin(token);
    if (user) {
        let actoken = {
            name: user.user,
            id: user.id,
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
        res.status(401).json({ result: false, message: 'You should not pass' });
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

exports.generateRandomSalt = async(size = 32) => {
    var salt = '';
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$_-=';

    for (i = 1; i <= size; i++) {
        var char = Math.floor(Math.random() * str.length + 1);
        salt += str.charAt(char)
    }

    return salt;
}

exports.cryptPass = async(pass) => {
    return new Promise((resolve, reject) => {
        crypto.scrypt(pass, process.env.KEY, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey.toString('hex'))
        });
    });
}

exports.checkPass = async(pass, hash) => {
    return new Promise((resolve, reject) => {
        crypto.scrypt(pass, process.env.KEY, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(hash == derivedKey.toString('hex'))
        });
    });
}

exports.signin2 = async(token) => {
    log(`Validando login: Token: ${token}`);
    token = token.split(' ')[1];
    if (token === 'null' || !token) {
        log(`Token inválido. token = ${token}`);
        return false;
    }

    let buff = Buffer.from(token, 'base64');
    token = buff.toString('utf8');
    token = token.split(":");
    let user = await db.findOne('user', {
        user: token[0]
    });
    if (user) {
        let hash = await this.cryptPass(token[1]);
        log(`Token válido!`)
        return user.pass === hash;
    } else {
        log(`Usuário "${token[0]} não encontrado na base de dados!"`)
        return false;
    }
}

exports.teste = async() => {
    let validado = await this.signin2('Basic U3ViSGVhdmVuOk1pbmhhU2VuaGE=');
    console.log(validado);
    // let user = 'SubHeaven';
    // let pass = 'MinhaSenha';
    // pass = await this.cryptPass(pass);
    // console.log(`user = ${user}`);
    // console.log(`pass = ${pass}`);
    // await db.insert('user', {
    //     user: user,
    //     pass: pass
    // });
}