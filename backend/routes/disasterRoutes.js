import express from 'express'
import { getUpi } from '../controller/disasterController'

const router = express.Router();

router.post('/upi:id', getUpi);

export default router;