import express from 'express'
import { getAllUsers,getDonations,getUserRequests,getAllDonations } from '../controller/userController.js';

const router = express.Router();

router.get('/',getAllUsers)
router.get('/donations/:id',getDonations)
router.get('/pending_request/:id',getUserRequests)
router.get('/donations',getAllDonations)

export default router;