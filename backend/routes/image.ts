import express from 'express';
import controller from '../controllers/image';
import multer, { memoryStorage } from 'multer';

const router = express.Router();

const storage = memoryStorage();
const upload = multer({ storage });

router.post('/create', controller.create);
router.patch('/update/:imageID', controller.update);
router.delete('', controller.deleteImagesHandler);
router.get('/:authorID', controller.readAll);
router.post('/upload', upload.single('image'), controller.upload);
router.post('/uploadMany', upload.array('images'), controller.uploadMany);

export = router;
