const BaseController = require("./base.controller.js");
const addressService = require("../services/address.service.js");

class AddressController extends BaseController {
  createAddress = async (req, res) => {
    try {
      const result = await addressService.createAddress(req.user.id, req.body);
      return this.success(res, { address: result }, "Address created", 201);
    } catch (err) {
      return this.error(res, err);
    }
  };

  getAddresses = async (req, res) => {
    try {
      const result = await addressService.getAddresses(req.user.id);
      return this.success(
        res,
        { addresses: result },
        "Addresses retrieved successfully",
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  updateAddress = async (req, res) => {
    try {
      const result = await addressService.updateAddress(
        req.user.id,
        req.params.id,
        req.body,
      );
      return this.success(
        res,
        { address: result },
        "Address updated successfully",
      );
    } catch (err) {
      return this.error(res, err);
    }
  };

  deleteAddress = async (req, res) => {
    try {
      const result = await addressService.deleteAddress(
        req.user.id,
        req.params.id,
      );
      return this.success(res, result, "Address deleted successfully");
    } catch (err) {
      return this.error(res, err);
    }
  };
}

module.exports = new AddressController();
