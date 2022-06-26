import express from 'express';
import controller from '../controllers/note';

const router = express.Router();

router.get('/read/:noteID', controller.read);
router.post('/create', controller.create);
router.post('/query', controller.query);
router.patch('/update/:noteID', controller.update);
router.delete('/:noteID', controller.deleteNote);
router.get('/', controller.readAll);

export = router;
