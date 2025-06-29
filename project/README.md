# PreSales AI Research Agent

A powerful AI-driven application for generating comprehensive pre-sales research reports with advanced CRM integration and intelligent feedback systems. Transform your meeting preparation with detailed company insights, pain points, conversation starters, and seamless CRM workflow integration.

## 🚀 **Live Demo**

The app is deployed on Netlify and ready to use! 

## 🏗️ Architecture Overview

### **Modular Design Principles**
- **Service Layer**: Isolated business logic and external API integrations
- **Component Layer**: Reusable UI components with clear responsibilities  
- **Utility Layer**: Shared helpers, validators, and constants
- **Hook Layer**: Custom React hooks for state management and side effects
- **Configuration Layer**: Centralized app configuration and environment management

### **Directory Structure**
```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (Button, Input, Card, etc.)
│   ├── layout/          # Layout components (Header, Footer, etc.)
│   └── features/        # Feature-specific components
├── services/            # Business logic and API integrations
│   ├── authService.ts   # Authentication management
│   ├── reportService.ts # Report generation and management
│   ├── crmService.ts    # CRM export functionality
│   ├── firecrawlService.ts # Web scraping integration
│   ├── openaiService.ts # OpenAI integration for real AI analysis
│   ├── aiAnalysisService.ts # AI content analysis
│   ├── feedbackService.ts # User feedback collection
│   ├── errorService.ts  # Centralized error handling
│   └── cacheService.ts  # Performance caching
├── hooks/               # Custom React hooks
│   ├── useAsync.ts      # Async operation management
│   ├── useDebounce.ts   # Input debouncing
│   └── useLocalStorage.ts # Local storage management
├── utils/               # Utility functions and helpers
│   ├── constants.ts     # Application constants
│   ├── validation.ts    # Input validation utilities
│   └── helpers.ts       # General helper functions
├── types/               # TypeScript type definitions
├── config/              # Application configuration
└── lib/                 # External library configurations
```

## 🚀 Features

### Core Research Capabilities
- **Real Web Scraping**: Extract actual content from websites using Firecrawl API
- **Real AI Analysis**: Generate detailed research reports using OpenAI GPT-4o-mini
- **Content-Aware Insights**: Smart detection of LinkedIn profiles, company websites, news articles
- **Real-time Processing**: Live progress tracking during report generation

### Advanced User Experience
- **Modular Insight Blocks**: Each insight section is independently editable and upgradeable
- **1-Click Feedback System**: Provide feedback on individual insights and overall reports
- **User Authentication**: Secure sign-up and sign-in functionality
- **Report Management**: Save and access your research reports
- **Export Functionality**: Download reports for offline use

### CRM Integration & Sales Workflow
- **Universal CRM Export**: Export to 6+ CRM formats (Salesforce, HubSpot, Pipedrive, etc.)
- **Smart Lead Scoring**: Automatic lead scoring based on research quality
- **Next Steps Generation**: AI-generated follow-up actions and tasks
- **Migration-Friendly**: Platform-agnostic approach for easy CRM switching
- **Professional Data Structure**: Industry-standard CRM data formatting

### Smart Configuration
- **Service Status Monitoring**: Real-time status of all integrated services
- **Smart Fallbacks**: Works in demo mode when APIs aren't configured
- **Configuration Detection**: Automatic service availability detection
- **Graceful Degradation**: Full functionality regardless of service configuration

## 🛠 Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Supabase Configuration

This application uses Supabase for authentication, data storage, and feedback management:

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be fully set up

2. **Get Your Project Credentials**
   - In your Supabase dashboard, go to Settings → API
   - Copy your Project URL and anon/public key

### 3. Firecrawl Configuration

This application uses Firecrawl for web scraping and content extraction:

1. **Get a Firecrawl API Key**
   - Go to [firecrawl.dev](https://firecrawl.dev)
   - Sign up for an account
   - Get your API key from the dashboard

### 4. OpenAI Configuration

This application uses OpenAI for real AI-powered analysis:

1. **Get an OpenAI API Key**
   - Go to [platform.openai.com](https://platform.openai.com/api-keys)
   - Sign up for an account
   - Create a new API key

### 5. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Firecrawl Configuration
VITE_FIRECRAWL_API_KEY=your_firecrawl_api_key_here

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 6. Set Up Database

Run the migration files in your Supabase SQL Editor:

1. **Core Tables**: Run `supabase/migrations/20250623043845_plain_villa.sql`
   - Creates the main `reports` table
   - Sets up Row Level Security (RLS)
   - Creates necessary indexes

2. **Feedback System**: Run `supabase/migrations/20250624022810_round_sound.sql`
   - Creates `report_feedback` and `insight_feedback` tables
   - Enables feedback collection and analytics
   - Sets up RLS policies for feedback data

### 7. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🌐 Deployment

### Netlify Deployment (Recommended)

1. **Push to GitHub**: Make sure your code is in a GitHub repository

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Build settings are automatically detected from `netlify.toml`

3. **Configure Environment Variables** in Netlify:
   - Go to Site settings → Environment variables
   - Add all your environment variables:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_key
     VITE_FIRECRAWL_API_KEY=your_firecrawl_key
     VITE_OPENAI_API_KEY=your_openai_key
     ```

4. **Deploy**: Netlify will automatically build and deploy your app

### Manual Build

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 Performance Optimizations

### **1. Code Splitting & Lazy Loading**
- Route-based code splitting
- Component lazy loading for large features
- Dynamic imports for heavy dependencies

### **2. Caching Strategy**
- In-memory caching for API responses
- Local storage for user preferences
- Service worker for offline functionality (future)

### **3. Bundle Optimization**
- Tree shaking for unused code elimination
- Asset optimization and compression
- CDN integration for static assets

### **4. Runtime Performance**
- Debounced input validation
- Virtualized lists for large datasets
- Memoized expensive calculations
- Optimized re-renders with React.memo

### **5. Network Optimization**
- Request batching for multiple URLs
- Retry logic with exponential backoff
- Graceful error handling and fallbacks
- Progressive data loading

### **6. Cost Optimization**
- Smart URL filtering and prioritization
- Content deduplication
- Rate limiting and batch processing
- Real-time cost monitoring

## 📊 Current Implementation Status

### ✅ Completed Features

#### 1. **Modular Architecture**
- ✅ **Service Layer**: Clean separation of business logic
- ✅ **Component Library**: Reusable UI components
- ✅ **Utility Functions**: Shared helpers and validators
- ✅ **Custom Hooks**: State management and side effects
- ✅ **Configuration Management**: Centralized app settings

#### 2. **Advanced Web Scraping & AI Analysis**
- ✅ Firecrawl API integration for real content extraction
- ✅ OpenAI GPT-4o-mini integration for real AI analysis
- ✅ Batch processing of multiple URLs with error handling
- ✅ Content-aware analysis based on scraped data
- ✅ Smart detection of different source types
- ✅ Dynamic insight generation based on actual content

#### 3. **Enhanced User Experience**
- ✅ **Service Status Monitoring**: Real-time status of all services
- ✅ **Modular Insight Blocks**: Each section independently editable
- ✅ **Real-time Editing**: In-place editing with save/cancel functionality
- ✅ **Individual Feedback**: Thumbs up/down feedback for each insight block
- ✅ **Settings & Controls**: Per-block settings and customization options
- ✅ **Enhanced Loading States**: Real-time progress tracking with detailed steps

#### 4. **Comprehensive Feedback System**
- ✅ **Report-Level Feedback**: 5-star rating system with comments
- ✅ **Insight-Level Feedback**: Individual feedback for each insight block
- ✅ **Feedback Analytics**: Database storage for feedback analysis
- ✅ **1-Click Feedback UI**: Floating feedback button and modal system
- ✅ **Feedback Persistence**: All feedback saved to Supabase with RLS

#### 5. **Universal CRM Integration**
- ✅ **6 Export Formats**: Salesforce, HubSpot, Pipedrive, Universal CSV, JSON, vCard
- ✅ **Smart Data Transformation**: Automatic conversion to CRM-ready format
- ✅ **Lead Scoring Algorithm**: Intelligent scoring based on research quality
- ✅ **Next Steps Generation**: AI-generated follow-up actions
- ✅ **CRM Import Guide**: Comprehensive instructions for all major platforms
- ✅ **Migration Support**: Platform-agnostic approach for easy CRM switching

#### 6. **Professional Sales Workflow**
- ✅ **Opportunity Estimation**: Smart value and probability calculations
- ✅ **Follow-up Scheduling**: Automatic follow-up date calculation
- ✅ **Industry Detection**: Smart industry classification from content
- ✅ **Company Size Analysis**: Automatic company size estimation
- ✅ **Professional Export Preview**: Preview data before CRM export

#### 7. **Cost Optimization & Monitoring**
- ✅ **Real-time Cost Tracking**: Monitor API usage and costs
- ✅ **Smart URL Filtering**: Prioritize high-value content sources
- ✅ **Batch Processing**: Optimize API calls for cost efficiency
- ✅ **Cache Management**: Reduce redundant API calls
- ✅ **Rate Limiting**: Prevent API overuse

## 🔧 Key Implementation Features

### Service Integration
- **OpenAI Service**: Real AI analysis using GPT-4o-mini
- **Firecrawl Service**: Real web scraping with error handling
- **Supabase Service**: User authentication and data persistence
- **Cost Optimization**: Smart resource management and monitoring

### Modular Component System
- **Reusable UI Components**: Button, Input, Card, LoadingSpinner
- **Feature Components**: Each major feature in its own component
- **Layout Components**: Header, navigation, and layout management
- **Utility Components**: Error boundaries, loading states, etc.

### Service Architecture
- **Authentication Service**: User management and session handling
- **Report Service**: Report generation and database operations
- **CRM Service**: Universal export functionality
- **OpenAI Service**: Real AI analysis integration
- **Firecrawl Service**: Web scraping with error handling
- **AI Analysis Service**: Content processing and insight generation
- **Feedback Service**: User feedback collection and analytics
- **Error Service**: Centralized error handling and logging
- **Cache Service**: Performance optimization through caching

### Utility Layer
- **Validation**: URL, form, and data validation utilities
- **Helpers**: Date formatting, text processing, array manipulation
- **Constants**: Application-wide constants and configuration
- **Custom Hooks**: Reusable state logic and side effects

### Performance Features
- **Debounced Input**: Prevents excessive API calls
- **Caching**: In-memory and local storage caching
- **Error Boundaries**: Graceful error handling
- **Lazy Loading**: Code splitting for better performance
- **Optimized Rendering**: Memoization and efficient updates

## 🛣 Roadmap

### Planned Optimizations
- **Advanced Caching**: Redis integration for server-side caching
- **Real-time Updates**: WebSocket integration for live updates
- **Progressive Web App**: Service worker and offline functionality
- **Advanced Analytics**: User behavior tracking and insights
- **A/B Testing**: Feature flag system for experimentation
- **Internationalization**: Multi-language support

### Integration Opportunities
- **Email Integration**: Direct email composition with insights
- **Calendar Integration**: Automatic meeting scheduling with context
- **Sales Tools**: Integration with sales engagement platforms
- **Marketing Automation**: Lead nurturing based on research insights

## 🤝 Contributing

This project follows a modular architecture that makes it easy to contribute:

1. **UI Components**: Add new reusable components to `src/components/ui/`
2. **Services**: Add new business logic to `src/services/`
3. **Utilities**: Add helper functions to `src/utils/`
4. **Hooks**: Add custom hooks to `src/hooks/`
5. **Features**: Add new features with their own component directories

## 📄 License

This project is private and proprietary.

---

## 🎉 Success Metrics

Your PreSales AI Research Agent now delivers:

- ✅ **Real AI Analysis** with OpenAI GPT-4o-mini integration
- ✅ **Real Web Scraping** with Firecrawl API
- ✅ **Modular Architecture** with clear separation of concerns
- ✅ **Performance Optimizations** for fast, responsive user experience
- ✅ **Real Content Extraction** from any website
- ✅ **AI-Powered Insights** based on actual scraped data
- ✅ **Universal CRM Integration** supporting 6+ platforms
- ✅ **Intelligent Feedback System** for continuous improvement
- ✅ **Professional Sales Workflow** with lead scoring and next steps
- ✅ **Enterprise-Ready Security** with RLS and data isolation
- ✅ **Seamless User Experience** with real-time editing and 1-click operations
- ✅ **Cost Optimization** with smart resource management
- ✅ **Service Monitoring** with real-time status checking

Transform your pre-sales process with intelligent research, actionable insights, and seamless CRM integration! 🚀