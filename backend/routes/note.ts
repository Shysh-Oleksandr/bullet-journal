import express from 'express';
import controller from '../controllers/note';

const router = express.Router();

router.get('/read/:noteID', controller.read);
router.get('/query/:authorID', controller.query);
router.post('/create', controller.create);
router.patch('/update/:noteID', controller.update);
router.delete('/:noteID', controller.deleteNote);
router.get('/:authorID', controller.readAll);

export = router;
