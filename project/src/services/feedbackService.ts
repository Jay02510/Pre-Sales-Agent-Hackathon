import { supabase } from '../lib/supabase';

export interface Feedback {
  id?: string;
  reportId: string;
  userId?: string;
  rating: number;
  comment: string;
  helpful: boolean;
  createdAt?: string;
}

export interface InsightFeedback {
  id?: string;
  reportId: string;
  insightId: string;
  userId?: string;
  type: 'positive' | 'negative';
  comment?: string;
  createdAt?: string;
}

export class FeedbackService {
  static async submitReportFeedback(feedback: Omit<Feedback, 'id' | 'userId' | 'createdAt'>): Promise<void> {
    if (!supabase) {
      // In demo mode, just log the feedback
      console.log('Demo mode - Report feedback:', feedback);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('report_feedback')
      .insert({
        report_id: feedback.reportId,
        user_id: user?.id,
        rating: feedback.rating,
        comment: feedback.comment,
        helpful: feedback.helpful,
      });

    if (error) {
      console.error('Error submitting report feedback:', error);
      throw error;
    }
  }

  static async submitInsightFeedback(feedback: Omit<InsightFeedback, 'id' | 'userId' | 'createdAt'>): Promise<void> {
    if (!supabase) {
      // In demo mode, just log the feedback
      console.log('Demo mode - Insight feedback:', feedback);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('insight_feedback')
      .insert({
        report_id: feedback.reportId,
        insight_id: feedback.insightId,
        user_id: user?.id,
        feedback_type: feedback.type,
        comment: feedback.comment,
      });

    if (error) {
      console.error('Error submitting insight feedback:', error);
      throw error;
    }
  }

  static async getReportFeedback(reportId: string): Promise<Feedback[]> {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('report_feedback')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching report feedback:', error);
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      reportId: item.report_id,
      userId: item.user_id,
      rating: item.rating,
      comment: item.comment,
      helpful: item.helpful,
      createdAt: item.created_at,
    }));
  }

  static async getInsightFeedback(reportId: string): Promise<InsightFeedback[]> {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('insight_feedback')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching insight feedback:', error);
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      reportId: item.report_id,
      insightId: item.insight_id,
      userId: item.user_id,
      type: item.feedback_type,
      comment: item.comment,
      createdAt: item.created_at,
    }));
  }
}