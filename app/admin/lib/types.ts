import type { Status, Tech } from "./constants";

export interface Job {
  id: string;
  created_at: string;
  visit_date: string;
  visit_time: string;
  name: string;
  phone: string;
  region: string;
  symptom: string;
  price: number;
  status: Status;
  tech: Tech;
  memo: string;
  review_requested: boolean;
  completion_photo?: string;
  as_until?: string;
  intake_photos?: string;
  is_measurement?: boolean;
  install_date?: string | null;
  install_time?: string | null;
  install_completed?: boolean;
}

export type JobFormState = {
  visit_date: string;
  visit_time: string;
  name: string;
  phone: string;
  region: string;
  symptom: string;
  price: number;
  status: Status;
  tech: Tech;
  memo: string;
  as_until: string;
  intake_photos: string;
  is_measurement: boolean;
  install_date: string | null;
  install_time: string | null;
  install_completed: boolean;
};
