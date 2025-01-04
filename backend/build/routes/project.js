"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const project_1 = __importDefault(require("../controllers/project"));
const router = express_1.default.Router();
router.post('/create', project_1.default.create);
router.patch('/update/:projectID', project_1.default.update);
router.delete('/:projectID', project_1.default.deleteProject);
router.get('/read/:projectID', project_1.default.read);
router.get('/:authorID', project_1.default.readAll);
module.exports = router;
