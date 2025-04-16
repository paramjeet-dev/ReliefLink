import express from 'express'
import { getUpi, create,getAllDisasters} from '../controller/disasterController.js'

const router = express.Router();

router.get('/upi/:id', getUpi);
router.post('/create',create)
router.get('/all',getAllDisasters)

export default router;