// routes/profileRoutes.ts
import { Router } from 'express';
import { handleProfileRequest } from '../services/profile';

const router = Router();

router.route('/profiles')
  .get(handleProfileRequest)    // Get all profiles
  .post(handleProfileRequest);  // Create a new profile

router.route('/profiles/:id')
  .get(handleProfileRequest)    // Get a specific profile by ID
  .put(handleProfileRequest)    // Update a specific profile by ID
  .patch(handleProfileRequest)  // Partially update a specific profile by ID
  .delete(handleProfileRequest);// Delete a specific profile by ID

export default router;
