import express from 'express';
import controller from '../controllers/group';

const router = express.Router();

router.post('/create', controller.create);
router.patch('/update/:groupID', controller.update);
router.delete('/:groupID', controller.deleteGroup);
router.get('/read/:groupID', controller.read);
router.get('/:authorID', controller.readAll);
router.get('/get-elements/:authorID', controller.getAllElements);

export = router;
