import type { MediaType } from '@/data/models';

export type GenerationRequest = {
  model: string;
  prompt: string;
  aspectRatio?: string;
  count?: number;
  duration?: number;
  voice?: string;
  /** Фото-референсы в виде data:image/...;base64 */
  references?: string[];
};

export type GenerationOutput = {
  type: MediaType;
  url: string;
  width?: number;
  height?: number;
};

export type GenerationMode = 'demo' | 'live';

export type GenerationResponse =
  | { status: 'completed'; mode: GenerationMode; outputs: GenerationOutput[] }
  | { status: 'pending'; mode: GenerationMode; token: string }
  | { status: 'failed'; mode: GenerationMode; error: string };
