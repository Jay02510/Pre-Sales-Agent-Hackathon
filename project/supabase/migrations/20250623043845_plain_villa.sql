/*
  # Create reports table for pre-sales research

  1. New Tables
    - `reports`
      - `id` (uuid, primary key)
      - `company_name` (text, required)
      - `generated_at` (timestamp)
      - `summary` (text)
      - `company_info` (text)
      - `pain_points` (jsonb array)
      - `conversation_starters` (jsonb array)
      - `key_insights` (jsonb array)
      - `recommendations` (text)
      - `source_urls` (jsonb array)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `reports` table
    - Add policy for authenticated users to read/write their own reports
*/

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  generated_at timestamptz DEFAULT now(),
  summary text DEFAULT '',
  company_info text DEFAULT '',
  pain_points jsonb DEFAULT '[]'::jsonb,
  conversation_starters jsonb DEFAULT '[]'::jsonb,
  key_insights jsonb DEFAULT '[]'::jsonb,
  recommendations text DEFAULT '',
  source_urls jsonb DEFAULT '[]'::jsonb,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON reports
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS reports_user_id_idx ON reports(user_id);
CREATE INDEX IF NOT EXISTS reports_created_at_idx ON reports(created_at DESC);