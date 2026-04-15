const BaseController = require("./base.controller.js");
const AdminService = require("../services/admin.service.js");

class AdminController extends BaseController {
  getStats = async (req, res) => {
    try {
      const stats = await AdminService.getStats();
      this.success(res, { data: stats }, "Stats retrieved");
    } catch (err) {
      this.error(res, err);
    }
  };
}

module.exports = new AdminController();
