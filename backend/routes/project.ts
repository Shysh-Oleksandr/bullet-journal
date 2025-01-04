import express from 'express';
import controller from '../controllers/project';

const router = express.Router();

router.post('/create', controller.create);
router.patch('/update/:projectID', controller.update);
router.delete('/:projectID', controller.deleteProject);
router.get('/read/:projectID', controller.read);
router.get('/:authorID', controller.readAll);

export = router;
