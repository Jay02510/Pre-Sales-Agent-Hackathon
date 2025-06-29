export interface Database {
  public: {
    Tables: {
      reports: {
        Row: {
          id: string;
          company_name: string;
          generated_at: string;
          summary: string;
          company_info: string;
          pain_points: string[];
          conversation_starters: string[];
          key_insights: string[];
          recommendations: string;
          source_urls: string[];
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          generated_at?: string;
          summary?: string;
          company_info?: string;
          pain_points?: string[];
          conversation_starters?: string[];
          key_insights?: string[];
          recommendations?: string;
          source_urls?: string[];
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          generated_at?: string;
          summary?: string;
          company_info?: string;
          pain_points?: string[];
          conversation_starters?: string[];
          key_insights?: string[];
          recommendations?: string;
          source_urls?: string[];
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      report_feedback: {
        Row: {
          id: string;
          report_id: string;
          user_id: string;
          rating: number;
          comment: string;
          helpful: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          user_id?: string;
          rating: number;
          comment?: string;
          helpful?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          user_id?: string;
          rating?: number;
          comment?: string;
          helpful?: boolean;
          created_at?: string;
        };
      };
      insight_feedback: {
        Row: {
          id: string;
          report_id: string;
          insight_id: string;
          user_id: string;
          feedback_type: 'positive' | 'negative';
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          insight_id: string;
          user_id?: string;
          feedback_type: 'positive' | 'negative';
          comment?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          insight_id?: string;
          user_id?: string;
          feedback_type?: 'positive' | 'negative';
          comment?: string;
          created_at?: string;
        };
      };
    };
  };
}

export interface Report {
  id: string;
  companyName: string;
  generatedAt: string;
  summary: string;
  companyInfo: string;
  painPoints: string[];
  conversationStarters: string[];
  keyInsights: string[];
  recommendations: string;
  sourceUrls: string[];
}