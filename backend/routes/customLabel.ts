import express from 'express';
import controller from '../controllers/customLabel';

const router = express.Router();

router.post('/create', controller.create);
router.patch('/update/:customLabelID', controller.update);
router.delete('/:customLabelID', controller.deleteCustomLabel);
router.get('/:authorID', controller.readAll);

export = router;
