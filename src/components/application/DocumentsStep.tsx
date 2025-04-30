"use client";

import { ApplicationFormData } from "@/lib/types";
import { useState } from "react";

interface Props {
  formData: Partial<ApplicationFormData>;
  files: {
    payStubs: File[];
    bankStatements: File[];
    id: File | null;
  };
  updateFiles: (type: "payStubs" | "bankStatements" | "id", files: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  isSubmitting: boolean;
}

export default function DocumentsStep({ formData, files, updateFiles, nextStep, prevStep, isSubmitting }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles) {
      if (name === "id") {
        updateFiles(name, selectedFiles[0]);
      } else {
        updateFiles(name as "payStubs" | "bankStatements", selectedFiles);
      }
      setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
    }
  };

  const validateFiles = () => {
    const newErrors: Record<string, string> = {};
    if (files.payStubs.length === 0) {
      newErrors.payStubs = "At least one pay stub is required.";
    }
    if (files.bankStatements.length === 0) {
      newErrors.bankStatements = "At least one bank statement is required.";
    }
    if (!files.id) {
      newErrors.id = "Government-issued ID is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFiles()) {
      nextStep(); // This triggers the handleSubmit in the parent component
    }
  };

  const renderFileList = (fileList: File[]) => (
    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
      {fileList.map((file, index) => (
        <li key={index}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
      ))}
    </ul>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Step 4: Upload Documents</h2>
      <p className="text-sm text-gray-600 mb-4">Please upload the following documents (PDF or JPG format).</p>
      
      {/* Pay Stubs */}
      <div>
        <label htmlFor="payStubs" className="block text-sm font-medium text-gray-700 mb-1">Pay Stubs (1-3 files)</label>
        <input
          type="file"
          name="payStubs"
          id="payStubs"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />
        {files.payStubs.length > 0 && renderFileList(files.payStubs)}
        {errors.payStubs && <p className="text-red-500 text-xs mt-1">{errors.payStubs}</p>}
      </div>

      {/* Bank Statements */}
      <div>
        <label htmlFor="bankStatements" className="block text-sm font-medium text-gray-700 mb-1">Bank Statements (1-3 files)</label>
        <input
          type="file"
          name="bankStatements"
          id="bankStatements"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />
        {files.bankStatements.length > 0 && renderFileList(files.bankStatements)}
        {errors.bankStatements && <p className="text-red-500 text-xs mt-1">{errors.bankStatements}</p>}
      </div>

      {/* Government ID */}
      <div>
        <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">Government-Issued ID (1 file)</label>
        <input
          type="file"
          name="id"
          id="id"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />
        {files.id && (
          <p className="text-sm text-gray-600 mt-1">{files.id.name} ({(files.id.size / 1024).toFixed(1)} KB)</p>
        )}
        {errors.id && <p className="text-red-500 text-xs mt-1">{errors.id}</p>}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-6 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 font-medium text-white shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </button>
      </div>
    </form>
  );
}
