const inventoryService = require('../services/inventory.service')
const { SuccessResponse } = require('../core/success.response')

class InventoryController {
  addStock = async (req, res, next) => {
    new SuccessResponse({
      message: "addStockToInventory success !",
      metadata: await inventoryService.addStockToInventory(req.body)
    }).send(res)
  };
}

module.exports = new InventoryController();
