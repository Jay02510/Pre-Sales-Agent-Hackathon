/*
  # Create feedback tables for report and insight feedback

  1. New Tables
    - `report_feedback`
      - `id` (uuid, primary key)
      - `report_id` (uuid, foreign key to reports)
      - `user_id` (uuid, foreign key to auth.users)
      - `rating` (integer, 1-5 scale)
      - `comment` (text)
      - `helpful` (boolean)
      - `created_at` (timestamp)

    - `insight_feedback`
      - `id` (uuid, primary key)
      - `report_id` (uuid, foreign key to reports)
      - `insight_id` (text, identifies which insight block)
      - `user_id` (uuid, foreign key to auth.users)
      - `feedback_type` (text, 'positive' or 'negative')
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own feedback
*/

CREATE TABLE IF NOT EXISTS report_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text DEFAULT '',
  helpful boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS insight_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  insight_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback_type text NOT NULL CHECK (feedback_type IN ('positive', 'negative')),
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE report_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE insight_feedback ENABLE ROW LEVEL SECURITY;

-- Report Feedback Policies
CREATE POLICY "Users can read own report feedback"
  ON report_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own report feedback"
  ON report_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own report feedback"
  ON report_feedback
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insight Feedback Policies
CREATE POLICY "Users can read own insight feedback"
  ON insight_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insight feedback"
  ON insight_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insight feedback"
  ON insight_feedback
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS report_feedback_report_id_idx ON report_feedback(report_id);
CREATE INDEX IF NOT EXISTS report_feedback_user_id_idx ON report_feedback(user_id);
CREATE INDEX IF NOT EXISTS insight_feedback_report_id_idx ON insight_feedback(report_id);
CREATE INDEX IF NOT EXISTS insight_feedback_user_id_idx ON insight_feedback(user_id);
CREATE INDEX IF NOT EXISTS insight_feedback_insight_id_idx ON insight_feedback(insight_id);