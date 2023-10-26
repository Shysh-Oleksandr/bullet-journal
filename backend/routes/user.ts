import express from 'express';
import extractFirebaseInfo from './../middleware/extractFirebaseInfo';
import controller from '../controllers/user';

const router = express.Router();

router.get('/validate', extractFirebaseInfo, controller.validate);
router.get('/read/:userID', controller.read);
router.post('/create', extractFirebaseInfo, controller.create);
router.post('/login', extractFirebaseInfo, controller.login);
router.patch('/update/:userID', controller.update);
router.get('/', controller.readAll);
router.post('/create-default-data', controller.createDefaultDataForExistingUsers);

export = router;
