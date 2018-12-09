var mysql = require('mysql');

var config = require('../config/mysql-config');

config = config || {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'mysql',
    multipleStatements: true,
    connectionLimit: 10,
};
var pool;

var Mysql = {
    getPool: () => {
        return new Promise((resolve, reject) => {
            if (pool) {
                resolve(pool);
            }
            else {
                pool = mysql.createPool(config);
                console.log(new Date(), '已创建连接池');
                pool.on('connection', function (connection) {
                    console.log('Connection %d connected, %d', connection.threadId, pool._allConnections.length);
                });
                pool.on('release', function (connection) {
                    console.log('Connection %d released, %d', connection.threadId, pool._allConnections.length);

                });
                if (resolve) {
                    resolve(pool);
                }
                else {
                    reject('没有连接');
                }
            }
        });


    },
    fetch: (sql, ps) => {
        return new Promise((resolve, reject) => {
            Mysql.getPool(config)
                .then(pool => {
                    pool.query(sql, ps, (e, v, f) => {
                        if (!e) {
                            resolve(v);
                        }
                        else {
                            reject(v);
                        }
                    });
                })
                .catch(err => {
                    reject(err);
                });
        });

    },
    execute: (sql, ps) => {
        return new Promise((resolve, reject) => {
            Mysql.getPool(config)
                .then(pool => {
                    pool.query(sql, ps, (e, v, f) => {
                        if (!e) {
                            resolve(v.insertId || v.changedRows || v.affectedRows || 0);
                        }
                        else {
                            reject(`MYSQL_${e.code}`);
                        }
                    });
                })
                .catch(err => {
                    reject(err);
                });
        });

    }
};

module.exports = Mysql;
