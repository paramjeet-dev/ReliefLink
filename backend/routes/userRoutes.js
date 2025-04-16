import express from 'express'
import { getAllUsers,getDonations,getUserRequests } from '../controller/userController';

const router = express.Router();

router.get('/',getAllUsers)
router.get('/donations:id',getDonations)
router.get('/pending_request',getUserRequests)


export default router;