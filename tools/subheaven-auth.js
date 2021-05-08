const crypto = require('crypto');
const db = require('./subheaven-sqlite');
const jwt = require('jsonwebtoken');
const log = require('debug')('subheaven:auth');

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

exports.signin = async(token) => {
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
    let hash = await this.cryptPass(token[1]);
    if (user && user.pass === hash) {
        log(`Token válido!`);
        return {
            id: user.id,
            user: user.user
        };
    } else {
        log(`Usuário "${token[0]} não encontrado na base de dados!"`)
        return false;
    }
}

exports.teste = async() => {
    let validado = await this.signin('Basic U3ViSGVhdmVuOk1pbmhhU2VuaGE=');
    console.log(validado);
}