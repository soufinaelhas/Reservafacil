import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  reorderServices,
} from '../api/services';

// Query keys
export const servicesKeys = {
  all: ['services'],
  lists: () => [...servicesKeys.all, 'list'],
  list: (filters) => [...servicesKeys.lists(), { filters }],
  details: () => [...servicesKeys.all, 'detail'],
  detail: (id) => [...servicesKeys.details(), id],
};

/**
 * Hook to fetch all services
 */
export const useServices = (includeInactive = false) => {
  return useQuery(
    servicesKeys.list({ includeInactive }),
    () => getServices(includeInactive),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook to fetch a single service by ID
 */
export const useService = (id) => {
  return useQuery(
    servicesKeys.detail(id),
    () => getServiceById(id),
    {
      enabled: !!id,
    }
  );
};

/**
 * Hook to create a new service
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation(createService, {
    onSuccess: () => {
      // Invalidate and refetch services list
      queryClient.invalidateQueries(servicesKeys.lists());
      toast.success('Service created successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to create service';
      toast.error(message);
    },
  });
};

/**
 * Hook to update an existing service
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation(updateService, {
    onSuccess: (data, variables) => {
      // Invalidate lists and the specific service detail
      queryClient.invalidateQueries(servicesKeys.lists());
      queryClient.invalidateQueries(servicesKeys.detail(variables.id));
      toast.success('Service updated successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to update service';
      toast.error(message);
    },
  });
};

/**
 * Hook to delete a service
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteService, {
    onSuccess: () => {
      // Invalidate services list
      queryClient.invalidateQueries(servicesKeys.lists());
      toast.success('Service deleted successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to delete service';
      toast.error(message);
    },
  });
};

/**
 * Hook to reorder services
 */
export const useReorderServices = () => {
  const queryClient = useQueryClient();

  return useMutation(reorderServices, {
    onSuccess: () => {
      // Invalidate services list
      queryClient.invalidateQueries(servicesKeys.lists());
      toast.success('Services reordered successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to reorder services';
      toast.error(message);
    },
  });
};
