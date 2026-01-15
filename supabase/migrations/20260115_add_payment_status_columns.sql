-- Add payment status columns to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_clients_subscription_status ON clients(subscription_status);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);

-- Update existing clients to 'active' if they have reports (they already paid)
UPDATE clients
SET 
  subscription_status = 'active',
  status = 'active',
  plan = 'pro'
WHERE id IN (
  SELECT DISTINCT client_id 
  FROM reports
);
