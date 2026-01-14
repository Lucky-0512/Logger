
export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN'
}

export enum AreaToWorkOn {
  QP = 'QP',
  PROCESS_ENHANCEMENT = 'Process Enhancement',
  TRAINING = 'Training',
  GENERAL = 'General',
  INVENTORY = 'Inventory',
  FOLDER_STRUCTURE = 'Folder Structure',
  QUALITY = 'Quality',
  LANDBASE = 'Landbase',
  QP_CAD = 'QP & CAD'
}

export enum Category {
  PROCESS_ENHANCEMENT = 'Process Enhancement',
  AUTOMATION = 'Automation'
}

export interface Suggestion {
  id: string;
  date_of_suggestion: string;
  suggestion_description: string;
  category: Category;
  benefit: string;
  area_to_work_on: AreaToWorkOn;
  emp_id: string;
  suggested_by: string;
  // Admin Fields
  evaluation: string;
  current_status: string;
  reviewed: string;
  conclusion: string;
  went_live: string;
  final_status: string;
  owner: string;
  tentative_eta: string;
  revised_date: string;
  remarks: string;
}

export interface User {
  emp_id: string;
  name: string;
  role: UserRole;
  password?: string; // Only for Admin
}
