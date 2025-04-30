import { ApplicationFormData } from "@/lib/types";

// This is a placeholder for AI document analysis and approval recommendations
// In a production environment, this would integrate with OpenAI's API or another AI service

/**
 * Analyzes application data and generates an AI summary
 * @param application The loan application data
 * @returns AI-generated summary and recommendations
 */
export function generateAISummary(application: Partial<ApplicationFormData>): {
  summary: string;
  readinessScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  insights: string[];
} {
  // Calculate a mock readiness score based on income and employment
  let readinessScore = 5; // Default middle score
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Medium'; // Default medium risk
  const insights: string[] = [];

  // Income-based scoring (simple placeholder logic)
  if (application.monthlyIncome) {
    if (application.monthlyIncome >= 5000) {
      readinessScore += 3;
      insights.push("High income indicates strong repayment capability.");
      riskLevel = 'Low';
    } else if (application.monthlyIncome >= 3000) {
      readinessScore += 2;
      insights.push("Moderate income suggests adequate repayment capability.");
      riskLevel = 'Medium';
    } else {
      readinessScore -= 1;
      insights.push("Lower income may present repayment challenges.");
      riskLevel = 'High';
    }
  }

  // Employment stability factor
  if (application.employmentLength) {
    if (application.employmentLength === '5+ years') {
      readinessScore += 2;
      insights.push("Long-term employment indicates stability.");
    } else if (application.employmentLength === '3-5 years') {
      readinessScore += 1;
      insights.push("Established employment history.");
    } else if (application.employmentLength === 'Less than 1 year') {
      readinessScore -= 1;
      insights.push("Short employment history may indicate higher risk.");
      if (riskLevel === 'Low') riskLevel = 'Medium';
    }
  }

  // Employment status factor
  if (application.employmentStatus) {
    if (application.employmentStatus === 'Full-time') {
      readinessScore += 1;
      insights.push("Full-time employment provides income stability.");
    } else if (application.employmentStatus === 'Part-time' || application.employmentStatus === 'Self-employed') {
      insights.push("Non-traditional employment may require additional verification.");
      if (riskLevel === 'Low') riskLevel = 'Medium';
    } else if (application.employmentStatus === 'Unemployed') {
      readinessScore -= 3;
      insights.push("Unemployment presents significant repayment risk.");
      riskLevel = 'High';
    }
  }

  // Down payment factor
  if (application.downPayment && application.vehiclePrice) {
    const downPaymentPercentage = (application.downPayment / application.vehiclePrice) * 100;
    if (downPaymentPercentage >= 20) {
      readinessScore += 1;
      insights.push("Substantial down payment reduces financing risk.");
    } else if (downPaymentPercentage < 10) {
      readinessScore -= 1;
      insights.push("Low down payment increases financing risk.");
    }
  }

  // Ensure score is within 1-10 range
  readinessScore = Math.max(1, Math.min(10, readinessScore));

  // Generate summary based on calculated factors
  const summary = `This applicant earns $${application.monthlyIncome?.toLocaleString()}/mo as a ${application.jobTitle} at ${application.employer} with ${application.employmentLength} of employment history. Based on income verification and document analysis, this application has a readiness score of ${readinessScore}/10 with ${riskLevel} risk level.`;

  return {
    summary,
    readinessScore,
    riskLevel,
    insights
  };
}

/**
 * Mock function for document analysis (OCR + GPT)
 * In production, this would use actual OCR and AI to analyze uploaded documents
 * @param documentUrls URLs of the uploaded documents
 * @returns Analysis results
 */
export function analyzeDocuments(payStubUrls: string[], bankStatementUrls: string[], idUrl: string) {
  // This is a placeholder that would normally process the documents with OCR and AI
  return {
    incomeVerified: true,
    identityVerified: true,
    estimatedMonthlyIncome: Math.floor(Math.random() * 3000) + 2000, // Random income between 2000-5000
    averageBankBalance: Math.floor(Math.random() * 10000) + 1000, // Random balance between 1000-11000
    potentialFraudIndicators: [],
    documentQuality: 'Good'
  };
}

/**
 * Mock function for fraud detection
 * In production, this would use AI to detect inconsistencies and fraud patterns
 * @param application The loan application data
 * @returns Fraud detection results
 */
export function detectFraud(application: Partial<ApplicationFormData>) {
  // This is a placeholder that would normally use AI to detect fraud
  return {
    fraudDetected: false,
    confidenceScore: 0.95,
    warningFlags: [],
    recommendations: "Proceed with standard verification procedures."
  };
}
