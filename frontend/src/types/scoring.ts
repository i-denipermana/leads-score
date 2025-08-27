export type ICPPrefs = {
  industries?: string[];
  countries?: string[];
  states?: string[];
  rev_min?: number;
  rev_max?: number;
};

export type Lead = {
  id: string;
  name: string;
  industry?: string;
  country?: string;
  state?: string;
  employee_count?: number;
  revenue_usd?: number;
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  growjo_rank?: number | null;
  hiring?: boolean | null;
  score?: number;
  priority?: "Hot" | "Warm" | "Cold";
};


export type ScoreWeights = {
  employee_min: number;
  employee_max: number;
  rev_min: number;
  rev_max: number;

  w_employee_fit: number;
  w_revenue_fit: number;
  w_industry_match: number;
  w_location_match: number;
  w_contact_completeness: number;
  w_growth_signal: number;

  hot_threshold: number;
  warm_threshold: number;
};
