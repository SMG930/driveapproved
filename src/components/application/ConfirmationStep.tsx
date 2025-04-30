"use client";

import Link from "next/link";

interface Props {
  applicationId: string | null;
}

export default function ConfirmationStep({ applicationId }: Props) {
  return (
    <div className="text-center space-y-6">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h2 className="text-2xl font-semibold">Application Submitted Successfully!</h2>
      <p className="text-gray-600">
        Thank you for submitting your auto loan application. We have received your information and will begin processing it shortly.
      </p>
      {applicationId && (
        <p className="text-sm text-gray-500">
          Your Application ID is: <span className="font-medium">{applicationId}</span>
        </p>
      )}
      <p className="text-gray-600">
        A member of our team will contact you within 24-48 hours to discuss the next steps.
      </p>
      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 font-medium text-white shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
