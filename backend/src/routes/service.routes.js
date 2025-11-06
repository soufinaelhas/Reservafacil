import express from 'express';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  reorderServices
} from '../controllers/services.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected - require authentication
router.use(authenticate);

// Service CRUD operations
router.post('/', createService);                    // Create new service
router.get('/', getServices);                       // Get all services for user
router.get('/:id', getServiceById);                 // Get single service
router.put('/:id', updateService);                  // Update service
router.delete('/:id', deleteService);               // Delete service

// Additional operations
router.patch('/reorder', reorderServices);          // Reorder services

export default router;
