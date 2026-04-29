import { FieldData, Question } from '../types';

// Helper to shuffle array but keep scores mapped
const shuffleOptions = (options: { text: string; score: number }[]) => {
  return [...options].sort(() => Math.random() - 0.5);
};

// Helper to generate a standardized set of questions for a field
const generateQuestions = (field: string, specificContext: string[]): Question[] => [
  {
    id: `${field}-1`,
    category: 'AI Awareness',
    question: `How would you describe your understanding of how GenAI actually works in ${field}?`,
    options: shuffleOptions([
      { text: "I treat it like a search engine or magic box.", score: 0 },
      { text: "I understand it predicts the next token but don't know the limitations well.", score: 2 },
      { text: "I understand context windows, tokens, and why hallucinations happen in my field.", score: 4 },
      { text: "I deeply understand model architectures, fine-tuning potential, and RAG concepts for my work.", score: 6 }
    ])
  },
  {
    id: `${field}-2`,
    category: 'Prompting Skill',
    question: "When interacting with an AI, how much effort do you put into the initial prompt?",
    options: shuffleOptions([
      { text: "Simple 1-sentence requests like 'Do this for me'.", score: 0 },
      { text: "I provide basic context but usually have to iterate many times.", score: 2 },
      { text: "I use personas, clear formats, and explicit constraints in my primary prompts.", score: 4 },
      { text: "I use multi-shot prompting, chain-of-thought instructions, and variable-based templates.", score: 6 }
    ])
  },
  {
    id: `${field}-3`,
    category: 'Workflow Integration',
    question: `How integrated is AI into your daily ${field} tasks?`,
    options: shuffleOptions([
      { text: "I don't use it, or only for non-work personal tasks.", score: 0 },
      { text: "I use it once or twice a week for brainstorming or email drafting.", score: 2 },
      { text: "I use it daily for 20-30% of my core tasks as a standard part of my work.", score: 4 },
      { text: "It's my primary workspace; I 'collaborate' with AI on almost every complex project.", score: 6 }
    ])
  },
  {
    id: `${field}-4`,
    category: 'Tool Usage',
    question: `Which best describes your ${field} AI tool stack?`,
    options: shuffleOptions([
      { text: "I just use the free version of ChatGPT or Gemini.", score: 0 },
      { text: "I have one paid subscription to a general model.", score: 2 },
      { text: "I use a mix of general LLMs and 1-2 specialized tools for my profession.", score: 4 },
      { text: "I use an integrated ecosystem of general models, specialized agents, and API-based tools.", score: 6 }
    ])
  },
  {
    id: `${field}-5`,
    category: 'Automation',
    question: "Have you bridged AI with other software tools to automate tasks?",
    options: shuffleOptions([
      { text: "No, I only copy-paste results manually.", score: 0 },
      { text: "I've tried using basic integrations (like custom GPTs or plugins).", score: 2 },
      { text: "I use tools like Zapier, Make, or built-in AI automations in my CRM/IDE/editor.", score: 4 },
      { text: "I build custom scripts or complex multi-step agents that handle data flow between apps.", score: 6 }
    ])
  },
  {
    id: `${field}-6`,
    category: 'Data/Privacy Awareness',
    question: "How do you handle sensitive data when using AI tools?",
    options: shuffleOptions([
      { text: "I don't really think about it; I put everything in.", score: 0 },
      { text: "I try to remove names, but don't have a strict protocol.", score: 2 },
      { text: "I only use tools with Enterprise-grade privacy or local models for sensitive work.", score: 4 },
      { text: "I follow a strict organizational policy and understand exactly how my data is used for training.", score: 6 }
    ])
  },
  {
    id: `${field}-7`,
    category: 'Quality Control',
    question: "How do you handle the 'hallucinations' or inaccuracies in AI output?",
    options: shuffleOptions([
      { text: "I assume it's mostly correct if it looks professional.", score: 0 },
      { text: "I skim it for obvious errors before using it.", score: 2 },
      { text: "I perform factual cross-checks against trusted external sources.", score: 4 },
      { text: "I treat it as a draft that requires structural audit, fact-checking, and human 'soul' infusion.", score: 6 }
    ])
  },
  {
    id: `${field}-8`,
    category: 'Field-Specific',
    question: specificContext[0],
    options: shuffleOptions([
      { text: specificContext[1], score: 0 },
      { text: specificContext[2], score: 2 },
      { text: specificContext[3], score: 4 },
      { text: specificContext[4], score: 6 }
    ])
  },
  {
    id: `${field}-9`,
    category: 'Evaluation',
    question: "How do you decide *not* to use AI for a task?",
    options: shuffleOptions([
      { text: "I try to use it for everything or nothing.", score: 0 },
      { text: "I intuitively feel when it's faster to do it myself.", score: 2 },
      { text: "I evaluate tasks based on complexity, accuracy requirements, and privacy risk.", score: 4 },
      { text: "I have a mental framework for 'Human-in-the-loop' vs 'AI-First' vs 'Human-Only' tasks.", score: 6 }
    ])
  },
  {
    id: `${field}-10`,
    category: 'Tool Combination',
    question: "How often do you 'chain' different AI models to get a result?",
    options: shuffleOptions([
      { text: "Never, I stick to one chat window.", score: 0 },
      { text: "I occasionally check a result in a second model (e.g., Claude then GPT).", score: 2 },
      { text: "I use specific models for specific strengths (e.g., GPT for data, Claude for writing).", score: 4 },
      { text: "I use multi-model pipelines where one model's output feeds another's prompt.", score: 6 }
    ])
  },
  {
    id: `${field}-11`,
    category: 'Field-Specific',
    question: specificContext[5],
    options: shuffleOptions([
      { text: specificContext[6], score: 0 },
      { text: specificContext[7], score: 2 },
      { text: specificContext[8], score: 4 },
      { text: specificContext[9], score: 6 }
    ])
  },
  {
    id: `${field}-12`,
    category: 'Prompting Skill',
    question: "How do you handle AI output that isn't quite right?",
    options: shuffleOptions([
      { text: "I give up and do it myself.", score: 0 },
      { text: "I hit the 'Regenerate' button and hope it's better.", score: 2 },
      { text: "I provide specific feedback on what to change or correct.", score: 4 },
      { text: "I debug the prompt, provide examples of the fix, and refine the context.", score: 6 }
    ])
  },
  {
    id: `${field}-13`,
    category: 'Learning Capacity',
    question: "How do you keep up with the rapid pace of AI releases and new techniques?",
    options: shuffleOptions([
      { text: "I don't; I just use what's popular when I hear about it.", score: 0 },
      { text: "I occasionally watch social media or news for updates.", score: 2 },
      { text: "I follow specific newsletters or experts and test new models monthly.", score: 4 },
      { text: "I am part of AI communities, read technical papers, and benchmark new tools weekly.", score: 6 }
    ])
  },
  {
    id: `${field}-14`,
    category: 'Collaboration',
    question: "How do you share AI-driven insights or prompts with your team?",
    options: shuffleOptions([
      { text: "I don't share; my AI usage is mostly solo.", score: 0 },
      { text: "I send a prompt or result over chat if someone asks.", score: 2 },
      { text: "We have an informal document or shared thread for successful prompts.", score: 4 },
      { text: "We use shared prompt libraries, team workspaces, and run training sessions for others.", score: 6 }
    ])
  },
  {
    id: `${field}-15`,
    category: 'Field-Specific',
    question: "How do you foresee AI impacting your long-term career path?",
    options: shuffleOptions([
      { text: "I'm worried it might replace my role entirely.", score: 0 },
      { text: "I'm ignoring it and hoping things stay the same.", score: 1 },
      { text: "I'm using it to stay relevant and competitive.", score: 4 },
      { text: "I'm actively steering my career to lead AI-enabled divisions or projects.", score: 6 }
    ])
  }
];

export const questionBank: Record<string, FieldData> = {
  "Software Engineering": {
    name: "Software Engineering",
    description: "Assess how effectively you use AI across coding, debugging, testing, documentation, and architecture.",
    icon: "Code",
    recommendedTools: [
      { name: "Cursor", category: "IDE", description: "AI-native code editor with deep project context." },
      { name: "GitHub Copilot", category: "Autocomplete", description: "Standard-setting companion for fast implementation." },
      { name: "Claude Code", category: "CLI Agent", description: "A command-line agent for complex refactoring." },
      { name: "ChatGPT (o1)", category: "Reasoning", description: "Great for complex architecture and logic puzzles." },
      { name: "Replit AI", category: "Cloud Development", description: "End-to-end AI deployment and coding." },
      { name: "Sourcegraph Cody", category: "Search & Context", description: "Understands your entire codebase's patterns." }
    ],
    questions: generateQuestions("Software Engineering", [
      "How do you validate AI-generated code snippets?",
      "I usually trust it if it looks logically sound.",
      "I manually read through the code to spot errors.",
      "I run the code and check if it breaks my current tests.",
      "I review, write new tests for it, check edge cases, and run security scans.",
      "What percentage of your production code is assisted by AI?",
      "0%",
      "Less than 10%",
      "10-40%",
      "Over 40% (all thoroughly reviewed and tested)"
    ])
  },
  "Product Management": {
    name: "Product Management",
    description: "Measure your maturity in AI-driven PRDs, user research, roadmap prioritization, and data synthesis.",
    icon: "Layout",
    recommendedTools: [
      { name: "Claude 3.5 Sonnet", category: "Writing & Strategy", description: "Best-in-class for PRDs and strategic drafting." },
      { name: "LogRocket AI", category: "User Insights", description: "Summarize user sessions and identify friction." },
      { name: "Productboard", category: "Roadmapping", description: "AI-assisted feedback categorization." },
      { name: "Perplexity", category: "Market Research", description: "Real-time search for competitive analysis." },
      { name: "Otter.ai", category: "Meeting Intelligence", description: "Transcribe and extract action items from user calls." }
    ],
    questions: generateQuestions("Product Management", [
      "How do you use AI for user feedback analysis?",
      "I don't, I read it all manually.",
      "I use it to summarize long individual interviews.",
      "I feed it hundreds of feedback items to find top themes.",
      "I use it to synthesize themes, create personas, and draft initial feature requirements.",
      "How do you use AI in PRD (Product Requirement Document) writing?",
      "I write them from scratch.",
      "I use AI to fix grammar and spelling after I'm done.",
      "I use AI to brainstorm 'edge cases' I might have missed.",
      "I use it to draft the structure, personas, and success metrics, then I refine the strategy."
    ])
  },
  "Marketing": {
    name: "Marketing",
    description: "Evaluate your skills in AI content strategy, ad creative, SEO, and audience segmentation.",
    icon: "Megaphone",
    recommendedTools: [
      { name: "Jasper", category: "Content", description: "Enterprise-grade copywriting and brand voice." },
      { name: "Canva AI", category: "Creative", description: "Magic design and image generation tools." },
      { name: "HubSpot AI", category: "CRM/Automation", description: "AI-powered email and campaign management." },
      { name: "Copy.ai", category: "Copywriting", description: "Fast marketing copy for various formats." },
      { name: "Google Gemini", category: "Ad Optimization", description: "Deep integration with Google Ads ecosystem." }
    ],
    questions: generateQuestions("Marketing", [
      "How do you ensure AI-generated content maintains your brand voice?",
      "I don't, it's 'close enough'.",
      "I manually edit the AI output to sound more like us.",
      "I provide a clear brand style guide in the prompt.",
      "I use fine-tuned brand voice models or multi-step feedback loops for consistency.",
      "How do you use AI for audience research?",
      "I use Google Search only.",
      "I ask AI generic questions about 'who buys X'.",
      "I give AI my customer data (anonymized) to find patterns.",
      "I use specialized tools to map customer journeys and simulate buyer personas."
    ])
  },
  "Sales": {
    name: "Sales",
    description: "Check your readiness in AI lead research, personalized outreach, and deal intelligence.",
    icon: "Target",
    recommendedTools: [
      { name: "Clay", category: "Lead Gen", description: "Automated outbound workflows and data enrichment." },
      { name: "Gong", category: "Deal Intel", description: "AI analysis of sales calls to identify closing signals." },
      { name: "Apollo", category: "Prospecting", description: "AI-driven database and outreach sequencing." },
      { name: "Salesforce Einstein", category: "CRM", description: "Predictive lead scoring and opportunity insights." },
      { name: "Regie.ai", category: "Personalization", description: "Personalizes outreach at scale." }
    ],
    questions: generateQuestions("Sales", [
      "How do you personalize cold outreach using AI?",
      "I use the same template for everyone.",
      "I use AI to write one generic 'catchy' line.",
      "I use AI to find one recent detail about a prospect manually.",
      "I use tools that pull live LinkedIn/news data to write custom snippets at scale.",
      "How do you use AI to prepare for sales calls?",
      "I just wing it.",
      "I briefly search for the company on Google.",
      "I ask AI to summarize the company's recent earnings or news.",
      "I use AI to predict objections and generate specific talk tracks based on historical deal data."
    ])
  },
  "Customer Support": {
    name: "Customer Support",
    description: "Assess AI use in ticket automation, sentiment analysis, and knowledge base management.",
    icon: "Headset",
    recommendedTools: [
      { name: "Intercom Fin", category: "Chatbot", description: "AI agent that resolves tickets from your help center." },
      { name: "Zendesk AI", category: "Helpdesk", description: "Automated triage and reply suggestions." },
      { name: "LangSmith", category: "Quality", description: "Monitor and test AI support bot performance." },
      { name: "Yuma AI", category: "E-commerce", description: "Ticket drafting for Shopify stores." }
    ],
    questions: generateQuestions("Customer Support", [
      "How do you use AI to handle ticket volume?",
      "I handle every single ticket manually.",
      "I use AI to suggest 'canned responses'.",
      "I use an AI bot to handle basic FAQs like 'Where is my order?'.",
      "I use an autonomous AI agent integrated with our backend for transactional resolution."
    ])
  },
  "Human Resources": {
    name: "Human Resources",
    description: "Evaluate your efficiency in AI screening, JD optimization, and employee engagement.",
    icon: "Users",
    recommendedTools: [
      { name: "HiredScore", category: "Recruitment", description: "AI orchestration for talent acquisition." },
      { name: "Eightfold.ai", category: "Talent Management", description: "Matches candidates and employees to roles." },
      { name: "ChatGPT", category: "Workflow", description: "Drafting JDs and interview questions." },
      { name: "Glint", category: "Engagement", description: "AI analysis of employee sentiment surveys." }
    ],
    questions: generateQuestions("Human Resources", [
      "How do you use AI in the hiring process?",
      "I don't, I read every resume manually.",
      "I use AI to help me write Job Descriptions faster.",
      "I use AI to generate technical interview questions for specific roles.",
      "I use AI to screen resumes for skills (not names) and match internal talent to new roles."
    ])
  },
  "Finance and Accounting": {
    name: "Finance and Accounting",
    description: "Measure AI maturity in reporting, forensic accounting, and predictive modeling.",
    icon: "BarChart",
    recommendedTools: [
      { name: "Vic.ai", category: "Accounting", description: "Real-time AI for accounts payable.", disclaimer: "Check all financial outputs strictly." },
      { name: "Ramp", category: "Spend Mgmt", description: "AI for expense auditing and policy enforcement." },
      { name: "Datarails", category: "FP&A", description: "AI-enhanced financial planning in Excel." },
      { name: "Microsoft Copilot", category: "Spreadsheets", description: "Analyze trends and generate formulas." }
    ],
    questions: generateQuestions("Finance and Accounting", [
      "How do you use AI for financial forecasting?",
      "I rely on manual historical entry.",
      "I use basic Excel trendlines.",
      "I use AI to identify variances between budget and actuals.",
      "I use predictive models that combine internal data with external market signals."
    ])
  },
  "Legal": {
    name: "Legal",
    description: "Assess AI use in contract discovery, clause analysis, and legal research support.",
    icon: "Scale",
    recommendedTools: [
      { name: "Harvey", category: "Professional Services", description: "AI for elite global law firms.", disclaimer: "Verify every case citation; avoid 'hallucinated' cases." },
      { name: "Spellbook", category: "Contracting", description: "AI that lives inside Microsoft Word for lawyers." },
      { name: "CoCounsel", category: "Research", description: "Comprehensive legal AI assistant by Casetext." },
      { name: "Everlaw", category: "E-Discovery", description: "AI for searching massive document sets in litigation." }
    ],
    questions: generateQuestions("Legal", [
      "How do you handle AI 'hallucinations' in legal research?",
      "I haven't encountered them yet.",
      "I skim the cases to see if they sound real.",
      "I always click through to the primary legal source to verify existence.",
      "I use specialized legal-only models with 'Verified Citation' grounding features."
    ])
  },
  "Healthcare": {
    name: "Healthcare",
    description: "Measure efficiency in medical documentation, research parsing, and patient comms.",
    icon: "Stethoscope",
    recommendedTools: [
      { name: "Nuance DAX", category: "Scribe", description: "Automated clinical documentation for physicians.", disclaimer: "Ensure HIPAA compliance and never use AI for primary diagnosis." },
      { name: "Nabla Copilot", category: "Documentation", description: "Digital scribe for medical encounters." },
      { name: "Abridge", category: "Transcription", description: "Summarizes medical conversations for patients and providers." },
      { name: "Glass Health", category: "Clinical Reason", description: "AI-powered clinical guidelines and diagnostics support." }
    ],
    questions: generateQuestions("Healthcare", [
      "How do you use AI for clinical documentation?",
      "I type everything manually after hours.",
      "I use generic speech-to-text tools.",
      "I use an AI scribe to draft notes that I then edit.",
      "I use a HIPAA-compliant medical scribe that integrates directly into the EMR."
    ])
  },
  "Education and Training": {
    name: "Education and Training",
    description: "Evaluate AI use in lesson planning, personalization, and assessment design.",
    icon: "GraduationCap",
    recommendedTools: [
      { name: "Khanmigo", category: "Tutoring", description: "AI tutor built into the Khan Academy platform." },
      { name: "MagicSchool AI", category: "Teacher Assistant", description: "Plan lessons and generate IEPs in seconds." },
      { name: "Quizizz AI", category: "Assessment", description: "Turn any text/PDF into an interactive quiz." },
      { name: "NotebookLM", category: "Research", description: "AI notebook for organizing and learning from source material." }
    ],
    questions: generateQuestions("Education and Training", [
      "How do you handle AI and academic integrity?",
      "I just ban AI entirely.",
      "I use detection tools (though I know they aren't perfect).",
      "I teach students how to cite AI and use it as a brainstorming partner.",
      "I design 'AI-resistant' assignments that focus on process, reflection, and live debate."
    ])
  },
  "Content Creation": {
    name: "Content Creation",
    description: "Evaluate your skills in AI-assisted scripting, editing, and multiformat repurposing.",
    icon: "PenTool",
    recommendedTools: [
      { name: "Descript", category: "Video/Audio", description: "Edit audio and video by editing the text transcript." },
      { name: "Midjourney", category: "Visuals", description: "State-of-the-art image generation for art and design." },
      { name: "ElevenLabs", category: "Voice", description: "High-quality AI voice synthesis and cloning." },
      { name: "HeyGen", category: "Video Gen", description: "Create AI avatars that speak your script." }
    ],
    questions: generateQuestions("Content Creation", [
      "How do you use AI for content repurposing?",
      "I don't, I do it manually for each platform.",
      "I use AI to turn a long blog into a short tweet.",
      "I use AI to turn a podcast transcript into multiple blog posts and scripts.",
      "I have an AI pipeline that takes one video and maps out 10+ assets for every social channel."
    ])
  },
  "Design and Creative": {
    name: "Design and Creative",
    description: "Check your readiness in AI moodboarding, prototyping, and asset iteration.",
    icon: "Palette",
    recommendedTools: [
      { name: "Figma AI", category: "UI/UX", description: "AI tools for faster prototyping inside Figma." },
      { name: "Adobe Firefly", category: "Generative", description: "Ethically trained AI image generation in Photoshop." },
      { name: "Spline AI", category: "3D Design", description: "Generate and edit 3D scenes using text." },
      { name: "Uizard", category: "Prototyping", description: "Turn sketches into full UI designs automatically." }
    ],
    questions: generateQuestions("Design and Creative", [
      "How do you integrate AI into your design process?",
      "I avoid it; it feels like cheating.",
      "I use it for placeholder images and text (lorem ipsum).",
      "I use AI for moodboards and brainstorming visual directions.",
      "I use AI to generate base assets and prototypes, which I then refine for final production."
    ])
  },
  "Business Operations": {
    name: "Business Operations",
    description: "Measure AI maturity in process automation, resource planning, and logistics.",
    icon: "Activity",
    recommendedTools: [
      { name: "Zapier Central", category: "Automation", description: "Build AI agents that interact with your apps." },
      { name: "Notion AI", category: "Knowledge Mgmt", description: "Summarize and organize company wikis." },
      { name: "Glean", category: "Enterprise Search", description: "AI that searches across all your company's data and apps." },
      { name: "Coda AI", category: "Workflow", description: "Smart docs that automate project tracking." }
    ],
    questions: generateQuestions("Business Operations", [
      "How do you use AI to improve internal processes?",
      "I don't think AI applies to our SOPs.",
      "I use AI to summarize our meeting notes.",
      "I use AI to audit our SOP documents for clarity and gaps.",
      "I've built automated 'agents' that handle routine approvals or data routing."
    ])
  },
  "Data Analysis": {
    name: "Data Analysis",
    description: "Evaluate your skills in AI-driven ETL, visualization, and insight generation.",
    icon: "Database",
    recommendedTools: [
      { name: "ChatGPT Advanced Data Analysis", category: "Analysis", description: "Upload files and get python-based insights." },
      { name: "Tableau Pulse", category: "Visualization", description: "AI-driven insights for automated data storytelling." },
      { name: "Hex AI", category: "Notebooks", description: "Collaborative data science with AI building blocks." },
      { name: "Julius AI", category: "Analytics", description: "Specialized AI for statistical analysis and graphing." }
    ],
    questions: generateQuestions("Data Analysis", [
      "How do you use AI in your data workflow?",
      "I write every SQL query and Python script from scratch.",
      "I use AI to fix syntax errors in my code.",
      "I use AI to write complex queries and clean small datasets.",
      "I use AI for EDA (Exploratory Data Analysis) and to generate predictive models directly."
    ])
  },
  "Entrepreneurship and Small Business": {
    name: "Entrepreneurship and Small Business",
    description: "Assess how you leverage AI to wear multiple hats and scale your business.",
    icon: "Rocket",
    recommendedTools: [
      { name: "Claude 3.5 Sonnet", category: "Strategy", description: "Best 'digital co-founder' for strategy and drafting." },
      { name: "Gamma", category: "Pitching", description: "Create decks and landing pages in minutes." },
      { name: "Fathom", category: "Operations", description: "AI note-taker for sales and team calls." },
      { name: "Perplexity", category: "Business Intel", description: "Search for vendors, competitors, and trends." }
    ],
    questions: generateQuestions("Entrepreneurship", [
      "How has AI changed your 'bandwidth' as a founder?",
      "It hasn't, I'm still doing everything manually.",
      "I use it to speed up my emails.",
      "I use AI to handle one full role (e.g., Marketing or SEO).",
      "AI is my 'multiplier'; I manage systems of AI tools instead of doing tasks."
    ])
  },
  "Real Estate": {
    name: "Real Estate",
    description: "Measure efficiency in listing creation, market analysis, and lead management.",
    icon: "Home",
    recommendedTools: [
      { name: "Axiom", category: "Data Scraping", description: "Automate lead data collection without code." },
      { name: "Styldod", category: "Visuals", description: "AI virtual staging for property photos." },
      { name: "Restb.ai", category: "Visual Insights", description: "Automated property characterization from photos." },
      { name: "ChatGPT", category: "Listing Copy", description: "Creating compelling property descriptions." }
    ],
    questions: generateQuestions("Real Estate", [
      "How do you use AI for property listings?",
      "I write the descriptions myself based on templates.",
      "I use AI to fix the spelling in my descriptions.",
      "I use AI to write creative, SEO-optimized descriptions for every listing.",
      "I use AI for listing copy, virtual staging, and market trend analysis per neighborhood."
    ])
  },
  "Consulting": {
    name: "Consulting",
    description: "Evaluate your skills in AI-driven synthesis, framework design, and deck creation.",
    icon: "Briefcase",
    recommendedTools: [
      { name: "HeyGen", category: "Comms", description: "AI video for client updates." },
      { name: "Beautiful.ai", category: "Presentations", description: "AI-powered slide deck design." },
      { name: "Claude", category: "Synthesis", description: "Reading massive expert interview transcripts." },
      { name: "Perplexity", category: "Research", description: "Speed up industry due diligence." }
    ],
    questions: generateQuestions("Consulting", [
      "How do you use AI in client projects?",
      "I don't tell clients about AI; I don't use it.",
      "I use it to format my final reports.",
      "I use it to brainstorm frameworks (e.g., MECE) for my analysis.",
      "I use AI to synthesize massive amounts of client data and industry trends to find unique insights."
    ])
  },
  "Project Management": {
    name: "Project Management",
    description: "Check your readiness in AI risk assessment, resource allocation, and reporting.",
    icon: "Calendar",
    recommendedTools: [
      { name: "Monday.com AI", category: "Management", description: "Automate tasks and generate workflows." },
      { name: "Asana AI", category: "Reporting", description: "Get status updates and identify bottlenecks." },
      { name: "ClickUp AI", category: "Write/Tasks", description: "Summarize threads and generate action items." },
      { name: "Motion", category: "Scheduling", description: "AI that builds your daily schedule based on priorities." }
    ],
    questions: generateQuestions("Project Management", [
      "How do you use AI to track project health?",
      "I check every task status manually.",
      "I use basic dashboards built in Excel/Sheets.",
      "I use AI within my PM tool to summarize late tasks.",
      "I use AI to predict resource bottlenecks and suggest timeline adjustments."
    ])
  },
  "Research and Academia": {
    name: "Research and Academia",
    description: "Measure AI maturity in literature reviews, data processing, and hypothesis testing.",
    icon: "Search",
    recommendedTools: [
      { name: "Elicit", category: "Literature", description: "AI research assistant that finds relevant papers.", disclaimer: "Verify all academic conclusions with original peer-reviewed texts." },
      { name: "Consensus", category: "Search", description: "Find what the research says about any question." },
      { name: "Scite", category: "Validation", description: "See if papers have been supported or contrasted." },
      { name: "Zotero with AI", category: "Management", description: "Automated bib and summary generation." }
    ],
    questions: generateQuestions("Research", [
      "How do you use AI for literature reviews?",
      "I search Google Scholar and read every paper manually.",
      "I use AI to summarize a single paper for me.",
      "I use AI tools that search across thousands of papers and find consensus.",
      "I use AI to map research gaps and suggest new hypotheses based on existing literature."
    ])
  },
  "General Professional / Other": {
    name: "General Professional",
    description: "Assess your fundamental AI literacy applicable to any modern workplace.",
    icon: "Compass",
    recommendedTools: [
      { name: "ChatGPT (Plus)", category: "General", description: "The most versatile starting point for any task." },
      { name: "Claude (Pro)", category: "Writing/Reasoning", description: "Superior for nuanced writing and large documents." },
      { name: "Microsoft Copilot", category: "Workforce", description: "Included in many enterprise setups." },
      { name: "Perplexity", category: "Search", description: "Fast, accurate web-grounded research." },
      { name: "Grammarly AI", category: "Editing", description: "AI that helps you write clearly everywhere." }
    ],
    questions: generateQuestions("General Professional", [
      "How has AI changed your general productivity?",
      "It hasn't really changed anything.",
      "I use it for 1-2 small habits (like fixing emails).",
      "I use it for a few core workflows every week.",
      "I have 'AI-fied' all my repetitive admin, research, and writing tasks."
    ])
  }
};
