export class MindmapNodeDto {
  name: string;
  value: string;
  children?: MindmapNodeDto[];
}

export class KnowledgePointDto {
  id: number;
  title: string;
  category: string;
  description?: string;
  keywords?: string;
}

export class MindmapResponseDto {
  id: number;
  title: string;
  central_topic: string;
  style: string;
  max_levels: number;
  created_at: Date;
  updated_at: Date;
  tree: MindmapNodeDto;
  knowledgePoints: KnowledgePointDto[];
} 