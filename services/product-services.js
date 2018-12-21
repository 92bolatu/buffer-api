const dao = require('../dao/product-dao');


/**
 * remapping buff item to product
 */
const mapping = (item) => {
    let {
        goods_info,
        'id': uuid,
        'market_hash_name': code,
        'name': name,
        'buy_max_price': buy_price,
        'sell_min_price': sell_price,
        'sell_num': sell_num,
        'steam_market_url': market_url,
    } = item;

    let {
        info,
        'icon_url': image_url,
        'steam_price': steam_price_usd,
        'steam_price_cny': steam_price_cny
    } = goods_info;

    let {
        tags: {
            hero, rarity, slot, type
        }
    } = info;

    [hero, rarity, slot, type] = [hero, rarity, slot, type].map(i => i.internal_name);

    return {
        uuid, code, name, hero, rarity, slot, type, image_url, market_url,
        buy_price, sell_price, sell_num, steam_price_usd, steam_price_cny
    };
};

const service = {
    Insert: (json) => {
        let {data: {items}} = json;
        let count = items.length;
        return Promise.all(items.map(item => dao.Insert(mapping(item)))).then(results => {
            return ['update', 'insert', 'errors'].reduce((a, x) => {
                a[x] = results.filter(f => f === x).length;
                return a;
            }, {count});
        });
    },
};


module.exports = service;