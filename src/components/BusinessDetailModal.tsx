import React from 'react';
import { Business } from '../types';
import { useApp } from '../context/AppContext';
import { getGoogleMapsNavigationUrl } from '../utils/geo';
import {
  X,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  Star,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface BusinessDetailModalProps {
  business: Business;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
  business,
  onClose,
  onOpenBooking,
}) => {
  const { selectedCity } = useApp();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white border border-[#E5E7E1] rounded-3xl shadow-xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-[#777B76] hover:text-[#202522] border border-[#E5E7E1] shadow-xs transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero image banner */}
        <div className="relative aspect-[16/9] w-full bg-[#F8F8F5] overflow-hidden">
          {business.images && business.images[0] ? (
            <img
              src={business.images[0]}
              alt={business.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#777B76]">
              Immagine Centro
            </div>
          )}

          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <span className="bg-[#193C32] text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
              Centro Benessere Autorizzato
            </span>
            <div className="flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-md border border-[#E5E7E1] text-xs text-[#202522] font-semibold">
              <Star className="w-3.5 h-3.5 fill-[#193C32] text-[#193C32]" />
              <span>{business.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Header Title & Address */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#202522]">
                {business.name}
              </h2>
              {business.verified && (
                <span title="Verificato">
                  <CheckCircle2 className="w-5 h-5 text-[#193C32] shrink-0" />
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#777B76] mt-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#193C32]" />
                <span className="text-[#202522]">{business.address}</span>
                <span>({business.district || selectedCity.name})</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#777B76]" />
                <span>{business.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#F8F8F5] p-5 rounded-2xl border border-[#E5E7E1] text-xs sm:text-sm text-[#202522] leading-relaxed font-normal">
            {business.description}
          </div>

          {/* Sanitation badge */}
          <div className="p-4 rounded-2xl bg-[#E8EFEA] border border-[#193C32]/20 flex items-center gap-3 text-xs text-[#202522]">
            <ShieldCheck className="w-5 h-5 text-[#193C32] shrink-0" />
            <div>
              <div className="font-bold text-[#193C32]">Igiene Certificata & Cabine Riservate</div>
              <div className="text-[#777B76] text-[11px] mt-0.5">
                Ambienti igienizzati dopo ogni seduta, teli monouso e docce private in ogni cabina.
              </div>
            </div>
          </div>

          {/* Services List */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#202522] uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#193C32]" />
              <span>Menu dei Trattamenti Disponibili:</span>
            </div>

            <div className="space-y-2">
              {business.services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-3.5 rounded-xl bg-[#F8F8F5] border border-[#E5E7E1] flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-semibold text-xs text-[#202522]">{srv.name}</div>
                    <div className="text-[11px] text-[#777B76] mt-0.5">
                      Durata: {srv.durationMin} min · {srv.description}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[#193C32] font-bold font-mono text-sm">
                      €{srv.priceEur}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact and Direct Action Buttons */}
          <div className="pt-4 border-t border-[#E5E7E1] grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="py-3 px-4 bg-[#193C32] hover:bg-[#244D40] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all sm:col-span-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Richiedi Appuntamento Online</span>
            </button>

            <a
              href={getGoogleMapsNavigationUrl(business.lat, business.lng, business.name)}
              target="_blank"
              rel="noreferrer noopener"
              className="py-3 px-4 bg-white hover:bg-[#F8F8F5] text-[#202522] font-medium text-xs rounded-xl border border-[#E5E7E1] flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#777B76]" />
              <span>Google Maps</span>
            </a>
          </div>

          {/* Direct phone / whatsapp row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-[#777B76]">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#193C32]" />
              <span className="font-mono text-[#202522] font-medium">{business.phone}</span>
            </div>
            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[#193C32] hover:underline flex items-center gap-1 font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Diretto
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
