export interface SurveyEntry {
  id: number;
  originalText: string;
  name: string;
  channels: string[];
}

export interface ChannelStats {
  name: string;
  count: number;
  fill?: string;
}

export interface AnalysisResult {
  totalParticipants: number;
  channelBreakdown: ChannelStats[];
  entries: SurveyEntry[];
}
