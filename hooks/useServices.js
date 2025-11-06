import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Custom hook to fetch the list of services
 * @returns {Object} React Query result object with services data, loading, and error states
 */
export const useServices = () => {
  return useQuery(
    'services', // Query key
    async () => {
      const response = await axios.get('/api/services');
      return response.data.services;
    },
    {
      onError: (error) => {
        const message = error.response?.data?.error || 'Error loading services';
        toast.error(message);
      },
    }
  );
};

/**
 * Custom hook to create a new service
 * @returns {Object} React Query mutation object
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (serviceData) => {
      const response = await axios.post('/api/services', serviceData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        // Invalidate and refetch services list
        queryClient.invalidateQueries('services');
        toast.success('Service created successfully!');
      },
      onError: (error) => {
        const message = error.response?.data?.error || 'Error creating service';
        toast.error(message);
      },
    }
  );
};

/**
 * Custom hook to update an existing service
 * @returns {Object} React Query mutation object
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, ...serviceData }) => {
      const response = await axios.put(`/api/services/${id}`, serviceData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('services');
        toast.success('Service updated successfully!');
      },
      onError: (error) => {
        const message = error.response?.data?.error || 'Error updating service';
        toast.error(message);
      },
    }
  );
};

/**
 * Custom hook to delete a service
 * @returns {Object} React Query mutation object
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (serviceId) => {
      const response = await axios.delete(`/api/services/${serviceId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('services');
        toast.success('Service deleted successfully!');
      },
      onError: (error) => {
        const message = error.response?.data?.error || 'Error deleting service';
        toast.error(message);
      },
    }
  );
};
