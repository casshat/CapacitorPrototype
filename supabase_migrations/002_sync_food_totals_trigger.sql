-- Migration: Sync food_log_entries totals to daily_logs
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)

-- ============================================================================
-- TRIGGER FUNCTION: Recalculate and sync food totals to daily_logs
-- ============================================================================
-- This function is called whenever a row is inserted, updated, or deleted
-- in the food_log_entries table. It recalculates the daily totals and
-- upserts them into the daily_logs table.

CREATE OR REPLACE FUNCTION sync_food_totals_to_daily_log()
RETURNS TRIGGER AS $$
DECLARE
  target_user_id uuid;
  target_date date;
  new_calories numeric;
  new_protein numeric;
  new_carbs numeric;
  new_fat numeric;
BEGIN
  -- Determine which row was affected
  IF TG_OP = 'DELETE' THEN
    target_user_id := OLD.user_id;
    target_date := OLD.log_date;
  ELSE
    target_user_id := NEW.user_id;
    target_date := NEW.log_date;
  END IF;

  -- Calculate totals from all food entries for this user/date
  SELECT 
    COALESCE(SUM(calories), 0),
    COALESCE(SUM(protein), 0),
    COALESCE(SUM(carbs), 0),
    COALESCE(SUM(fat), 0)
  INTO new_calories, new_protein, new_carbs, new_fat
  FROM food_log_entries
  WHERE user_id = target_user_id AND log_date = target_date;

  -- Upsert into daily_logs
  -- This will insert a new row if one doesn't exist, or update the existing row
  INSERT INTO daily_logs (user_id, log_date, total_calories, protein_grams, carbs_grams, fat_grams, updated_at)
  VALUES (target_user_id, target_date, new_calories, new_protein, new_carbs, new_fat, now())
  ON CONFLICT (user_id, log_date)
  DO UPDATE SET
    total_calories = EXCLUDED.total_calories,
    protein_grams = EXCLUDED.protein_grams,
    carbs_grams = EXCLUDED.carbs_grams,
    fat_grams = EXCLUDED.fat_grams,
    updated_at = EXCLUDED.updated_at;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER: Fire on INSERT, UPDATE, DELETE of food_log_entries
-- ============================================================================

-- Drop existing trigger if it exists (safe to re-run this migration)
DROP TRIGGER IF EXISTS sync_food_totals_trigger ON food_log_entries;

-- Create the trigger
CREATE TRIGGER sync_food_totals_trigger
AFTER INSERT OR UPDATE OR DELETE ON food_log_entries
FOR EACH ROW EXECUTE FUNCTION sync_food_totals_to_daily_log();

-- ============================================================================
-- VERIFICATION: Test the trigger (optional)
-- ============================================================================
-- After running this migration, you can verify it works by:
-- 1. Adding a food entry via the app
-- 2. Checking the daily_logs table - it should have updated totals
--
-- SELECT * FROM daily_logs WHERE log_date = CURRENT_DATE;
