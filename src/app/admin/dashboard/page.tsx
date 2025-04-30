"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { ApplicationFormData } from "@/lib/types";

export default function AdminDashboardPage() {
  const [applications, setApplications] = useState<(ApplicationFormData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }

      fetchApplications();
    });

    return () => unsubscribe();
  }, [router]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const applicationsRef = collection(db, "applications");
      const q = query(applicationsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const applicationsData: (ApplicationFormData & { id: string })[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as ApplicationFormData;
        applicationsData.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt.seconds * 1000)
        });
      });
      
      setApplications(applicationsData);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "In Review":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = ["ID", "Name", "Email", "Phone", "Status", "Monthly Income", "Submitted Date"];
    const csvContent = [
      headers.join(","),
      ...filteredApplications.map(app => [
        app.id,
        app.fullName,
        app.email,
        app.phone,
        app.status,
        app.monthlyIncome,
        app.createdAt.toLocaleDateString()
      ].join(","))
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `applications_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-xl font-bold">DriveApproved Admin</h1>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Dashboard Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-xl font-semibold">Applications Dashboard</h2>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 text-sm"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="px-6 py-2 bg-white border-b border-gray-200">
            <div className="flex space-x-2 overflow-x-auto">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "all"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("New")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "New"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                New
              </button>
              <button
                onClick={() => setFilter("In Review")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "In Review"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                In Review
              </button>
              <button
                onClick={() => setFilter("Approved")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "Approved"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilter("Declined")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "Declined"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Declined
              </button>
            </div>
          </div>
          
          {/* Applications Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="ml-2">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-500">No applications found.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Income
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{application.fullName}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(application.status)}`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${application.monthlyIncome?.toLocaleString()}/mo</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.hasSelectedVehicle 
                            ? `${application.vehicleYear} ${application.vehicleMake} ${application.vehicleModel}`
                            : "Not selected"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {application.assignedTo || "Unassigned"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {application.createdAt.toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/admin/applications/${application.id}`}
                          className="text-primary hover:text-primary/80"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
