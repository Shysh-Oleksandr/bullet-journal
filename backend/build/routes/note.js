"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const note_1 = __importDefault(require("../controllers/note"));
const router = express_1.default.Router();
router.get('/read/:noteID', note_1.default.read);
router.post('/create', note_1.default.create);
router.patch('/update/:noteID', note_1.default.update);
router.delete('/:noteID', note_1.default.deleteNote);
router.get('/:authorID', note_1.default.readAll);
module.exports = router;
