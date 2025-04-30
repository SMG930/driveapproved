"use client";

import { ApplicationFormData } from "@/lib/types";

interface Props {
  formData: Partial<ApplicationFormData>;
  updateFormData: (data: Partial<ApplicationFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function VehicleInfoStep({ formData, updateFormData, nextStep, prevStep }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === "hasSelectedVehicle") {
      updateFormData({ [name]: value === "yes" });
    } else if (type === "number") {
      updateFormData({ [name]: value ? parseFloat(value) : undefined });
    } else {
      updateFormData({ [name]: value });
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleNext} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Step 3: Vehicle Information</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Have you selected a vehicle?</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hasSelectedVehicle"
              value="yes"
              checked={formData.hasSelectedVehicle === true}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hasSelectedVehicle"
              value="no"
              checked={formData.hasSelectedVehicle === false}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="ml-2">No</span>
          </label>
        </div>
      </div>

      {formData.hasSelectedVehicle && (
        <>
          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
            <select
              name="vehicleType"
              id="vehicleType"
              value={formData.vehicleType || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="" disabled>Select type</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700 mb-1">Make</label>
              <input
                type="text"
                name="vehicleMake"
                id="vehicleMake"
                value={formData.vehicleMake || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input
                type="text"
                name="vehicleModel"
                id="vehicleModel"
                value={formData.vehicleModel || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vehicleYear" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="text"
                name="vehicleYear"
                id="vehicleYear"
                value={formData.vehicleYear || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="vehiclePrice" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                name="vehiclePrice"
                id="vehiclePrice"
                value={formData.vehiclePrice || ""}
                onChange={handleChange}
                min="0"
                step="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </>
      )}

      <div>
        <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-1">Down Payment ($)</label>
        <input
          type="number"
          name="downPayment"
          id="downPayment"
          value={formData.downPayment || ""}
          onChange={handleChange}
          min="0"
          step="100"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-6 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 font-medium text-white shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </form>
  );
}
