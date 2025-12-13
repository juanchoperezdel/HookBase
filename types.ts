export interface HookIdea {
  hook: string;
  category: string;
  explanation: string;
}

export enum ToneType {
  CONTROVERSIAL = 'Controversial',
  EDUCATIONAL = 'Educational',
  STORYTELLING = 'Storytelling',
  FUNNY = 'Funny',
  INSPIRATIONAL = 'Inspirational',
  NEGATIVE_FEAR = 'Negative/Fear',
  CURIOSITY = 'Curiosity Gap'
}

export interface GeneratedHooksResponse {
  hooks: HookIdea[];
}