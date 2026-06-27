import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up body parsers with limits for PDF uploads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Route 1: ATS Resume Scorer
app.post("/api/ats-score", async (req, res) => {
  try {
    const { resumeBase64, resumeType, resumeText, jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ error: "Job Description is required." });
    }

    const contents: any[] = [];
    
    // If we have a base64 resume (like PDF)
    if (resumeBase64) {
      let cleanBase64 = resumeBase64;
      if (cleanBase64.includes(";base64,")) {
        cleanBase64 = cleanBase64.split(";base64,").pop() || "";
      }
      contents.push({
        inlineData: {
          mimeType: resumeType || "application/pdf",
          data: cleanBase64
        }
      });
    } else if (resumeText) {
      contents.push({ text: `Candidate Resume Content:\n${resumeText}` });
    } else {
      return res.status(400).json({ error: "Resume content (PDF upload or text paste) is required." });
    }

    contents.push({
      text: `Analyze this resume against the following Job Description. Compare the core skills, experience, qualifications, and formatting.
      
      Job Description:
      ${jobDescription}
      
      Provide a comprehensive ATS evaluation score, missing keywords (especially technical and soft skills from the Job Description that aren't well-represented), an outstanding ATS-optimized summary, matching skills, and highly specific actionable improvements.`
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: "You are an expert recruitment system and elite ATS algorithm specialized in Indian tech, corporate, and startup hiring (including TCS, Infosys, Wipro, Reliance, and top startups). Deliver high-quality, professional, objective feedback.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "Overall ATS matching score from 0 to 100 based on compatibility."
            },
            missingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Core terms, skills, or tools missing or weak in the resume compared to the Job Description."
            },
            rewrittenSummary: {
              type: Type.STRING,
              description: "An elite, professional 3-4 line resume summary tailored to the job description, emphasizing matching experience and natural keywords."
            },
            matchingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key strengths and technologies present in both the resume and the Job Description."
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable, precise tips (e.g., formatting, project framing, metrics) to make the resume stand out."
            }
          },
          required: ["score", "missingKeywords", "rewrittenSummary", "matchingSkills", "suggestions"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text returned from Gemini API");
    }

    const resultJson = JSON.parse(resultText);
    res.json(resultJson);
  } catch (error: any) {
    console.error("Error in ATS Resume Scorer:", error);
    res.status(500).json({ error: error.message || "Failed to analyze resume." });
  }
});

// Route 2: Generate Initial Mock Interview Question
app.post("/api/mock-interview/start", async (req, res) => {
  try {
    const { company, role } = req.body;
    if (!company || !role) {
      return res.status(400).json({ error: "Company and Role are required." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are an HR interviewer from ${company} conducting an interview for a ${role} position.
      Introduce yourself briefly, welcome the candidate warmly, and ask exactly ONE relevant opening interview question. Do not ask multiple questions. Keep it realistic for a college graduate in India.`,
      config: {
        systemInstruction: `You are a professional HR manager at ${company}. Keep your tone professional, realistic, and welcoming. Ask exactly one question.`
      }
    });

    res.json({ question: response.text });
  } catch (error: any) {
    console.error("Error starting mock interview:", error);
    res.status(500).json({ error: error.message || "Failed to start interview." });
  }
});

// Route 3: Evaluate Answer & Give Next Question
app.post("/api/mock-interview/feedback", async (req, res) => {
  try {
    const { company, role, question, answer, questionNumber } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: "Question and Answer are required." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Context: Mock Interview for ${role} at ${company}.
      This was question number ${questionNumber || 1}.
      
      Interviewer's Question: "${question}"
      Candidate's Answer: "${answer}"
      
      Analyze the candidate's answer. Give a score from 1-10, constructive critique, an exemplary improved answer that is impressive yet natural, and the next appropriate interview question. If this is question 5, state that the interview is complete in the critique, and write "Thank you, that concludes our mock interview. Great job practicing!" in nextQuestion.`,
      config: {
        systemInstruction: `You are a senior hiring manager at ${company}. Evaluate the candidate's response with professional depth. Give tips suitable for Indian graduates entering the workforce.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "A score from 1 to 10 evaluating the quality, accuracy, and delivery of the answer."
            },
            critique: {
              type: Type.STRING,
              description: "Constructive feedback. Point out positive aspects and concrete areas for improvement."
            },
            improvedAnswer: {
              type: Type.STRING,
              description: "A model answer demonstrating how to address the question with maximum positive impact."
            },
            nextQuestion: {
              type: Type.STRING,
              description: "The next interview question to keep the flow going, or a concluding message if the interview has reached 5 questions."
            }
          },
          required: ["score", "critique", "improvedAnswer", "nextQuestion"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No feedback text returned from Gemini API");
    }

    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error in Mock Interview Feedback:", error);
    res.status(500).json({ error: error.message || "Failed to process interview feedback." });
  }
});

// Route 4: Indian Government Scheme Finder
app.post("/api/scheme-finder", async (req, res) => {
  try {
    const { age, state, education } = req.body;
    if (!age || !state || !education) {
      return res.status(400).json({ error: "Age, State, and Education are required." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Find 3 to 5 highly relevant active Indian Central or State government schemes for professional development, skills training, apprentice placement, self-employment loans, or digital employment cards.
      
      Candidate Profile:
      - Age: ${age} years
      - State of Residence: ${state}
      - Highest Education Level: ${education}
      
      Provide real schemes like PMKVY (Pradhan Mantri Kaushal Vikas Yojana), NAPS (National Apprenticeship Promotion Scheme), state-specific portals, or self-employment schemes like PMEGP if applicable. Do not make up schemes.`,
      config: {
        systemInstruction: "You are a career guidance expert on Indian Government welfare, apprenticeship, and skill-development initiatives. Filter carefully based on age and education level eligibility. Keep descriptions highly encouraging and practical.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            schemes: {
              type: Type.ARRAY,
              description: "List of eligible government schemes",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "Official name of the scheme (e.g. National Apprenticeship Promotion Scheme (NAPS))"
                  },
                  description: {
                    type: Type.STRING,
                    description: "Clear, simple overview of the scheme's core objective."
                  },
                  benefits: {
                    type: Type.STRING,
                    description: "Specific benefits, e.g., monthly stipend, free certification, 100% government sponsorship, etc."
                  },
                  eligibility: {
                    type: Type.STRING,
                    description: "Specific age and educational eligibility requirements that match this user."
                  },
                  applyUrl: {
                    type: Type.STRING,
                    description: "The primary official website URL or details on where to register."
                  },
                  category: {
                    type: Type.STRING,
                    description: "Category of scheme: 'Apprenticeship', 'Skill Development', 'Self-employment / Loan', or 'State-Specific Portal'"
                  }
                },
                required: ["name", "description", "benefits", "eligibility", "applyUrl", "category"]
              }
            }
          },
          required: ["schemes"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text returned from Gemini API");
    }

    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error in Scheme Finder:", error);
    res.status(500).json({ error: error.message || "Failed to find government schemes." });
  }
});

// Vite Middleware for development & Static routing for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
