const AddressRepository = require("../repositories/address.repository.js");
const {
  AddressOutputSchema,
} = require("../validators/output/address.output.validator.js");

function assertAuthenticated(userId) {
  if (!userId) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    throw err;
  }
}

function mapAddress(address) {
  return AddressOutputSchema.parse({
    ...address,
    id: Number(address.id),
    userId: Number(address.userId),
  });
}

const addressService = {
  async createAddress(userId, data) {
    assertAuthenticated(userId);

    const existingAddresses = await AddressRepository.findByUserId(userId);

    const addressData = {
      userId: Number(userId),
      province: data.province,
      district: data.district,
      ward: data.ward,
      detail: data.detail,
    };

    if (existingAddresses.length > 0) {
      const newAddress = await AddressRepository.create({
        ...addressData,
        isDefault: false,
      });
      return mapAddress(newAddress);
    }

    const newAddress = await AddressRepository.create({
      ...addressData,
      isDefault: true,
    });
    return mapAddress(newAddress);
  },

  async getAddresses(userId) {
    assertAuthenticated(userId);

    const addresses = await AddressRepository.findByUserId(userId);
    return addresses.map((address) => mapAddress(address));
  },

  async updateAddress(userId, id, data) {
    assertAuthenticated(userId);

    const addresses = await AddressRepository.findByUserId(userId);
    const existingAddress = addresses.find(
      (address) => Number(address.id) === Number(id),
    );

    if (!existingAddress) {
      const err = new Error("Address not found");
      err.statusCode = 404;
      throw err;
    }

    // If setting this address as default, unset all others first
    if (data.isDefault === true) {
      await Promise.all(
        addresses
          .filter((a) => Number(a.id) !== Number(id) && a.isDefault)
          .map((a) => AddressRepository.update(Number(a.id), { isDefault: false })),
      );
    }

    const updatedAddress = await AddressRepository.update(Number(id), data);
    return mapAddress(updatedAddress);
  },

  async deleteAddress(userId, id) {
    assertAuthenticated(userId);

    const addresses = await AddressRepository.findByUserId(userId);
    const existingAddress = addresses.find(
      (address) => Number(address.id) === Number(id),
    );

    if (!existingAddress) {
      const err = new Error("Address not found");
      err.statusCode = 404;
      throw err;
    }

    await AddressRepository.delete(Number(id));
    return { id: Number(id) };
  },
};

module.exports = addressService;
