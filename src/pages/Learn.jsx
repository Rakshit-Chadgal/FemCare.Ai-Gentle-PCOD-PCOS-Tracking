import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { learnArticles, categoryLabels, categoryColors } from '@/lib/learnArticles';
import { Clock, ChevronRight, BookOpen } from 'lucide-react';
import ForYouArticles from '@/components/ForYouArticles';

const categories = ['all', 'basics', 'myths', 'diet', 'lifestyle', 'mental_health'];

export default function Learn() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all'
    ? [...learnArticles].sort((a, b) => a.order - b.order)
    : learnArticles.filter(a => a.category === filter).sort((a, b) => a.order - b.order);

  return (
    <div className="pt-6 pb-4">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-foreground">Learn</h1>
        <p className="text-sm text-muted-foreground mt-1">Credible, gentle info on PCOD/PCOS — no scary forums.</p>
      </div>

      <ForYouArticles />

      <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 mb-4" style={{ scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat === 'all' ? 'All' : categoryLabels[cat]}
          </button>
        ))}
      </div>

      <div className="space-y-3 stagger-cards">
        {filtered.map(article => {
          const colors = categoryColors[article.category];
          return (
            <Link
              key={article.id}
              to={`/learn/${article.id}`}
              className="block rounded-2xl bg-card border border-border/60 p-4 shadow-sm hover:shadow-md transition group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors.badge} mb-2`}>
                    {categoryLabels[article.category]}
                  </span>
                  <h3 className="text-base font-semibold text-foreground leading-snug">{article.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{article.summary}</p>
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                    <Clock size={12} />
                    <span>{article.read_time_minutes} min read</span>
                  </div>
                </div>
                <ChevronRight size={18} className="shrink-0 text-muted-foreground group-hover:text-primary mt-1 transition" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl bg-lavender border border-accent/40 p-4 text-center">
        <BookOpen size={20} className="mx-auto text-[hsl(256_40%_45%)] mb-2" />
        <p className="text-xs text-foreground/70 leading-relaxed">
          These articles are for general awareness and education. They are not medical advice — always consult a licensed doctor for your specific situation.
        </p>
      </div>
    </div>
  );
}