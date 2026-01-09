import React, { useState } from 'react';
import { Sparkles, Loader2, Plus } from 'lucide-react';
import { ToneType, HookIdea } from '../types';
import { generateViralHooks } from '../services/geminiService';
import { HookList } from './HookList';

export const HookGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<ToneType>(ToneType.CONTROVERSIAL);
  const [hooks, setHooks] = useState<HookIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setHooks([]);

    try {
      const results = await generateViralHooks(topic, tone);
      setHooks(results);
    } catch (err) {
      setError('Algo salió mal. Por favor verifica tu API key o intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Translation map for ToneType to Spanish display
  const toneTranslations: Record<string, string> = {
    [ToneType.CONTROVERSIAL]: 'Controversial',
    [ToneType.EDUCATIONAL]: 'Educativo',
    [ToneType.STORYTELLING]: 'Storytelling',
    [ToneType.FUNNY]: 'Divertido',
    [ToneType.INSPIRATIONAL]: 'Inspirador',
    [ToneType.NEGATIVE_FEAR]: 'Miedo/Negativo',
    [ToneType.CURIOSITY]: 'Curiosidad'
  };

  const tones = Object.values(ToneType);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleGenerate} className="flex flex-col gap-8">
          
          {/* Main Input - Styled like a big rounded search bar */}
          <div className="relative">
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ej. Marketing digital para principiantes..."
              className="w-full rounded-full border border-gray-200 bg-white p-6 pl-8 text-xl text-zylo-black placeholder:text-gray-400 shadow-soft focus:border-zylo-black focus:outline-none focus:ring-1 focus:ring-zylo-black transition-all"
              required
            />
            <button
                type="submit"
                disabled={loading || !topic}
                className="absolute right-2 top-2 bottom-2 rounded-full bg-zylo-black px-8 text-base font-bold text-white transition-all hover:bg-gray-800 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                {loading ? 'Generando...' : 'Generar'}
            </button>
          </div>

          {/* Tone Selectors - Styled like the "Auto Boosting / Analytics" tags in Zylo image */}
          <div className="space-y-4">
            <label className="text-lg font-bold text-zylo-black ml-4">
              Elige tu estilo de crecimiento
            </label>
            <div className="flex flex-wrap gap-3">
              {tones.map((t, idx) => {
                 const isSelected = tone === t;
                 // Varied distinct border radius shapes to mimic the organic feel
                 const radiusClass = idx % 2 === 0 ? 'rounded-full' : 'rounded-[2rem]';
                 
                 return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`group relative flex items-center gap-2 border px-6 py-3 text-sm font-semibold transition-all ${radiusClass} ${
                      isSelected
                        ? 'bg-zylo-green border-zylo-green text-zylo-black shadow-lg scale-105'
                        : 'bg-white border-zylo-black text-zylo-black hover:bg-gray-50'
                    }`}
                  >
                    {toneTranslations[t]}
                    {/* Add little plus icon like in the image */}
                    {!isSelected && (
                        <div className="rounded-full border border-zylo-black p-0.5 ml-1">
                            <Plus size={10} strokeWidth={3} />
                        </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {error && (
            <div className="mt-8 p-6 text-center text-red-600 bg-red-50 rounded-3xl border border-red-100">
                {error}
            </div>
        )}
      </div>

      <HookList hooks={hooks} />
    </div>
  );
};