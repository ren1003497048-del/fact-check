export interface TimelineEvent {
  time: string;
  event: string;
}

export interface Reference {
  source_name: string;
  url: string;
  note: string; // Brief conclusion or discrepancy analysis
  type: 'SUPPORT' | 'CONFLICT' | 'NEUTRAL'; // Type of evidence
}

export interface LogicAnalysis {
  summary: string; // General logic check
  amplification_nodes: string[]; // Key nodes where news expanded (e.g., "Twitter @ElonMusk", "Weibo Hot Search")
  primary_opinion_field: string; // The main arena (e.g., "Simplified Chinese Social Media", "Official State Media")
  opinion_stratification: string; // Layered analysis of the narrative flow
}

export interface VerificationResult {
  verdict: 'REAL' | 'FAKE' | 'MISLEADING' | 'UNVERIFIED';
  score: number;
  analysis: {
    source: string;
    context: string;
    logic: LogicAnalysis; // Changed from string to object
    cross_check: string;
    visual?: string;
  };
  timeline: TimelineEvent[];
  expert_advice: string;
  references: Reference[];
}

export const VerdictType = {
  REAL: '真实 / REAL',
  FAKE: '虚假 / FAKE',
  MISLEADING: '存在偏差 / MISLEADING',
  UNVERIFIED: '缺乏证据 / UNVERIFIED'
} as const;

export type VerdictType = typeof VerdictType[keyof typeof VerdictType];