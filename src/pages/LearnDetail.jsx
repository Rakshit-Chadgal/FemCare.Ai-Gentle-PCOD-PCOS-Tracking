import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { learnArticles, categoryLabels, categoryColors } from '@/lib/learnArticles';
import ReactMarkdown from 'react-markdown';
import { ChevronLeft, Clock } from 'lucide-react';

export default function LearnDetail() {
  const { id } = useParams();
  const article = learnArticles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="pt-10 text-center">
        <p className="text-sm text-muted-foreground mb-4">Article not found.</p>
        <Link to="/learn" className="text-sm font-semibold text-primary hover:underline">Back to Learn</Link>
      </div>
    );
  }

  const colors = categoryColors[article.category];

  return (
    <div className="pt-4 pb-4">
      <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition">
        <ChevronLeft size={16} /> Back to Learn
      </Link>

      <span className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full ${colors.badge} mb-3`}>
        {categoryLabels[article.category]}
      </span>
      <h1 className="text-2xl font-bold text-foreground leading-tight">{article.title}</h1>
      <div className="flex items-center gap-1.5 mt-2 mb-5 text-xs text-muted-foreground">
        <Clock size={12} />
        <span>{article.read_time_minutes} min read</span>
      </div>

      <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-sm">
        <ReactMarkdown
          components={{
            h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-5 mb-2 text-foreground" {...props} />,
            p: ({ node, ...props }) => <p className="text-sm text-foreground/80 leading-relaxed mb-3" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1.5" {...props} />,
            li: ({ node, ...props }) => <li className="text-sm text-foreground/80 leading-relaxed" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
            em: ({ node, ...props }) => <em className="text-xs text-muted-foreground block mt-4 pt-3 border-t border-border/40 not-italic" {...props} />
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}