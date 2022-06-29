const { User, Coin, Wallet, Notification, Cronbuy, Transaction, Tag } = require('../db/models');

exports.getAll = async function(req, res) {
    const tag = await Tag.findAll();
    return res.send(tag);
};

exports.findTagById = async function(req, res) {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId);
    if (tag != null) {
        return res.status(201).send(tag);
    } else {
        return res.status(501)
    }
};

exports.addNewTag = async function(req, res) {
    const { name, coinId } = req.body;
    try {
        let newTag = await Tag.build({
            name: name,
            coinId: coinId,
        });
        newTag.save();
        res.status(201).send('Tag Registrada');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
};

exports.updateTag = async function(req, res) {
    const { name, coinId } = req.body;
    const tagId = req.params.id;
    try {
        await Tag.update({
            name: name,
            coinId: coinId,
        }, {
            where: { id: tagId }
        });
        res.status(201).send('Tag Actualizada');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion')
    }
};

exports.deleteTag = async function(req, res) {
    const tagId = req.params.id;
    try {
        await Tag.destroy({
            where: { id: tagId }
        });
        res.status(201).send('Tag eliminada');
    } catch (err) {
        res.status(500).send('No se pudo realizar la operacion');
    }
};

exports.tagsFromCoin = async function(req, res) {
    const _coinId = req.params.id;
    const coin = await Coin.findByPk(_coinId);
    const coinName = coin.name;

    const tagsFromCoin = await Tag.findAll({
        attributes: ["name"],
        raw: true,
        where: { coinId: _coinId }
    });

    const cantTagsForCoin = tagsFromCoin.length
        //const tagsNames = JSON.stringify(tagsFromCoin);

    let i = 0;
    let returnTagsAndCoins = ""

    returnTagsAndCoins = coinName;

    while (i < cantTagsForCoin) {

        const nameTagi = tagsFromCoin[i].name;
        returnTagsAndCoins = returnTagsAndCoins + ",  " + nameTagi;
        i = i + 1;
    }

    //console.log(returnTagsAndCoins);
    return res.status(201).send(returnTagsAndCoins);
};

exports.getCoinTags = async function(req, res) {
    const _coinId = req.params.id;
    const coin = await Coin.findByPk(_coinId);
    const coinName = coin.name;

    const tagsFromCoin = await Tag.findAll({
        attributes: ["name"],
        raw: true,
        where: { coinId: _coinId }
    });

    const cantTagsForCoin = tagsFromCoin.length
        //const tagsNames = JSON.stringify(tagsFromCoin);

    let i = 0;
    let returnTagsAndCoins = ""

    returnTagsAndCoins = coinName;

    while (i < cantTagsForCoin) {

        const nameTagi = tagsFromCoin[i].name;
        returnTagsAndCoins = returnTagsAndCoins + ",  " + nameTagi;
        i = i + 1;
    }

    //console.log(returnTagsAndCoins);
    return res.status(201).send(returnTagsAndCoins);
}