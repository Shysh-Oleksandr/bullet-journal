"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const habit_1 = __importDefault(require("../controllers/habit"));
const router = express_1.default.Router();
router.post('/create', habit_1.default.create);
router.put('/reorder', habit_1.default.reorder);
router.patch('/update/:habitID', habit_1.default.update);
router.delete('/:habitID', habit_1.default.deleteHabit);
router.get('/read/:habitID', habit_1.default.read);
router.get('/:authorID', habit_1.default.readAll);
module.exports = router;
