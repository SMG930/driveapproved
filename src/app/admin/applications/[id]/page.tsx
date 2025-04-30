"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { auth, db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { ApplicationFormData } from "@/lib/types";

export default function ApplicationDetailPage() {
  const [application, setApplication] = useState<(ApplicationFormData & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }

      if (applicationId) {
        fetchApplication(applicationId);
      }
    });

    return () => unsubscribe();
  }, [router, applicationId]);

  const fetchApplication = async (id: string) => {
    try {
      setLoading(true);
      setError("");
      const docRef = doc(db, "applications", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as ApplicationFormData;
        const appData = {
          ...data,
          id: docSnap.id,
          createdAt: data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt.seconds * 1000)
        };
        setApplication(appData);
        setNewStatus(appData.status);
        setAssignedTo(appData.assignedTo || "");
      } else {
        setError("Application not found.");
      }
    } catch (err) {
      console.error("Error fetching application:", err);
      setError("Failed to load application details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!application) return;
    setIsUpdating(true);
    try {
      const docRef = doc(db, "applications", application.id);
      await updateDoc(docRef, {
        status: newStatus,
        assignedTo: assignedTo,
        // Placeholder AI Summary update (can be refined later)
        aiSummary: application.aiSummary || `This applicant earns $${application.monthlyIncome?.toLocaleString()}/mo and matches approval guidelines.`
      });
      // Re-fetch to show updated data
      fetchApplication(application.id);
    } catch (err) {
      console.error("Error updating application:", err);
      alert("Failed to update application.");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderDocumentLink = (url: string, label: string) => {
    if (!url) return <span className="text-gray-500">Not provided</span>;
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-primary hover:underline"
      >
        {label}
      </a>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="ml-2">Loading application...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  if (!application) {
    return <div className="text-center text-gray-500 p-8">Application data not available.</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="text-primary hover:text-primary/80 mr-4">
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-xl font-bold">Application Details</h1>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Application Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{application.fullName}</h2>
              <p className="text-sm text-gray-500">Submitted: {application.createdAt.toLocaleDateString()}</p>
            </div>
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${application.status === "Approved" ? "bg-green-100 text-green-800" : application.status === "Declined" ? "bg-red-100 text-red-800" : application.status === "In Review" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}>
              {application.status}
            </span>
          </div>

          {/* Application Details Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold border-b pb-1 mb-2">Personal Information</h3>
              <p><span className="font-medium">Email:</span> {application.email}</p>
              <p><span className="font-medium">Phone:</span> {application.phone}</p>
              <p><span className="font-medium">Address:</span> {application.address}, {application.city}, {application.state} {application.zipCode}</p>
              
              <h3 className="text-md font-semibold border-b pb-1 mb-2 pt-4">Employment & Income</h3>
              <p><span className="font-medium">Employer:</span> {application.employer}</p>
              <p><span className="font-medium">Job Title:</span> {application.jobTitle}</p>
              <p><span className="font-medium">Status:</span> {application.employmentStatus}</p>
              <p><span className="font-medium">Income:</span> ${application.monthlyIncome?.toLocaleString()}/mo</p>
              <p><span className="font-medium">Length:</span> {application.employmentLength}</p>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold border-b pb-1 mb-2">Vehicle Information</h3>
              {application.hasSelectedVehicle ? (
                <>
                  <p><span className="font-medium">Type:</span> {application.vehicleType}</p>
                  <p><span className="font-medium">Vehicle:</span> {application.vehicleYear} {application.vehicleMake} {application.vehicleModel}</p>
                  <p><span className="font-medium">Price:</span> ${application.vehiclePrice?.toLocaleString()}</p>
                </>
              ) : (
                <p>No specific vehicle selected.</p>
              )}
              <p><span className="font-medium">Down Payment:</span> ${application.downPayment?.toLocaleString() || 0}</p>

              <h3 className="text-md font-semibold border-b pb-1 mb-2 pt-4">Uploaded Documents</h3>
              <div>
                <p className="font-medium mb-1">Pay Stubs:</p>
                {application.payStubUrls.length > 0 ? (
                  <ul className="list-disc list-inside ml-4">
                    {application.payStubUrls.map((url, index) => (
                      <li key={index}>{renderDocumentLink(url, `Pay Stub ${index + 1}`)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No pay stubs uploaded.</p>
                )}
              </div>
              <div>
                <p className="font-medium mb-1">Bank Statements:</p>
                {application.bankStatementUrls.length > 0 ? (
                  <ul className="list-disc list-inside ml-4">
                    {application.bankStatementUrls.map((url, index) => (
                      <li key={index}>{renderDocumentLink(url, `Bank Statement ${index + 1}`)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No bank statements uploaded.</p>
                )}
              </div>
              <div>
                <p className="font-medium mb-1">Government ID:</p>
                {renderDocumentLink(application.idUrl, "View ID")}
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="px-6 py-4 border-t border-gray-200">
            <h3 className="text-md font-semibold mb-2">AI Summary (Placeholder)</h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
              {application.aiSummary || `This applicant earns $${application.monthlyIncome?.toLocaleString()}/mo and matches approval guidelines.`}
            </p>
          </div>

          {/* Actions Section */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <h3 className="text-md font-semibold mb-3">Update Application</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="New">New</option>
                  <option value="In Review">In Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                <select
                  id="assignedTo"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Unassigned</option>
                  <option value="Shannon">Shannon</option>
                  <option value="Dana">Dana</option>
                  {/* Add more team members as needed */}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="w-full inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 font-medium text-white shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                >
                  {isUpdating ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
