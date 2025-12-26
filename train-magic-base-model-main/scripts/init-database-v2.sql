-- Add checkpoints and download tracking tables

-- Checkpoints table
CREATE TABLE IF NOT EXISTS checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  version VARCHAR(50) NOT NULL,
  description TEXT,
  architecture VARCHAR(255) NOT NULL,
  parameters_count BIGINT,
  training_dataset VARCHAR(255),
  s3_url VARCHAR(500) NOT NULL,
  download_url VARCHAR(500),
  size_gb DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Checkpoint downloads tracking
CREATE TABLE IF NOT EXISTS checkpoint_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  checkpoint_id UUID NOT NULL REFERENCES checkpoints(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- Update submissions to track which checkpoint was used
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS checkpoint_id UUID REFERENCES checkpoints(id);
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS checkpoint_version VARCHAR(50);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_checkpoints_version ON checkpoints(version);
CREATE INDEX IF NOT EXISTS idx_checkpoints_active ON checkpoints(is_active);
CREATE INDEX IF NOT EXISTS idx_checkpoint_downloads_user ON checkpoint_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_checkpoint_downloads_checkpoint ON checkpoint_downloads(checkpoint_id);
CREATE INDEX IF NOT EXISTS idx_submissions_checkpoint ON submissions(checkpoint_id);

-- View for checkpoint statistics
CREATE OR REPLACE VIEW checkpoint_stats AS
SELECT 
  c.id,
  c.name,
  c.version,
  COUNT(DISTINCT cd.user_id) as unique_downloads,
  COUNT(cd.id) as total_downloads,
  COUNT(DISTINCT s.id) as submissions_using_checkpoint,
  ROUND(AVG(s.score)::numeric, 2) as avg_submission_score
FROM checkpoints c
LEFT JOIN checkpoint_downloads cd ON c.id = cd.checkpoint_id
LEFT JOIN submissions s ON c.id = s.checkpoint_id
GROUP BY c.id, c.name, c.version;
