import express from 'express';
import controller from '../controllers/task';

const router = express.Router();

router.post('/create', controller.create);
router.patch('/update/:taskID', controller.update);
router.delete('/:taskID', controller.deleteTask);
router.get('/read/:taskID', controller.read);
router.get('/:authorID', controller.readAll);

export = router;
