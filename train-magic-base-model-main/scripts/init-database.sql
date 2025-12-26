-- MAGIC AI Competition Database Schema
-- This script initializes the database tables for the competition platform
-- Run this on your Supabase, Neon, or other SQL database

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  model_name VARCHAR(255) NOT NULL,
  description TEXT,
  model_file_url VARCHAR(255),
  score DECIMAL(5, 2),
  accuracy DECIMAL(5, 2),
  training_hours INTEGER,
  batch_size INTEGER,
  status VARCHAR(50) DEFAULT 'training',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_score ON submissions(score DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Leaderboard view (aggregates user stats)
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY MAX(s.score) DESC) as rank,
  u.id as user_id,
  u.name as username,
  ROUND(MAX(s.score)::numeric, 2) as score,
  COUNT(s.id) as submissions,
  ROUND(AVG(s.accuracy)::numeric, 2) as avg_accuracy
FROM users u
LEFT JOIN submissions s ON u.id = s.user_id AND s.status = 'completed'
GROUP BY u.id, u.name
ORDER BY MAX(s.score) DESC NULLS LAST;
