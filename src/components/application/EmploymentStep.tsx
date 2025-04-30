"use client";

import { ApplicationFormData } from "@/lib/types";

interface Props {
  formData: Partial<ApplicationFormData>;
  updateFormData: (data: Partial<ApplicationFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function EmploymentStep({ formData, updateFormData, nextStep, prevStep }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: name === "monthlyIncome" ? parseFloat(value) : value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation if needed
    nextStep();
  };

  return (
    <form onSubmit={handleNext} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Step 2: Employment & Income</h2>
      <div>
        <label htmlFor="employer" className="block text-sm font-medium text-gray-700 mb-1">Employer Name</label>
        <input
          type="text"
          name="employer"
          id="employer"
          value={formData.employer || ""}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
        <input
          type="text"
          name="jobTitle"
          id="jobTitle"
          value={formData.jobTitle || ""}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
        <select
          name="employmentStatus"
          id="employmentStatus"
          value={formData.employmentStatus || ""}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        >
          <option value="" disabled>Select status</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Self-employed">Self-employed</option>
          <option value="Unemployed">Unemployed</option>
          <option value="Retired">Retired</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-1">Monthly Income ($)</label>
        <input
          type="number"
          name="monthlyIncome"
          id="monthlyIncome"
          value={formData.monthlyIncome || ""}
          onChange={handleChange}
          required
          min="0"
          step="100"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="employmentLength" className="block text-sm font-medium text-gray-700 mb-1">Length of Employment</label>
        <select
          name="employmentLength"
          id="employmentLength"
          value={formData.employmentLength || ""}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        >
          <option value="" disabled>Select length</option>
          <option value="Less than 1 year">Less than 1 year</option>
          <option value="1-3 years">1-3 years</option>
          <option value="3-5 years">3-5 years</option>
          <option value="5+ years">5+ years</option>
        </select>
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
