import express from 'express';
import { PetController } from '../controllers/pet.controller';

const router = express.Router();

/**
 * @route   PATCH /pets/:id/notes
 * @desc    Update notes and publicNote for a specific pet
 * @access  Protected (Admin)
 */
router.patch('/:id/notes', PetController.updatePetNotes);

export default router;
