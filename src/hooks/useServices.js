import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * API Service Functions
 * These functions interact with the /api/services endpoints
 */

// Fetch all services for the authenticated user's business
const fetchServices = async () => {
  const response = await axios.get('/api/services');
  return response.data.services || response.data;
};

// Create a new service
const createService = async (serviceData) => {
  const response = await axios.post('/api/services', serviceData);
  return response.data.service || response.data;
};

// Update an existing service
const updateService = async ({ id, data }) => {
  const response = await axios.put(`/api/services/${id}`, data);
  return response.data.service || response.data;
};

// Delete a service
const deleteService = async (id) => {
  const response = await axios.delete(`/api/services/${id}`);
  return response.data;
};

/**
 * React Query Hooks
 */

/**
 * Hook to fetch all services
 * @returns {Object} React Query result with services data, loading, and error states
 */
export const useServices = () => {
  return useQuery('services', fetchServices, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    onError: (error) => {
      const message = error.response?.data?.error || 'Error loading services';
      toast.error(message);
      console.error('Error fetching services:', error);
    },
  });
};

/**
 * Hook to create a new service
 * @returns {Object} Mutation object with mutate function and status
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation(createService, {
    onSuccess: (data) => {
      // Invalidate and refetch services query
      queryClient.invalidateQueries('services');
      toast.success('Service created successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Error creating service';
      toast.error(message);
      console.error('Error creating service:', error);
    },
  });
};

/**
 * Hook to update an existing service
 * @returns {Object} Mutation object with mutate function and status
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation(updateService, {
    onSuccess: (data) => {
      // Invalidate and refetch services query
      queryClient.invalidateQueries('services');
      toast.success('Service updated successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Error updating service';
      toast.error(message);
      console.error('Error updating service:', error);
    },
  });
};

/**
 * Hook to delete a service
 * @returns {Object} Mutation object with mutate function and status
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteService, {
    onSuccess: () => {
      // Invalidate and refetch services query
      queryClient.invalidateQueries('services');
      toast.success('Service deleted successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Error deleting service';
      toast.error(message);
      console.error('Error deleting service:', error);
    },
  });
};
