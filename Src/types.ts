export interface ATSResponse {
  score: number;
  missingKeywords: string[];
  rewrittenSummary: string;
  matchingSkills: string[];
  suggestions: string[];
}

export interface InterviewFeedbackResponse {
  score: number;
  critique: string;
  improvedAnswer: string;
  nextQuestion: string;
}

export interface Scheme {
  name: string;
  description: string;
  benefits: string;
  eligibility: string;
  applyUrl: string;
  category: string;
}

export interface SchemeResponse {
  schemes: Scheme[];
}
