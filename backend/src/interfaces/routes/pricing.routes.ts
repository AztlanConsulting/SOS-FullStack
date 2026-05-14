import { Router } from 'express';
import { PricingController } from '../controllers/pricing.controller';

const router = Router();

/**
 * Route definitions for Pricing-related resources.
 * GET /pricing
 * Retrieves all available plans with prices localized to the user's currency.
 */
router.get('/pricing', PricingController.handle);

export default router;
