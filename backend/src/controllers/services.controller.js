import { PrismaClient } from '@prisma/client';
import { validateService } from '../utils/validators.js';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

/**
 * Create a new service
 * POST /api/services
 */
export const createService = async (req, res) => {
  try {
    const userId = req.userId;

    // Validate input
    const { error } = validateService(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      });
    }

    const {
      name,
      description,
      durationMinutes,
      price,
      bufferTimeMinutes,
      category,
      depositRequired,
      depositAmount,
      depositPercentage,
      maxAdvanceDays,
      minAdvanceHours,
      imageUrl,
      isActive
    } = req.body;

    // Get current max displayOrder for this user
    const maxOrderService = await prisma.service.findFirst({
      where: { userId },
      orderBy: { displayOrder: 'desc' },
      select: { displayOrder: true }
    });

    const displayOrder = maxOrderService ? maxOrderService.displayOrder + 1 : 0;

    // Create service
    const service = await prisma.service.create({
      data: {
        userId,
        name,
        description: description || null,
        durationMinutes,
        price,
        bufferTimeMinutes: bufferTimeMinutes || 0,
        category: category || null,
        depositRequired: depositRequired || false,
        depositAmount: depositAmount || null,
        depositPercentage: depositPercentage || null,
        maxAdvanceDays: maxAdvanceDays || 90,
        minAdvanceHours: minAdvanceHours || 2,
        imageUrl: imageUrl || null,
        isActive: isActive !== undefined ? isActive : true,
        displayOrder
      }
    });

    logger.info(`Service created: ${service.id} by user: ${userId}`);

    res.status(201).json({
      message: 'Service created successfully',
      service
    });

  } catch (error) {
    logger.error('Create service error:', error);

    // Handle Prisma specific errors
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'A service with this name already exists'
      });
    }

    res.status(500).json({
      error: 'Failed to create service. Please try again.'
    });
  }
};

/**
 * Get all services for the authenticated user
 * GET /api/services
 */
export const getServices = async (req, res) => {
  try {
    const userId = req.userId;
    const { includeInactive } = req.query;

    // Build where clause
    const where = { userId };
    if (includeInactive !== 'true') {
      where.isActive = true;
    }

    // Fetch services
    const services = await prisma.service.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    });

    res.json({
      services,
      count: services.length
    });

  } catch (error) {
    logger.error('Get services error:', error);
    res.status(500).json({
      error: 'Failed to fetch services'
    });
  }
};

/**
 * Get a single service by ID
 * GET /api/services/:id
 */
export const getServiceById = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const service = await prisma.service.findFirst({
      where: {
        id,
        userId
      },
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    });

    if (!service) {
      return res.status(404).json({
        error: 'Service not found'
      });
    }

    res.json({ service });

  } catch (error) {
    logger.error('Get service by ID error:', error);
    res.status(500).json({
      error: 'Failed to fetch service'
    });
  }
};

/**
 * Update a service
 * PUT /api/services/:id
 */
export const updateService = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Validate input
    const { error } = validateService(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      });
    }

    // Check if service exists and belongs to user
    const existingService = await prisma.service.findFirst({
      where: { id, userId }
    });

    if (!existingService) {
      return res.status(404).json({
        error: 'Service not found'
      });
    }

    const {
      name,
      description,
      durationMinutes,
      price,
      bufferTimeMinutes,
      category,
      depositRequired,
      depositAmount,
      depositPercentage,
      maxAdvanceDays,
      minAdvanceHours,
      imageUrl,
      isActive,
      displayOrder
    } = req.body;

    // Update service
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name,
        description: description || null,
        durationMinutes,
        price,
        bufferTimeMinutes: bufferTimeMinutes !== undefined ? bufferTimeMinutes : existingService.bufferTimeMinutes,
        category: category || null,
        depositRequired: depositRequired !== undefined ? depositRequired : existingService.depositRequired,
        depositAmount: depositAmount !== undefined ? depositAmount : existingService.depositAmount,
        depositPercentage: depositPercentage !== undefined ? depositPercentage : existingService.depositPercentage,
        maxAdvanceDays: maxAdvanceDays !== undefined ? maxAdvanceDays : existingService.maxAdvanceDays,
        minAdvanceHours: minAdvanceHours !== undefined ? minAdvanceHours : existingService.minAdvanceHours,
        imageUrl: imageUrl !== undefined ? imageUrl : existingService.imageUrl,
        isActive: isActive !== undefined ? isActive : existingService.isActive,
        displayOrder: displayOrder !== undefined ? displayOrder : existingService.displayOrder
      }
    });

    logger.info(`Service updated: ${id} by user: ${userId}`);

    res.json({
      message: 'Service updated successfully',
      service: updatedService
    });

  } catch (error) {
    logger.error('Update service error:', error);

    // Handle Prisma specific errors
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'A service with this name already exists'
      });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Service not found'
      });
    }

    res.status(500).json({
      error: 'Failed to update service'
    });
  }
};

/**
 * Delete a service
 * DELETE /api/services/:id
 */
export const deleteService = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Check if service exists and belongs to user
    const service = await prisma.service.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    });

    if (!service) {
      return res.status(404).json({
        error: 'Service not found'
      });
    }

    // Check if service has bookings
    if (service._count.bookings > 0) {
      return res.status(400).json({
        error: 'Cannot delete service with existing bookings. Consider deactivating it instead.'
      });
    }

    // Delete service
    await prisma.service.delete({
      where: { id }
    });

    logger.info(`Service deleted: ${id} by user: ${userId}`);

    res.json({
      message: 'Service deleted successfully'
    });

  } catch (error) {
    logger.error('Delete service error:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Service not found'
      });
    }

    res.status(500).json({
      error: 'Failed to delete service'
    });
  }
};

/**
 * Reorder services
 * PATCH /api/services/reorder
 */
export const reorderServices = async (req, res) => {
  try {
    const userId = req.userId;
    const { serviceOrders } = req.body;

    // Validate input
    if (!Array.isArray(serviceOrders) || serviceOrders.length === 0) {
      return res.status(400).json({
        error: 'serviceOrders must be a non-empty array of {id, displayOrder}'
      });
    }

    // Verify all services belong to the user
    const serviceIds = serviceOrders.map(s => s.id);
    const services = await prisma.service.findMany({
      where: {
        id: { in: serviceIds },
        userId
      }
    });

    if (services.length !== serviceIds.length) {
      return res.status(403).json({
        error: 'One or more services not found or unauthorized'
      });
    }

    // Update display orders
    const updatePromises = serviceOrders.map(({ id, displayOrder }) =>
      prisma.service.update({
        where: { id },
        data: { displayOrder }
      })
    );

    await Promise.all(updatePromises);

    logger.info(`Services reordered by user: ${userId}`);

    res.json({
      message: 'Services reordered successfully'
    });

  } catch (error) {
    logger.error('Reorder services error:', error);
    res.status(500).json({
      error: 'Failed to reorder services'
    });
  }
};
