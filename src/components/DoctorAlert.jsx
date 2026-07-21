import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, ArrowRight } from 'lucide-react';

export default function DoctorAlert({ reason }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-full bg-high/20 flex items-center justify-center">
          <Stethoscope size={20} className="text-high" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-high">Consider seeing a doctor</h3>
          <p className="text-sm text-foreground/80 mt-1 leading-relaxed">{reason}</p>
          <Link
            to="/doctor-report"
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-high hover:underline"
          >
            Generate a report to bring <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}