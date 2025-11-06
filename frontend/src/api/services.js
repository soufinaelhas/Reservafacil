import apiClient from './client';

/**
 * Service API endpoints
 */

// Get all services
export const getServices = async (includeInactive = false) => {
  const response = await apiClient.get('/services', {
    params: { includeInactive },
  });
  return response.data;
};

// Get service by ID
export const getServiceById = async (id) => {
  const response = await apiClient.get(`/services/${id}`);
  return response.data;
};

// Create new service
export const createService = async (serviceData) => {
  const response = await apiClient.post('/services', serviceData);
  return response.data;
};

// Update existing service
export const updateService = async ({ id, data }) => {
  const response = await apiClient.put(`/services/${id}`, data);
  return response.data;
};

// Delete service
export const deleteService = async (id) => {
  const response = await apiClient.delete(`/services/${id}`);
  return response.data;
};

// Reorder services
export const reorderServices = async (serviceOrders) => {
  const response = await apiClient.patch('/services/reorder', { serviceOrders });
  return response.data;
};
