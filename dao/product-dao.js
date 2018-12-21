const mysql = require('../common/mysql');
const TABLE = 'product';
const dao = {
    // uuid, code, name, hero, rarity, slot, type,image_url, market_url,
    // buy_price, sell_price, sell_number, steam_price_usd, steam_price_cny,
    // update_time
    Insert: (item) => {
        let {buy_price, sell_price, sell_num, steam_price_usd, steam_price_cny, uuid} = item;
        let sps1 = [buy_price, sell_price, sell_num, steam_price_usd, steam_price_cny, uuid];
        let sql1 = `UPDATE ${TABLE} SET buy_price=?, sell_price=?, sell_num=?, steam_price_usd=?, steam_price_cny=?, update_time=now() WHERE uuid=?`;
        return mysql.execute(sql1, sps1).then(data1 => {
            if (data1) {
                return 'update';
            } else {
                let {code, name, hero, rarity, slot, type, image_url, market_url} = item;
                let sps2 = [...sps1, code, name, hero, rarity, slot, type, image_url, market_url];
                let sql2 = `INSERT INTO ${TABLE} SET update_time=now(), ` +
                    `buy_price=?, sell_price=?, sell_num=?, steam_price_usd=?, steam_price_cny=?, uuid=?, ` +
                    `code=?, name=?, hero=?, rarity=?, slot=?, type=?, image_url=?, market_url=?`;
                return mysql.execute(sql2, sps2).then(data2 => data2 ? 'insert' : 'errors');
            }
        });
    }
};

module.exports = dao;