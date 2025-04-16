import express from 'express'
import { createRequest, acceptRequest, pendingRequests } from '../controller/requestController.js'

const router = express.Router();

router.post('/create', createRequest);
router.post('/accept:id', acceptRequest);
router.get('/pending', pendingRequests)


export default router;