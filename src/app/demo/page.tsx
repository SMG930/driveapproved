"use client";

import { useState } from "react";
import Link from "next/link";

export default function DemoPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [income, setIncome] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call and AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock result
    const mockResult = {
      applicantName: name || "Jane Doe",
      monthlyIncome: income || "5000",
      status: "Pre-Approved",
      readinessScore: 8,
      riskLevel: "Low",
      summary: `Applicant ${name || "Jane Doe"} reports a monthly income of $${income || "5000"}. Based on initial analysis, the application meets pre-approval guidelines with a low risk assessment.`,
    };

    setResult(mockResult);
    setLoading(false);
    setStep(2);
  };

  return (
    <main className="flex min-h-screen flex-col items-center py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-6">Live Demo</h1>

          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-gray-600 text-center mb-6">
                Experience a simplified version of the DriveApproved application process.
              </p>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Income ($)
                </label>
                <input
                  type="number"
                  id="income"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="5000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 font-medium text-white shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Simulate Pre-Approval"
                )}
              </button>
            </form>
          )}

          {step === 2 && result && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center text-green-600">Pre-Approval Result</h2>
              <div className="border border-gray-200 rounded-md p-6 space-y-4">
                <p><strong>Applicant:</strong> {result.applicantName}</p>
                <p><strong>Reported Income:</strong> ${result.monthlyIncome}/mo</p>
                <p><strong>Status:</strong> <span className="font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full text-sm">{result.status}</span></p>
                <p><strong>Readiness Score:</strong> <span className="font-semibold">{result.readinessScore}/10</span></p>
                <p><strong>Risk Level:</strong> <span className={`font-semibold px-2 py-1 rounded-full text-sm ${result.riskLevel === 'Low' ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'}`}>{result.riskLevel}</span></p>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-sm font-semibold mb-2">AI Summary:</h3>
                  <p className="text-sm text-gray-600">{result.summary}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center">
                This is a simulated result based on mock data. The full application involves detailed document analysis.
              </p>
              <div className="flex justify-center space-x-4">
                 <Link
                    href="/apply"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 font-medium text-white shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Start Real Application
                  </Link>
                  <button
                    onClick={() => { setStep(1); setResult(null); setName(""); setIncome(""); }}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-6 font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Run Demo Again
                  </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

