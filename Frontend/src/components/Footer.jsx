import React from 'react';

export default function Footer({ scrollTo }) {
  return (
    <footer className="bg-sky-50 border-t border-sky-200 text-slate-700 text-xs pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 font-['Inter']">
              PeopleLabs Consulting Inc.
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed max-w-md">
              Specialized Oracle & PeopleSoft enterprise consulting firm delivering implementation, upgrades, reporting, and managed services.
            </p>

            <div className="pt-2 space-y-1.5 text-slate-700">
              <p className="font-semibold">
                3269 Cherry Crescent SW, Edmonton, Alberta T6X 1Y5, Canada
              </p>
              <p>
                Phone: <a href="tel:+15874003360" className="text-sky-600 font-semibold hover:text-sky-700">+1 587 400 3360</a>
              </p>
              <p>
                Email: <a href="mailto:kiran.rajan@peoplelabsconsulting.com" className="text-sky-600 font-semibold hover:text-sky-700">kiran.rajan@peoplelabsconsulting.com</a>
              </p>
              <p className="text-slate-500">
                Business Hours: 9:00 a.m. – 5:00 p.m. (MST / EST)
              </p>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => scrollTo('hero')} className="hover:text-sky-600 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('about')} className="hover:text-sky-600 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('sectors')} className="hover:text-sky-600 transition-colors">
                  Client Sectors
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('services')} className="hover:text-sky-600 transition-colors">
                  Practice Areas & Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('careers')} className="hover:text-sky-600 transition-colors">
                  Careers
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('contact')} className="hover:text-sky-600 transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Practice Focus */}
          <div className="lg:col-span-3">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">
              Core Applications
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>PeopleSoft FSCM (Financials & Supply Chain)</li>
              <li>PeopleSoft HCM (Human Capital Management)</li>
              <li>PeopleSoft Campus Solutions</li>
              <li>PeopleSoft nVision & BI Publisher</li>
              <li>Oracle Cloud Infrastructure (OCI)</li>
              <li>24/7 Managed Production Support</li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-sky-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} PeopleLabs Consulting Inc. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <span>Edmonton, Alberta, Canada</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
