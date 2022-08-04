"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const customLabel_1 = __importDefault(require("../controllers/customLabel"));
const router = express_1.default.Router();
router.post('/create', customLabel_1.default.create);
router.patch('/update/:customLabelID', customLabel_1.default.update);
router.delete('/:customLabelID', customLabel_1.default.deleteCustomLabel);
router.get('/:authorID', customLabel_1.default.readAll);
module.exports = router;
