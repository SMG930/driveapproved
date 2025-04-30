"use client";

import { useState } from "react";
import Link from "next/link";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ApplicationFormData } from "@/lib/types";

// Step components
import PersonalInfoStep from "@/components/application/PersonalInfoStep";
import EmploymentStep from "@/components/application/EmploymentStep";
import VehicleInfoStep from "@/components/application/VehicleInfoStep";
import DocumentsStep from "@/components/application/DocumentsStep";
import ConfirmationStep from "@/components/application/ConfirmationStep";

export default function ApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ApplicationFormData>>({
    payStubUrls: [],
    bankStatementUrls: [],
    idUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [files, setFiles] = useState<{
    payStubs: File[];
    bankStatements: File[];
    id: File | null;
  }>({
    payStubs: [],
    bankStatements: [],
    id: null,
  });

  const totalSteps = 5; // Including confirmation step

  const updateFormData = (data: Partial<ApplicationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const updateFiles = (type: "payStubs" | "bankStatements" | "id", files: any) => {
    setFiles((prev) => ({
      ...prev,
      [type]: type === "id" ? files : Array.from(files),
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Upload documents
      const payStubUrls = await Promise.all(
        files.payStubs.map((file, index) => 
          uploadFile(file, `applications/payStubs/${Date.now()}_${index}_${file.name}`)
        )
      );

      const bankStatementUrls = await Promise.all(
        files.bankStatements.map((file, index) => 
          uploadFile(file, `applications/bankStatements/${Date.now()}_${index}_${file.name}`)
        )
      );

      let idUrl = "";
      if (files.id) {
        idUrl = await uploadFile(files.id, `applications/ids/${Date.now()}_${files.id.name}`);
      }

      // Prepare application data
      const applicationData: Partial<ApplicationFormData> = {
        ...formData,
        payStubUrls,
        bankStatementUrls,
        idUrl,
        status: "New",
        createdAt: new Date(),
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, "applications"), applicationData);
      setApplicationId(docRef.id);
      
      // Move to confirmation step
      setCurrentStep(5);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("There was an error submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress percentage
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <main className="flex min-h-screen flex-col items-center py-12 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto max-w-3xl">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-6">Auto Loan Application</h1>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-between mb-8">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index + 1 === currentStep 
                      ? "bg-primary text-white" 
                      : index + 1 < currentStep 
                        ? "bg-green-500 text-white" 
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1 < currentStep ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs mt-1 hidden md:block">
                  {index === 0 && "Personal"}
                  {index === 1 && "Employment"}
                  {index === 2 && "Vehicle"}
                  {index === 3 && "Documents"}
                  {index === 4 && "Confirm"}
                </span>
              </div>
            ))}
          </div>

          {/* Form Steps */}
          <div className="mb-6">
            {currentStep === 1 && (
              <PersonalInfoStep 
                formData={formData} 
                updateFormData={updateFormData} 
                nextStep={nextStep} 
              />
            )}
            {currentStep === 2 && (
              <EmploymentStep 
                formData={formData} 
                updateFormData={updateFormData} 
                nextStep={nextStep} 
                prevStep={prevStep} 
              />
            )}
            {currentStep === 3 && (
              <VehicleInfoStep 
                formData={formData} 
                updateFormData={updateFormData} 
                nextStep={nextStep} 
                prevStep={prevStep} 
              />
            )}
            {currentStep === 4 && (
              <DocumentsStep 
                formData={formData}
                files={files}
                updateFiles={updateFiles}
                nextStep={handleSubmit}
                prevStep={prevStep}
                isSubmitting={isSubmitting}
              />
            )}
            {currentStep === 5 && (
              <ConfirmationStep 
                applicationId={applicationId} 
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
