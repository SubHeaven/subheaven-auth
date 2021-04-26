const { createRxDatabase, RxDatabase, addRxPlugin } = require('rxdb');
addRxPlugin(require('pouchdb-adapter-leveldb'));
const leveldown = require('leveldown');

exports.init = async() => {
    console.log(this);
    this.database = await createRxDatabase({
        name: 'subheaven',
        adapter: leveldown,
        password: 'S3cr3t_P4ssw0rd_W1th_Numb3rs',
        multiInstance: true,
    });

    const user_schema = {
        title: 'user',
        version: 0,
        description: 'Database for users',
        type: 'object',
        properties: {
            user: {
                type: 'string',
                primary: true
            },
            pass: {
                type: 'string'
            },
            role: {
                type: 'string'
            }
        },
        required: ['user', 'pass'],
        encrypted: ['pass']
    }

    await this.database.addCollections({
        users: {
            schema: user_schema
        }
    });
};

exports.teste = async() => {
    if (!this.database) await this.init();
    // const user = await this.database.users.insert({
    //     user: 'SubHeaven',
    //     pass: 'MinhaSenha',
    //     role: 'dev'
    // });
    const users = await this.database.users.findOne().exec().then(data => {
        console.dir(data);
    });
};