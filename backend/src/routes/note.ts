import express from 'express';
import controller from '../controllers/note';

const router = express.Router();

router.get('/:noteID', controller.read);
router.post('/create', controller.create);
router.post('/query', controller.query);
router.post('/update/:noteID', controller.update);
router.delete('/:noteID', controller.deleteNote);
router.get('/', controller.readAll);

export = router;
