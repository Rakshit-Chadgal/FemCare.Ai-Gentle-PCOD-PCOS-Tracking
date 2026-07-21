import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { symptomLogService } from '@/services/symptomLogs';
import { learnArticles, categoryLabels, categoryColors } from '@/lib/learnArticles';
import { Sparkle, ChevronRight } from 'lucide-react';

const TOPIC_CHECKS = {
  acne: (log) => (log.acne_severity || 0) >= 2,
  facial_hair: (log) => log.facial_hair_growth,
  hair_thinning: (log) => log.hair_thinning,
  weight: (log) => log.weight_change === 'up' || log.weight_change === 'down',
  mood: (log) => (log.mood || 3) <= 2,
  sleep: (log) => (log.sleep_quality || 3) <= 2,
  pelvic_pain: (log) => log.pelvic_pain,
  cravings: (log) => (log.cravings_intensity || 0) >= 3,
  cycle: (log) => log.cycle_started,
};

export default function ForYouArticles() {
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    async function load() {
      const logs = await symptomLogService.list(50);
      const twoWeeksAgo = new Date(Date.now() - 14 * 86400000);
      const recentLogs = logs.filter(l => new Date(l.log_date) >= twoWeeksAgo);

      if (recentLogs.length === 0) {
        setArticles([]);
        return;
      }

      const topicCounts = {};
      for (const log of recentLogs) {
        for (const topic of Object.keys(TOPIC_CHECKS)) {
          if (TOPIC_CHECKS[topic](log)) {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
          }
        }
      }

      const scored = learnArticles
        .map(article => {
          let score = 0;
          for (const topic of (article.topics || [])) {
            if (topicCounts[topic]) score += topicCounts[topic];
          }
          return { article, score };
        })
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score || a.article.order - b.article.order);

      setArticles(scored.slice(0, 4).map(s => s.article));
    }
    load();
  }, []);

  if (!articles || articles.length === 0) return null;

  return (
    <div className="mb-6 animate-card-rise" style={{ animationDelay: '0ms' }}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkle size={16} className="text-primary" />
        <h2 className="text-base font-semibold text-foreground">For You</h2>
        <span className="text-xs text-muted-foreground">Based on your recent logs</span>
      </div>
      <div className="space-y-3 stagger-cards">
        {articles.map(article => {
          const colors = categoryColors[article.category];
          return (
            <Link
              key={article.id}
              to={`/learn/${article.id}`}
              className="block glass rounded-2xl p-4 hover:shadow-md transition group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors.badge} mb-2`}>
                    {categoryLabels[article.category]}
                  </span>
                  <h3 className="text-base font-semibold text-foreground leading-snug">{article.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{article.summary}</p>
                </div>
                <ChevronRight size={18} className="shrink-0 text-muted-foreground group-hover:text-primary mt-1 transition" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}