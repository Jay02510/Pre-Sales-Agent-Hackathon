# Glance - AI Sales Intelligence

## 🚀 Elevator Pitch

Glance is an AI-powered sales intelligence platform that transforms meeting preparation by generating comprehensive research reports in seconds. By simply entering a company name and a few URLs, sales professionals can instantly access detailed insights, pain points, and conversation starters to make every sales interaction more effective.

## 💡 Inspiration

As former sales professionals, we've experienced the pain of spending hours researching prospects before meetings, only to still miss critical insights. We built Glance to solve this problem by automating the research process and surfacing the most valuable information for sales conversations.

The average sales rep spends 5-10 hours per week on pre-sales research. Glance reduces this to minutes, giving reps back valuable time to focus on what they do best: building relationships and closing deals.

## 🛠️ What it does

Glance transforms the sales preparation process:

1. **Instant Research**: Enter a company name and relevant URLs (company website, LinkedIn, news articles)
2. **Real-time Analysis**: Our AI analyzes the content and generates a comprehensive report
3. **Actionable Insights**: Get company information, pain points, key insights, and conversation starters
4. **CRM Integration**: Export the report to your CRM with one click

The platform is designed to work for sales professionals at any level, from SDRs to enterprise account executives, across any industry.

## 🔧 How we built it

We built Glance using a modern tech stack:

- **Frontend**: React with TypeScript for type safety and Tailwind CSS for responsive design
- **AI Analysis**: OpenAI's GPT-4o-mini for cost-effective, high-quality insights
- **Web Scraping**: Firecrawl API for extracting content from websites
- **Database**: Supabase (PostgreSQL) for storing reports and user data
- **Authentication**: Supabase Auth for secure user management
- **Deployment**: Vercel for seamless deployment and scaling

We implemented several key optimizations:

- **Cost Optimization**: Smart URL filtering, content deduplication, and caching
- **Progressive Enhancement**: Works in demo mode without API keys
- **Modular Architecture**: Clean separation of services for maintainability
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🏆 Challenges we ran into

1. **Web Scraping Limitations**: Many websites block scraping, so we implemented fallback mechanisms and clear user guidance on supported URL types.

2. **AI Cost Management**: To keep the service affordable, we developed sophisticated content optimization techniques that reduce token usage while preserving insight quality.

3. **Real-time Feedback**: We needed to show progress during the analysis process, so we implemented a detailed loading state with real-time updates.

4. **CRM Integration**: Different CRMs have different data formats, so we built a universal export system that works with multiple platforms.

## ✅ Accomplishments that we're proud of

1. **Intelligent Fallbacks**: The app works even without API keys, using enhanced mock data that still provides value.

2. **Cost Efficiency**: Our optimization algorithms reduce API costs by up to 70% compared to naive implementations.

3. **User Experience**: The intuitive interface makes it easy for anyone to generate valuable sales insights without training.

4. **Feedback System**: We implemented a comprehensive feedback mechanism that helps improve the AI over time.

## 📚 What we learned

1. **AI Prompt Engineering**: Crafting effective prompts for sales intelligence requires balancing specificity with flexibility.

2. **Content Extraction**: Different website structures require different scraping approaches.

3. **Cost Optimization**: Managing API costs at scale requires sophisticated caching and batching strategies.

4. **User Feedback**: Sales professionals value specific, actionable insights over general information.

## 🔮 What's next for Glance

1. **Advanced Integrations**: Direct integration with major CRMs (Salesforce, HubSpot) via their APIs.

2. **Team Collaboration**: Shared workspaces for sales teams to collaborate on prospect research.

3. **Competitive Intelligence**: Expanded analysis to include competitor comparisons and market positioning.

4. **Meeting Summaries**: Post-meeting analysis and follow-up recommendations based on conversation notes.

5. **Mobile App**: Native mobile experience for on-the-go research before meetings.

## 🔗 Try it out

- **Live Demo**: [https://glance-ai.vercel.app](https://glance-ai.vercel.app)
- **GitHub Repository**: [https://github.com/your-username/glance](https://github.com/your-username/glance)