'use client';

import { Sparkles, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUI } from '@/components/providers/UIProvider';
import { JobCard } from '@/components/studio/JobCard';
import { Button } from '@/components/ui/Button';
import { getModel } from '@/data/models';
import { clearHistory, loadHistory, removeJob, type Job } from '@/lib/history';
import s from './HistoryList.module.css';

export function HistoryList() {
  const router = useRouter();
  const { toast } = useUI();
  const [jobs, setJobs] = useState<Job[] | null>(null);

  useEffect(() => setJobs(loadHistory()), []);

  if (jobs === null) return <div className={s.placeholder} aria-busy="true" />;

  if (jobs.length === 0) {
    return (
      <div className={s.empty}>
        <Sparkles aria-hidden />
        <h2>Здесь пока пусто</h2>
        <p>Результаты генераций сохраняются в этом браузере и появятся на этой странице.</p>
        <Button href="/playground/image/nano-banana-pro">Создать первую генерацию</Button>
      </div>
    );
  }

  return (
    <div>
      <div className={s.toolbar}>
        <span className={s.count}>Сохранено: {jobs.length}</span>
        <button
          type="button"
          className={s.clear}
          onClick={() => {
            if (!window.confirm('Удалить всю историю генераций из этого браузера?')) return;
            clearHistory();
            setJobs([]);
            toast('История очищена', 'success');
          }}
        >
          <Trash2 aria-hidden />
          Очистить всё
        </button>
      </div>
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onReuse={(j) => {
            const m = getModel(j.model);
            if (m) router.push(`/playground/${m.type}/${m.slug}?prompt=${encodeURIComponent(j.prompt)}`);
          }}
          onDelete={(id) => {
            removeJob(id);
            setJobs((list) => (list ?? []).filter((j) => j.id !== id));
          }}
        />
      ))}
    </div>
  );
}
