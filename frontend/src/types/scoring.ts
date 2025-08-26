export type ICPPrefs = {
  industries?: string[];
  countries?: string[];
  states?: string[];
  rev_min?: number;
  rev_max?: number;
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
