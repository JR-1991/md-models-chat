export interface KnowledgeTriplet {
  subject: string;
  predicate: string;
  object: string;
}

export interface KnowledgeGraphProps {
  triplets: KnowledgeTriplet[];
  className?: string;
}

