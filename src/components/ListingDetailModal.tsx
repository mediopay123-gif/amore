import React, { useState } from 'react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { formatDistance, getGoogleMapsNavigationUrl } from '../utils/geo';
import {
  X,
  MapPin,
  CheckCircle2,
  Phone,
  MessageCircle,
  Flag,
  Share2,
  ExternalLink,
  ShieldAlert,
  Send,
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: Listing;
  onClose: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose }) => {
  const {
    startConversation,
    submitReport,
    selectedCity,
  } = useApp();

  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<'spam' | 'fake' | 'underage' | 'fraud' | 'other'>('spam');
  const [reportComment, setReportComment] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSendQuickMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessage.trim()) return;
    startConversation(listing.id, listing.authorName, quickMessage);
    setQuickMessage('');
    onClose();
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport('listing', listing.id, listing.title, reportReason, reportComment);
    setReportSubmitted(true);
    setTimeout(() => {
      setIsReportOpen(false);
      setReportSubmitted(false);
    }, 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white border border-[#E5E7E1] rounded-3xl shadow-xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-[#777B76] hover:text-[#202522] border border-[#E5E7E1] shadow-xs transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Image Preview Banner */}
        <div className="relative aspect-[16/9] w-full bg-[#F8F8F5] overflow-hidden">
          {listing.images && listing.images[0] ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#777B76] text-sm">
              Nessuna immagine fornita
            </div>
          )}

          {listing.promotionTier === 'top_city' && (
            <div className="absolute top-4 left-4 bg-[#193C32] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
              Top di Città · In Evidenza
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5E7E1] text-xs text-[#777B76]">
            <div className="flex items-center gap-2">
              <span className="text-[#193C32] font-semibold">{selectedCity.name}</span>
              <span>·</span>
              <span className="text-[#202522]">{listing.district}</span>
              <span>·</span>
              <span>{listing.subcategoryId}</span>
              {listing.distanceKm != null && (
                <>
                  <span>·</span>
                  <span className="font-mono text-[#193C32] font-medium">{formatDistance(listing.distanceKm)}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="hover:text-[#202522] transition-colors flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copiato!' : 'Condividi'}</span>
              </button>

              <button
                onClick={() => setIsReportOpen(!isReportOpen)}
                className="hover:text-rose-600 transition-colors flex items-center gap-1 text-[#777B76]"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Segnala</span>
              </button>
            </div>
          </div>

          {/* Report Drawer if triggered */}
          {isReportOpen && (
            <form
              onSubmit={handleReportSubmit}
              className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-3 animate-in fade-in"
            >
              <div className="font-bold text-rose-800">Segnala questo annuncio alla moderazione:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'spam', label: 'Spam' },
                  { id: 'fake', label: 'Profilo Fake' },
                  { id: 'underage', label: 'Minorenne' },
                  { id: 'fraud', label: 'Truffa' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setReportReason(item.id as any)}
                    className={`p-2 rounded-lg border text-center transition-colors ${
                      reportReason === item.id
                        ? 'bg-rose-600 text-white border-rose-600 font-bold'
                        : 'bg-white text-[#202522] border-[#E5E7E1]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={reportComment}
                onChange={(e) => setReportComment(e.target.value)}
                placeholder="Dettagli per il team di moderazione..."
                className="w-full px-3 py-2 bg-white border border-rose-200 rounded-lg text-[#202522] placeholder-[#777B76]"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportOpen(false)}
                  className="px-3 py-1.5 text-[#777B76] hover:text-[#202522]"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors"
                >
                  {reportSubmitted ? 'Inviato!' : 'Invia'}
                </button>
              </div>
            </form>
          )}

          {/* Title and Author Header */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm font-semibold text-[#202522]">{listing.authorName}</span>
              {listing.verified && (
                <span className="flex items-center gap-1 text-xs text-[#193C32] font-medium" title="Identità e foto verificate">
                  <CheckCircle2 className="w-4 h-4" />
                  Verificato
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#202522] leading-tight">
              {listing.title}
            </h2>

            {listing.ratePerHour != null && listing.ratePerHour > 0 && (
              <div className="mt-2 text-base font-bold text-[#193C32] font-mono">
                €{listing.ratePerHour} <span className="text-xs text-[#777B76] font-sans font-normal">/ ora tariffa indicativa</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-[#F8F8F5] p-5 rounded-2xl border border-[#E5E7E1] text-xs sm:text-sm text-[#202522] leading-relaxed whitespace-pre-line font-normal">
            {listing.description}
          </div>

          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#777B76]">
              <span className="font-semibold text-[#202522]">Caratteristiche:</span>
              {listing.tags.map((tag, idx) => (
                <span key={idx} className="text-[#202522]">
                  {tag} {idx < listing.tags!.length - 1 ? '·' : ''}
                </span>
              ))}
            </div>
          )}

          {/* Contact & Location Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E5E7E1]">
            {/* Direct Phone / WhatsApp */}
            <div className="p-4 rounded-2xl bg-[#F8F8F5] border border-[#E5E7E1] space-y-3">
              <div className="text-xs font-bold text-[#202522] uppercase tracking-wider">
                Contatti:
              </div>

              {listing.phone && (
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-mono text-[#202522] font-semibold">
                    {phoneRevealed ? listing.phone : listing.phone.slice(0, 7) + '•••'}
                  </div>
                  {!phoneRevealed ? (
                    <button
                      onClick={() => setPhoneRevealed(true)}
                      className="px-3 py-1.5 bg-[#193C32] hover:bg-[#244D40] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
                    >
                      Mostra Numero
                    </button>
                  ) : (
                    <a
                      href={`tel:${listing.phone}`}
                      className="px-3 py-1.5 bg-[#193C32] hover:bg-[#244D40] text-white font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" /> Chiama
                    </a>
                  )}
                </div>
              )}

              {listing.whatsapp && (
                <a
                  href={`https://wa.me/${listing.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-full py-2 px-3 bg-white hover:bg-[#E8EFEA] text-[#193C32] border border-[#E5E7E1] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-[#193C32]" />
                  <span>WhatsApp Diretto</span>
                </a>
              )}
            </div>

            {/* Location & Navigation */}
            <div className="p-4 rounded-2xl bg-[#F8F8F5] border border-[#E5E7E1] space-y-3">
              <div className="text-xs font-bold text-[#202522] uppercase tracking-wider">
                Zona:
              </div>
              <div className="flex items-start gap-2 text-xs text-[#202522]">
                <MapPin className="w-4 h-4 text-[#193C32] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">{listing.district || selectedCity.name}</div>
                  <div className="text-[#777B76]">{listing.address || 'Quartiere ' + listing.district}</div>
                  <div className="text-[11px] text-[#777B76] mt-0.5">
                    Coordinate approssimate per tutela privacy
                  </div>
                </div>
              </div>

              <a
                href={getGoogleMapsNavigationUrl(listing.lat, listing.lng, listing.title)}
                target="_blank"
                rel="noreferrer noopener"
                className="w-full py-2 px-3 bg-white hover:bg-[#E8EFEA] text-[#202522] text-xs font-semibold rounded-xl border border-[#E5E7E1] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#777B76]" />
                <span>Indicazioni stradali su Google Maps</span>
              </a>
            </div>
          </div>

          {/* Quick Message Form */}
          <form
            onSubmit={handleSendQuickMessage}
            className="p-4 rounded-2xl bg-[#F8F8F5] border border-[#E5E7E1] space-y-3"
          >
            <div className="text-xs font-semibold text-[#202522]">
              Invia un messaggio privato a {listing.authorName}:
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={quickMessage}
                onChange={(e) => setQuickMessage(e.target.value)}
                placeholder="Scrivi qui il tuo messaggio (es. Buongiorno, sei disponibile oggi?)..."
                className="flex-1 px-4 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522] placeholder-[#777B76] focus:outline-none focus:border-[#193C32]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#193C32] hover:bg-[#244D40] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Invia</span>
              </button>
            </div>
          </form>

          {/* Legal / Safety Advisory */}
          <div className="p-4 rounded-2xl bg-[#E8EFEA] border border-[#193C32]/20 text-xs text-[#202522] space-y-1">
            <div className="flex items-center gap-1.5 text-[#193C32] font-semibold">
              <ShieldAlert className="w-4 h-4 text-[#193C32] shrink-0" />
              <span>Avviso di Sicurezza (18+)</span>
            </div>
            <p className="text-[11px] text-[#777B76] leading-relaxed">
              I servizi e gli incontri pubblicati sono destinati a persone maggiorenni consenzienti. È vietata la pubblicazione di contenuti non autorizzati, truffe o minori. Segnala tempestivamente qualsiasi anomalia.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
