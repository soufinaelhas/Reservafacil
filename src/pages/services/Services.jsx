import { useState } from 'react';

/**
 * Services Page Component
 *
 * Main page for managing services (create, edit, delete, view list).
 * This is the architectural scaffolding - API integration and complex state logic
 * will be added in future iterations.
 */
export default function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const handleAddNewService = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSaveService = (serviceData) => {
    // TODO: API call to create/update service will be implemented here
    console.log('Service data to save:', serviceData);
    handleCloseModal();
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
      <ServiceList onEditService={handleEditService} />

      {/* Service Form Modal */}
      {isModalOpen && (
        <ServiceFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveService}
          editingService={editingService}
        />
      )}
    </div>
  );
}

/**
 * ServiceList Component
 *
 * Placeholder component that will display the list of services.
 * Future implementation will include:
 * - Fetching services from API
 * - Service cards with details (name, duration, price)
 * - Edit/Delete actions
 * - Empty state when no services exist
 */
function ServiceList({ onEditService }) {
  // TODO: Fetch services from API
  // const { data: services, isLoading, error } = useQuery('services', fetchServices);

  // Placeholder data for visualization
  const hasServices = false;

  if (hasServices) {
    // This will be implemented when API is ready
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Service cards will be rendered here */}
      </div>
    );
  }

  // Empty state
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No services</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating your first service
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => onEditService(null)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
            Create Service
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * ServiceFormModal Component
 *
 * Placeholder modal component for creating/editing services.
 * Future implementation will include:
 * - Form fields (name, description, duration, price, category)
 * - Form validation
 * - Submit handler with API integration
 * - Loading states
 * - Error handling
 */
function ServiceFormModal({ isOpen, onClose, onSave, editingService }) {
  if (!isOpen) return null;

  const isEditMode = editingService !== null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Collect form data and validate
    const formData = new FormData(e.target);
    const serviceData = {
      name: formData.get('name'),
      description: formData.get('description'),
      duration: formData.get('duration'),
      price: formData.get('price'),
      // ... other fields
    };

    onSave(serviceData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background overlay */}
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                {isEditMode ? 'Edit Service' : 'Create New Service'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Placeholder form fields */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Service Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={editingService?.name || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., Haircut, Massage, Consultation"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      defaultValue={editingService?.description || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Brief description of the service"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        id="duration"
                        defaultValue={editingService?.duration || ''}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="30"
                      />
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        step="0.01"
                        defaultValue={editingService?.price || ''}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="50.00"
                      />
                    </div>
                  </div>

                  {/* TODO: Add more fields as needed (category, color, etc.) */}
                </div>

                {/* Modal actions */}
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isEditMode ? 'Update Service' : 'Create Service'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
