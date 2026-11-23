import type { MediaType } from '@/data/models';
import type { GenerationMode, GenerationOutput } from './generation/types';
import { readStorage, writeStorage } from './storage';

/**
 * История генераций хранится в браузере пользователя (localStorage).
 * После подключения авторизации её стоит перенести в базу данных.
 */
export type Job = {
  id: string;
  model: string;
  modelName: string;
  type: MediaType;
  prompt: string;
  aspectRatio: string;
  count: number;
  status: 'pending' | 'completed' | 'failed';
  mode?: GenerationMode;
  outputs: GenerationOutput[];
  error?: string;
  createdAt: number;
};

const KEY = 'gen:history';
const LIMIT = 60;

export function loadHistory(): Job[] {
  return readStorage<Job[]>(KEY, []).filter((j) => j && j.status === 'completed' && Array.isArray(j.outputs));
}

export function saveJob(job: Job): void {
  const list = readStorage<Job[]>(KEY, []).filter((j) => j.id !== job.id);
  list.unshift(job);
  writeStorage(KEY, list.slice(0, LIMIT));
}

export function removeJob(id: string): void {
  writeStorage(
    KEY,
    readStorage<Job[]>(KEY, []).filter((j) => j.id !== id),
  );
}

export function clearHistory(): void {
  writeStorage(KEY, []);
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
