/*
  # Add report_purpose column to reports table

  1. Changes
    - Add `report_purpose` column to the existing `reports` table
    - This migration only adds the missing column without recreating the table or policies
*/

-- Check if the column already exists before adding it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'reports' 
    AND column_name = 'report_purpose'
  ) THEN
    -- Add the report_purpose column if it doesn't exist
    ALTER TABLE reports ADD COLUMN report_purpose text DEFAULT '';
  END IF;
END $$;