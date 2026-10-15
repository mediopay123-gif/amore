import React from 'react';
import { useApp } from '../context/AppContext';
import { Business } from '../types';
import { Sparkles, Calendar, Star, Clock, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';

export const BusinessSection: React.FC = () => {
  const {
    filteredBusinesses,
    selectedCity,
    setActiveBusiness,
    setIsBookingModalOpen,
  } = useApp();

  return (
    <section id="benessere-section" className="py-12 border-t border-[#E5E7E1] bg-[#F8F8F5]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#193C32] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Centri Benessere e Trattamenti Esclusivi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#202522] tracking-tight">
              Massaggi & SPA a {selectedCity.name}
            </h2>
            <p className="mt-1 text-sm text-[#777B76]">
              Operatori professionali, cabine private, percorsi benessere e prenotazione diretta.
            </p>
          </div>

          <div className="text-xs text-[#777B76]">
            {filteredBusinesses.length} centri autorizzati
          </div>
        </div>

        {/* Business Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBusinesses.map((biz) => (
            <div
              key={biz.id}
              className="rounded-2xl bg-white border border-[#E5E7E1] hover:border-[#193C32]/40 transition-all p-6 shadow-xs flex flex-col justify-between group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[#202522] group-hover:text-[#193C32] transition-colors">
                        {biz.name}
                      </h3>
                      {biz.verified && (
                        <span title="Centro Certificato">
                          <CheckCircle2 className="w-4 h-4 text-[#193C32] shrink-0" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#777B76] mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#777B76] shrink-0" />
                      <span>{biz.address}</span>
                      <span className="text-[#E5E7E1]">·</span>
                      <span className="text-[#193C32] font-medium">{biz.district}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 bg-[#F8F8F5] px-2.5 py-1 rounded-lg border border-[#E5E7E1] text-xs text-[#202522] font-semibold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-[#193C32] text-[#193C32]" />
                    <span>{biz.rating.toFixed(1)}</span>
                    <span className="text-[#777B76] font-normal text-[11px]">({biz.reviewsCount})</span>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs text-[#777B76] leading-relaxed line-clamp-2 font-normal">
                  {biz.description}
                </p>

                {/* Operating hours */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#777B76]">
                  <Clock className="w-3.5 h-3.5 text-[#777B76]" />
                  <span>{biz.openingHours}</span>
                </div>

                {/* Services Preview list */}
                <div className="mt-4 pt-3 border-t border-[#E5E7E1] space-y-2">
                  <div className="text-[11px] font-semibold text-[#777B76] uppercase tracking-wider">
                    Servizi e Tariffe:
                  </div>
                  {biz.services.slice(0, 3).map((srv) => (
                    <div
                      key={srv.id}
                      className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-[#F8F8F5] border border-[#E5E7E1]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#202522] font-medium">{srv.name}</span>
                        <span className="text-[#777B76] text-[11px]">({srv.durationMin} min)</span>
                      </div>
                      <span className="text-[#193C32] font-bold font-mono">€{srv.priceEur}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-3 border-t border-[#E5E7E1] flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveBusiness(biz);
                    setIsBookingModalOpen(true);
                  }}
                  className="flex-1 py-2 px-3 bg-[#193C32] hover:bg-[#244D40] text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Richiedi Prenotazione</span>
                </button>

                <button
                  onClick={() => setActiveBusiness(biz)}
                  className="py-2 px-3 bg-white hover:bg-[#F8F8F5] text-[#202522] text-xs font-medium rounded-xl border border-[#E5E7E1] flex items-center gap-1 transition-colors"
                >
                  <span>Dettagli</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
