'use client';

import { Check, Crown, Flame, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useUI } from '@/components/providers/UIProvider';
import { Button } from '@/components/ui/Button';
import { DEFAULT_MODEL, getModel } from '@/data/models';
import {
  discountPercent,
  formatMoney,
  PLAN_FEATURES,
  PLAN_VIDEO_MODELS,
  PLANS,
  type Currency,
} from '@/data/pricing';
import { cx } from '@/lib/cx';
import { tokens } from '@/lib/plural';
import s from './PricingTable.module.css';

const imageModel = getModel(DEFAULT_MODEL.image)!;
const videoModel = getModel(DEFAULT_MODEL.video)!;

export function PricingTable() {
  const { openLogin } = useUI();
  const [currency, setCurrency] = useState<Currency>('rub');
  const [tiers, setTiers] = useState<Record<string, number>>({});

  return (
    <div>
      <div className={s.toolbar}>
        <div className={s.currency} role="radiogroup" aria-label="Валюта">
          {(['rub', 'usd'] as const).map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={currency === c}
              className={cx(s.curBtn, currency === c && s.curActive)}
              onClick={() => setCurrency(c)}
            >
              {c === 'rub' ? '₽' : '$'}
            </button>
          ))}
        </div>
      </div>

      <div className={s.grid}>
        {PLANS.map((plan) => {
          const idx = tiers[plan.id] ?? 0;
          const tier = plan.tiers[idx];
          const off = discountPercent(tier, currency);
          return (
            <article key={plan.id} className={cx(s.plan, plan.highlight && s[plan.highlight])}>
              {plan.highlight && (
                <div className={s.ribbon}>
                  {plan.highlight === 'popular' ? <Flame aria-hidden /> : <Crown aria-hidden />}
                  {plan.highlight === 'popular' ? 'Популярный' : 'Лучший выбор'}
                </div>
              )}
              <div className={s.body}>
                <div className={s.head}>
                  <h2 className={s.name}>{plan.name}</h2>
                  {off ? <span className={s.off}>−{off}%</span> : null}
                </div>
                <p className={s.subtitle}>{plan.subtitle}</p>

                <div className={s.price}>
                  {tier.oldPrice && <s className={s.old}>{formatMoney(tier.oldPrice[currency], currency)}</s>}
                  <strong>{formatMoney(tier.price[currency], currency)}</strong>
                  <span>/ мес.</span>
                </div>

                <div className={s.tokensBox}>
                  <p className={s.tokens}>
                    <Sparkles aria-hidden />
                    {tokens(tier.tokens)} в месяц
                  </p>
                  <ul className={s.estimates}>
                    <li>
                      ≈ {Math.floor(tier.tokens / imageModel.cost)} фото {imageModel.name}
                    </li>
                    {plan.videoModels.length > 0 && (
                      <li>
                        ≈ {Math.floor(tier.tokens / videoModel.cost)} видео {videoModel.name}
                      </li>
                    )}
                  </ul>
                  {plan.tiers.length > 1 && (
                    <div className={s.slider}>
                      <input
                        type="range"
                        min={0}
                        max={plan.tiers.length - 1}
                        step={1}
                        value={idx}
                        aria-label="Количество токенов в месяц"
                        onChange={(e) => setTiers((t) => ({ ...t, [plan.id]: Number(e.target.value) }))}
                      />
                      <div className={s.sliderLabels}>
                        {plan.tiers.map((t, i) => (
                          <span key={t.tokens} className={cx(i === idx && s.sliderActive)}>
                            {new Intl.NumberFormat('ru-RU').format(t.tokens)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  variant={plan.highlight === 'popular' ? 'accent' : plan.highlight === 'best' ? 'pink' : 'white'}
                  fullWidth
                  onClick={openLogin}
                >
                  Выбрать «{plan.name}»
                </Button>

                <ul className={s.features}>
                  {PLAN_FEATURES.map((f, i) => {
                    const yes = i < plan.featureCount;
                    return (
                      <li key={f} className={yes ? s.yes : s.no}>
                        {yes ? <Check aria-hidden /> : <X aria-hidden />}
                        <span>
                          {f}
                          {!yes && <span className="srOnly"> — не входит</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className={s.models}>
                  <p className={s.modelsTitle}>Видеомодели</p>
                  <ul>
                    {PLAN_VIDEO_MODELS.map((slug) => {
                      const yes = plan.videoModels.includes(slug);
                      return (
                        <li key={slug} className={yes ? s.yes : s.no}>
                          {yes ? <Check aria-hidden /> : <X aria-hidden />}
                          {getModel(slug)?.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
