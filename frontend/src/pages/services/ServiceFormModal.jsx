import { useState, useEffect } from 'react';
import { useCreateService, useUpdateService } from '../../hooks/useServices';

/**
 * ServiceFormModal Component
 *
 * Modal form for creating and editing services.
 * Integrates with React Query mutations for API operations.
 */
export default function ServiceFormModal({ isOpen, onClose, editingService }) {
  const isEditMode = editingService !== null;

  // Mutation hooks
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMinutes: '',
    price: '',
    bufferTimeMinutes: '0',
    category: '',
    depositRequired: false,
    depositAmount: '',
    depositPercentage: '',
    maxAdvanceDays: '90',
    minAdvanceHours: '2',
    imageUrl: '',
    isActive: true,
  });

  // Initialize form with editing service data
  useEffect(() => {
    if (editingService) {
      setFormData({
        name: editingService.name || '',
        description: editingService.description || '',
        durationMinutes: editingService.durationMinutes?.toString() || '',
        price: editingService.price || '',
        bufferTimeMinutes: editingService.bufferTimeMinutes?.toString() || '0',
        category: editingService.category || '',
        depositRequired: editingService.depositRequired || false,
        depositAmount: editingService.depositAmount || '',
        depositPercentage: editingService.depositPercentage?.toString() || '',
        maxAdvanceDays: editingService.maxAdvanceDays?.toString() || '90',
        minAdvanceHours: editingService.minAdvanceHours?.toString() || '2',
        imageUrl: editingService.imageUrl || '',
        isActive: editingService.isActive ?? true,
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        description: '',
        durationMinutes: '',
        price: '',
        bufferTimeMinutes: '0',
        category: '',
        depositRequired: false,
        depositAmount: '',
        depositPercentage: '',
        maxAdvanceDays: '90',
        minAdvanceHours: '2',
        imageUrl: '',
        isActive: true,
      });
    }
  }, [editingService]);

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for API (convert strings to numbers where needed)
    const serviceData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      durationMinutes: parseInt(formData.durationMinutes, 10),
      price: parseFloat(formData.price),
      bufferTimeMinutes: parseInt(formData.bufferTimeMinutes, 10) || 0,
      category: formData.category.trim() || undefined,
      depositRequired: formData.depositRequired,
      depositAmount: formData.depositAmount ? parseFloat(formData.depositAmount) : undefined,
      depositPercentage: formData.depositPercentage ? parseInt(formData.depositPercentage, 10) : undefined,
      maxAdvanceDays: parseInt(formData.maxAdvanceDays, 10) || 90,
      minAdvanceHours: parseInt(formData.minAdvanceHours, 10) || 2,
      imageUrl: formData.imageUrl.trim() || undefined,
      isActive: formData.isActive,
    };

    // Call appropriate mutation
    if (isEditMode) {
      updateServiceMutation.mutate(
        { id: editingService.id, data: serviceData },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createServiceMutation.mutate(serviceData, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const isSubmitting = createServiceMutation.isLoading || updateServiceMutation.isLoading;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
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
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3
                className="text-lg leading-6 font-medium text-gray-900 mb-6"
                id="modal-title"
              >
                {isEditMode ? 'Edit Service' : 'Create New Service'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Service Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Service Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., Haircut, Massage, Consultation"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Brief description of the service"
                    />
                  </div>

                  {/* Duration and Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700">
                        Duration (minutes) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="durationMinutes"
                        id="durationMinutes"
                        required
                        min="1"
                        value={formData.durationMinutes}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="30"
                      />
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price ($) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="50.00"
                      />
                    </div>
                  </div>

                  {/* Buffer Time and Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="bufferTimeMinutes" className="block text-sm font-medium text-gray-700">
                        Buffer Time (minutes)
                      </label>
                      <input
                        type="number"
                        name="bufferTimeMinutes"
                        id="bufferTimeMinutes"
                        min="0"
                        value={formData.bufferTimeMinutes}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., Hair Services"
                      />
                    </div>
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Service is active and available for booking
                    </label>
                  </div>
                </div>

                {/* Modal actions */}
                <div className="mt-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>{isEditMode ? 'Update Service' : 'Create Service'}</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
