const fs = require('fs');
const log = require('debug')('subheaven:sqlite');
const { Sequelize, DataTypes, Op } = require('sequelize');
const json5 = require('json5');
const tools = require('./subheaven-tools');

exports.update_database = async() => {
    await this.sequelize.sync({ alter: true });
}

exports.loadSchemas = async() => {
    let type_map = {
        string: DataTypes.STRING,
        integer: DataTypes.INTEGER,
        time: DataTypes.TIME,
        date: DataTypes.DATEONLY,
        datetime: DataTypes.DATE,
        float: DataTypes.FLOAT
    }
    let filenames = fs.readdirSync('./schemas', { withFileTypes: true });
    await filenames.forEachAsync(async(filename, index) => {
        if (filename.isFile() && filename.name.split('.').pop().toLowerCase() === 'json') {
            let schema = json5.parse(fs.readFileSync(`./schemas/${filename.name}`, 'utf8'));
            await Object.keys(schema).forEachAsync(key => {
                if (typeof schema[key] === 'object') {
                    schema[key]['type'] = type_map[schema[key]['type']]
                } else {
                    schema[key] = type_map[schema[key]]
                }
            });
            let table_name = filename.name.split('.');
            table_name.pop();
            table_name = table_name.join('.');
            this.sequelize.define(table_name, schema);
        }
    });
};

exports.init = async() => {
    try {
        if (!this.sequelize) {
            this.sequelize = new Sequelize({
                dialect: 'sqlite',
                storage: './data/database.sqlite',
                logging: false
            });

            try {
                await this.sequelize.authenticate();
            } catch (e) {
                throw e
            }

            await this.loadSchemas();
            // this.update_database();
        }
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

exports.insert = async(name, data) => {
    if (await this.init()) {
        console.log(this.sequelize.models[name]);
        return await this.sequelize.models[name].create(data);
    }
}

exports.query_map = {
    '$eq': Op.eq,
    '$neq': Op.eq,
    '$gt': Op.eq,
    '$gte': Op.eq,
    '$lt': Op.eq,
    '$lte': Op.eq,
}

exports.convertToSequelizeQuery = async query => {
    let new_query = {};
    await Object.keys(query).forEachAsync(async key => {
        let new_value = typeof query[key] === 'object' ? await this.convertToSequelizeQuery(query[key]) : query[key];
        let new_key = this.query_map[key] ? this.query_map[key] : key;
        new_query = {...new_query, [new_key]: new_value };
        // new_query = {...new_query, [this.query_map[key] ? this.query_map[key] : key]: value };
    });
    return new_query;
};

exports.find = async(name, query) => {
    log("Fazendo uma consulta. Filtro:")
    log(`    ${json5.stringify(query)}`);
    if (await this.init()) {
        if (typeof query === 'undefined' || query == {}) {
            let dataset = await this.sequelize.models[name].findAll();
            let result = [];
            await dataset.forEachAsync(async item => {
                result.push(item.dataValues);
            });
            log(`Consulta realizada com sucesso! ${result.length} dados retornados.`);
            return result;
        } else {
            let q = await this.convertToSequelizeQuery(query);
            let dataset = await this.sequelize.models[name].findAll({ where: q });
            let result = [];
            await dataset.forEachAsync(async item => {
                result.push(item.dataValues);
            });
            log(`Consulta realizada com sucesso! ${result.length} dados retornados.`);
            return result;
        }
    }
}

exports.findOne = async(name, query) => {
    log("Fazendo uma consulta. Filtro:")
    log(`    ${json5.stringify(query)}`);
    if (await this.init()) {
        if (typeof query === 'undefined' || query == {}) {
            let dataset = await this.sequelize.models[name].findAll();
            let result = [];
            await dataset.forEachAsync(async item => {
                result.push(item.dataValues);
            });
            if (result.length > 0) {
                log(`Consulta realizada com sucesso! Informação encontrada.`);
                return result[0];
            } else {
                log(`Consulta realizada com sucesso! Nenhuma informação encontrada.`);
                return null;
            }
        } else {
            let q = await this.convertToSequelizeQuery(query);
            let dataset = await this.sequelize.models[name].findAll({ where: q });
            let result = [];
            await dataset.forEachAsync(async item => {
                result.push(item.dataValues);
            });
            if (result.length > 0) {
                log(`Consulta realizada com sucesso! Informação encontrada.`);
                return result[0];
            } else {
                log(`Consulta realizada com sucesso! Nenhuma informação encontrada.`);
                return null;
            }
        }
    }
}

exports.teste = async() => {
    let dataset = await this.find('user', {
        user: {
            '$eq': 'Apagar'
        }
    });
    console.log(dataset);
};