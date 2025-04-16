import express from 'express'
import { createRequest, acceptRequest, pendingRequests,gettAllRequests,getAllRequest,getProgressRequest,complete } from '../controller/requestController.js'

const router = express.Router();

router.post('/create', createRequest);
router.post('/accept/:id', acceptRequest);
router.get('/pending', pendingRequests)
router.get('/pending_requests',gettAllRequests)
router.get('/all',getAllRequest)
router.get("/progress",getProgressRequest)
router.post('/complete/:id',complete)


export default router;