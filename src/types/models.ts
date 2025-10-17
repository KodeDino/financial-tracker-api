export interface Goal {
  id: string;
  user_id: string;
  target_amount: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  completed_at: string | null;
}

export interface Investment {
  id: string;
  user_id: string;
  date: string;
  type: 'cd' | 'tBill';
  amount: number;
  rate: number;
}

export interface User {
  id: string;
  google_id: string;
  email: string;
  name?: string;
  picture?: string;
  created_at: string;
}
