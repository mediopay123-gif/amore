import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Business } from '../types';
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  User as UserIcon,
} from 'lucide-react';

interface SpaBookingModalProps {
  business: Business;
  onClose: () => void;
}

export const SpaBookingModal: React.FC<SpaBookingModalProps> = ({ business, onClose }) => {
  const { addBookingRequest, currentUser } = useApp();

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    business.services[0]?.id || ''
  );
  const [date, setDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState<string>('15:00');
  const [customerName, setCustomerName] = useState<string>(currentUser.name);
  const [customerPhone, setCustomerPhone] = useState<string>(currentUser.phone || '+39 ');
  const [customerEmail, setCustomerEmail] = useState<string>(currentUser.email);
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedService =
    business.services.find((s) => s.id === selectedServiceId) || business.services[0];

  const timeSlots = [
    '10:30',
    '11:30',
    '14:00',
    '15:00',
    '16:30',
    '18:00',
    '19:30',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Inserisci il tuo nome e cognome.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      setErrorMessage('Inserisci un recapito telefonico valido per la conferma del centro.');
      return;
    }
    if (!date) {
      setErrorMessage('Seleziona una data per la seduta.');
      return;
    }

    addBookingRequest({
      businessId: business.id,
      businessName: business.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      priceEur: selectedService.priceEur,
      customerName,
      customerPhone,
      customerEmail,
      date,
      timeSlot,
      notes: notes.trim() || undefined,
    });

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white border border-[#E5E7E1] rounded-3xl shadow-xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#F8F8F5] border-b border-[#E5E7E1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#193C32]" />
            <div>
              <h2 className="text-base font-bold text-[#202522]">Richiesta di Prenotazione</h2>
              <div className="text-xs text-[#777B76] truncate max-w-sm">{business.name}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777B76] hover:text-[#202522] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#E8EFEA] border border-[#193C32]/30 text-[#193C32] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#202522]">Richiesta Inviata al Centro!</h3>
            <p className="text-xs text-[#777B76] max-w-md mx-auto">
              La tua richiesta per <strong className="text-[#202522]">{selectedService.name}</strong> per il giorno <strong className="text-[#202522]">{date}</strong> alle ore <strong className="text-[#202522]">{timeSlot}</strong> è stata inoltrata. Il centro ti contatterà al <strong className="text-[#193C32]">{customerPhone}</strong> per la conferma definitiva.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Select Service */}
            <div>
              <label className="block font-semibold text-[#202522] mb-1.5">
                Seleziona il Trattamento o Massaggio:
              </label>
              <div className="space-y-2">
                {business.services.map((srv) => (
                  <label
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      selectedServiceId === srv.id
                        ? 'bg-[#E8EFEA] border-[#193C32] text-[#202522]'
                        : 'bg-white border-[#E5E7E1] text-[#202522] hover:border-[#193C32]/40'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{srv.name}</div>
                      <div className="text-[11px] text-[#777B76]">
                        Durata: {srv.durationMin} minuti · {srv.description}
                      </div>
                    </div>
                    <span className="font-mono text-[#193C32] font-bold text-sm shrink-0 ml-3">
                      €{srv.priceEur}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date and Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-[#202522] mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#193C32]" />
                  <span>Data Desiderata *</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] font-mono focus:outline-none focus:border-[#193C32]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#202522] mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#193C32]" />
                  <span>Orario Disponibile *</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] font-mono focus:outline-none focus:border-[#193C32]"
                >
                  {timeSlots.map((ts) => (
                    <option key={ts} value={ts}>
                      {ts}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="pt-2 border-t border-[#E5E7E1] space-y-3">
              <div className="font-semibold text-[#202522]">I tuoi Dati:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-[#777B76] mb-1">
                    <UserIcon className="w-3 h-3 text-[#777B76]" />
                    <span>Nome e Cognome *</span>
                  </div>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Mario Rossi"
                    className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] focus:outline-none focus:border-[#193C32]"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1 text-[11px] text-[#777B76] mb-1">
                    <Phone className="w-3 h-3 text-[#193C32]" />
                    <span>Telefono Cellulare *</span>
                  </div>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+39 340 000000"
                    className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] font-mono focus:outline-none focus:border-[#193C32]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-[11px] text-[#777B76] mb-1">
                  <Mail className="w-3 h-3 text-[#777B76]" />
                  <span>Email di Conferma</span>
                </div>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="mario.rossi@example.com"
                  className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] focus:outline-none focus:border-[#193C32]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#777B76] mb-1">
                  Note aggiuntive (Opzionale):
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Preferenze particolari, pressione del massaggio..."
                  className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] focus:outline-none focus:border-[#193C32]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#E5E7E1] flex items-center justify-between">
              <div className="text-[#777B76] text-[11px]">
                Totale: <span className="font-mono text-[#193C32] font-bold">€{selectedService.priceEur}</span> (pagamento in loco)
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#193C32] hover:bg-[#244D40] text-white font-semibold rounded-xl transition-all shadow-xs"
              >
                Invia Richiesta
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
