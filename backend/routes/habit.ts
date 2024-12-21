import express from 'express';
import controller from '../controllers/habit';

const router = express.Router();

router.post('/create', controller.create);
router.put('/reorder', controller.reorder);
router.patch('/update/:habitID', controller.update);
router.delete('/:habitID', controller.deleteHabit);
router.get('/read/:habitID', controller.read);
router.get('/:authorID', controller.readAll);

export = router;
