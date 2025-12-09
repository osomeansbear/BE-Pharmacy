const AddressRepository = require("../repositories/address.repository.js");

const addressService = {
  async createAddress(data) {
    // check if user already has an address
    const existingAddresses = await AddressRepository.findByUserId(
      data.user_id
    );
    if (existingAddresses.length > 0) {
      const newAddress = await AddressRepository.create({
        ...data,
        is_default: false,
        full_name: data.full_name,
      });
      return {
        ...newAddress,
        id: Number(newAddress.id),
        user_id: Number(newAddress.user_id),
      };
    } else {
      // user has no existing addresses
      const newAddress = await AddressRepository.create({
        ...data,
        is_default: true,
      });
      return {
        ...newAddress,
        id: Number(newAddress.id),
        user_id: Number(newAddress.user_id),
      };
    }
    // yes: create new address, set default to false
    // no: create new address, set default to true
  },
};

module.exports = addressService;
