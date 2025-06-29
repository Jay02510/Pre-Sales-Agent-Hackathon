# Glance - AI Sales Intelligence

<div align="center">
  <img src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Glance - Sales team using AI" width="600" />
</div>

## 🚀 Overview

Glance is an AI-powered sales intelligence platform that transforms meeting preparation by generating comprehensive research reports in seconds. By simply entering a company name and a few URLs, sales professionals can instantly access detailed insights, pain points, and conversation starters to make every sales interaction more effective.

## ✨ Key Features

- **Real-time Web Scraping**: Extracts actual content from company websites, LinkedIn profiles, and news articles
- **AI-Powered Analysis**: Generates detailed insights using OpenAI's GPT-4o-mini
- **Conversation Starters**: Provides tailored questions based on company-specific research
- **Pain Point Identification**: Highlights business challenges that your solution can address
- **CRM Export**: One-click export to Salesforce, HubSpot, Pipedrive, and more
- **Smart Configuration**: Works in demo mode when APIs aren't configured

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI**: OpenAI GPT-4o-mini
- **Web Scraping**: Firecrawl API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## 📊 Impact for Sales Teams

- **Save 5-10 hours per week** on pre-sales research
- **Increase meeting conversion rates** with tailored conversation starters
- **Improve deal qualification** with AI-identified pain points
- **Streamline CRM workflows** with one-click export
- **Enhance team collaboration** by sharing research insights

## 🚀 Getting Started

### Quick Start (No Configuration)

Glance works out of the box in demo mode with mock data:

```bash
# Clone the repository
git clone https://github.com/your-username/glance.git

# Install dependencies
cd glance
npm install

# Start the development server
npm run dev
```

### Full Configuration

For full functionality with real AI analysis and web scraping:

1. Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FIRECRAWL_API_KEY=your_firecrawl_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

2. Run the Supabase migrations:
```bash
# If you have Supabase CLI installed
supabase db push
```

3. Start the development server:
```bash
npm run dev
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📦 Deployment

Glance is optimized for deployment on Vercel:

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [OpenAI](https://openai.com/) for their powerful AI models
- [Firecrawl](https://firecrawl.dev/) for web scraping capabilities
- [Supabase](https://supabase.com/) for database and authentication
- [Vercel](https://vercel.com/) for hosting and deployment
- [Pexels](https://www.pexels.com/) for stock images