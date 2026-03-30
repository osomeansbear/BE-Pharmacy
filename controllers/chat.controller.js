const BaseController = require("./base.controller");
const chatService = require("../services/chat.service");

class ChatController extends BaseController {
  sendMessage = async (req, res) => {
    try {
      const userId = req.user?.id || null;
      const { message, history } = req.body;

      const result = await chatService.processMessage(userId, message, history);

      this.success(res, result, "Message processed");
    } catch (err) {
      this.error(res, err);
    }
  };
}

module.exports = new ChatController();
