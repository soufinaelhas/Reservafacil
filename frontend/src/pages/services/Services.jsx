import { useState } from 'react';
import { useServices, useDeleteService } from '../../hooks/useServices';
import ServiceFormModal from './ServiceFormModal';
import ServiceList from './ServiceList';

/**
 * Services Page Component
 *
 * Main page for managing services (create, edit, delete, view list).
 * Implements full CRUD operations with React Query mutations.
 */
export default function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Fetch services with React Query
  const { data, isLoading, error } = useServices(false);
  const services = data?.services || [];

  // Delete mutation
  const deleteServiceMutation = useDeleteService();

  /**
   * Opens modal in Create Mode
   */
  const handleAddNewService = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  /**
   * Opens modal in Edit Mode with selected service data
   */
  const handleEditService = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  /**
   * Closes modal and resets form state
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  /**
   * Handles service deletion with confirmation
   */
  const handleDeleteService = async (service) => {
    if (window.confirm(`Are you sure you want to delete "${service.name}"?`)) {
      deleteServiceMutation.mutate(service.id);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Service Management
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Create and manage your business services, pricing, and durations
            </p>
          </div>
          <button
            onClick={handleAddNewService}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Service
          </button>
        </div>
      </div>

      {/* Service List Component */}
      <ServiceList
        services={services}
        isLoading={isLoading}
        error={error}
        onEditService={handleEditService}
        onDeleteService={handleDeleteService}
        onAddService={handleAddNewService}
      />

      {/* Service Form Modal */}
      {isModalOpen && (
        <ServiceFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingService={editingService}
        />
      )}
    </div>
  );
}
