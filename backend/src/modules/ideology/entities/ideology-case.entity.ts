import { CaseLength, CaseType } from '../dto/generate-case.dto';

export class IdeologyCase {
  id: number;
  title: string;
  content: string;
  chapter_id: number;
  user_id: number;
  case_type: CaseType;
  case_length: CaseLength;
  is_ai_generated: boolean;
  theme: string;
  created_at: Date;
  updated_at: Date;
  resources?: IdeologyCaseResource[];
}

export class IdeologyCaseResource {
  id: number;
  case_id: number;
  resource_type: number;
  resource_url: string;
  resource_name: string;
  file_size?: number;
  file_extension?: string;
  created_at: Date;
} 