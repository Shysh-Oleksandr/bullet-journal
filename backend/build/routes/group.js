"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const group_1 = __importDefault(require("../controllers/group"));
const router = express_1.default.Router();
router.post('/create', group_1.default.create);
router.patch('/update/:groupID', group_1.default.update);
router.delete('/:groupID', group_1.default.deleteGroup);
router.get('/read/:groupID', group_1.default.read);
router.get('/:authorID', group_1.default.readAll);
router.get('/get-elements/:authorID', group_1.default.getAllElements);
module.exports = router;
