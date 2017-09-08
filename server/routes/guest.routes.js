import { Router } from 'express';
import * as GuestController from '../controllers/guest.controller';
const router = new Router();

// Get all Guest
router.route('/guests').get(GuestController.getGuests);

// Get one guest by cuid
router.route('/guests/:cuid').get(GuestController.getGuest);

// Add a new guest
router.route('/guests').post(GuestController.addGuest);

// Delete a guest by cuid
router.route('/guests/:cuid').delete(GuestController.deleteGuest);

export default router;
