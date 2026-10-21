import React from 'react';
import { Award, ShieldCheck, FileText, Activity } from 'lucide-react';
import Container from '@/components/common/Container';

export default function TrustStrip() {
  const trustItems = [
    {
      icon: Award,
      title: "MD AIIMS & FAICO Gold Medalist",
      desc: "Apex national training in Vitreo-Retinal surgery"
    },
    {
      icon: Activity,
      title: "25G / 27G Sutureless Vitrectomy",
      desc: "Micro-incision posterior segment surgery"
    },
    {
      icon: FileText,
      title: "18 Indexed Research Publications",
      desc: "Evidence-based, peer-reviewed clinical protocols"
    },
    {
      icon: ShieldCheck,
      title: "Positive-Pressure HEPA OT",
      desc: "Class 100 laminar cleanroom infection defense"
    }
  ];

  return (
    <div className="w-full bg-[#061226] text-white border-y border-slate-800 py-8 lg:py-10">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 reveal-up">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-[#C59B27]/40 transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-[#0A1E3F] text-[#DFBF64] border border-[#C59B27]/30 flex items-center justify-center shrink-0 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-heading font-bold text-white tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
