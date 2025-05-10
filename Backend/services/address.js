const Address = require("../models/Adress");

const getAddress = async (id) => {
    const address = await Address.findById(id);
    if (address) return address.toJSON();
    return -1;
};

module.exports = { getAddress };
