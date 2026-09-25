import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CtaSection({ scrollTo }) {
  return (
    <section className="py-16 bg-sky-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
          Ready to strengthen your Oracle and PeopleSoft environment?
        </h2>

        <p className="text-sky-50 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
          Speak directly with our senior PeopleSoft functional leads and cloud architects to discuss your upgrade, migration, or managed support requirements.
        </p>

        <div className="pt-2">
          <button
            onClick={() => scrollTo('contact')}
            className="px-8 py-3.5 rounded-lg text-sm font-semibold text-sky-700 bg-white hover:bg-sky-50 hover:text-sky-800 transition-all shadow-sm inline-flex items-center gap-2 group"
          >
            Get In Touch
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
