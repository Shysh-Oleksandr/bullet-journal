"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const task_1 = __importDefault(require("../controllers/task"));
const router = express_1.default.Router();
router.post('/create', task_1.default.create);
router.patch('/update/:taskID', task_1.default.update);
router.delete('/:taskID', task_1.default.deleteTask);
router.get('/read/:taskID', task_1.default.read);
router.get('/:authorID', task_1.default.readAll);
module.exports = router;
