import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface UserAuthModalProps {
  onClose: () => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({ onClose }) => {
  const {
    currentUser,
    setCurrentUser,
    allUsers,
    listings,
    bookingRequests,
    setIsMerchantDashboardOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'switch_demo' | 'my_listings'>('profile');

  const myListings = listings.filter((l) => l.authorId === currentUser.id);
  const myBookings = bookingRequests.filter((b) => b.customerEmail === currentUser.email);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white border border-[#E5E7E1] rounded-3xl shadow-xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#F8F8F5] border-b border-[#E5E7E1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-[#193C32]" />
            <h2 className="text-sm font-bold text-[#202522]">Area Utente & Profilo</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777B76] hover:text-[#202522] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 bg-white border-b border-[#E5E7E1] flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'profile' ? 'border-[#193C32] text-[#193C32]' : 'border-transparent text-[#777B76]'
            }`}
          >
            Il Mio Profilo
          </button>
          <button
            onClick={() => setActiveTab('my_listings')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'my_listings' ? 'border-[#193C32] text-[#193C32]' : 'border-transparent text-[#777B76]'
            }`}
          >
            I Miei Annunci ({myListings.length})
          </button>
          <button
            onClick={() => setActiveTab('switch_demo')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'switch_demo' ? 'border-[#193C32] text-[#193C32]' : 'border-transparent text-[#777B76]'
            }`}
          >
            Cambia Account / Ruolo
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#F8F8F5] border border-[#E5E7E1]">
                <div className="w-12 h-12 rounded-2xl bg-[#E8EFEA] text-[#193C32] flex items-center justify-center font-bold text-lg border border-[#193C32]/20">
                  {currentUser.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#202522] text-sm">{currentUser.name}</span>
                    {currentUser.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-[#193C32]" />
                    )}
                  </div>
                  <div className="text-[#777B76]">{currentUser.email}</div>
                  <div className="text-[11px] text-[#193C32] uppercase font-mono mt-0.5 font-bold">
                    Ruolo: {currentUser.role}
                  </div>
                </div>
              </div>

              {/* Direct Access to Merchant Dashboard */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsMerchantDashboardOpen(true);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 bg-[#193C32] hover:bg-[#244D40] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Apri Pannello Gestione Inserzionisti</span>
                </button>
              </div>

              {myBookings.length > 0 && (
                <div className="space-y-2">
                  <div className="font-semibold text-[#202522] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#193C32]" />
                    <span>Le tue Prenotazioni SPA:</span>
                  </div>
                  {myBookings.map((b) => (
                    <div key={b.id} className="p-3 bg-[#F8F8F5] rounded-xl border border-[#E5E7E1]">
                      <div className="font-bold text-[#202522]">{b.businessName}</div>
                      <div className="text-[#777B76] text-[11px]">{b.serviceName} · {b.date} alle {b.timeSlot}</div>
                      <span className="text-[#193C32] font-mono text-[10px] uppercase font-bold mt-1 inline-block">
                        Stato: {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'my_listings' && (
            <div className="space-y-3">
              {myListings.length === 0 ? (
                <div className="text-center py-8 text-[#777B76]">
                  Nessun annuncio pubblicato con questo account.
                </div>
              ) : (
                myListings.map((l) => (
                  <div key={l.id} className="p-3.5 rounded-xl bg-[#F8F8F5] border border-[#E5E7E1] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#202522] truncate max-w-xs">{l.title}</div>
                      <div className="text-[#777B76] text-[11px]">{l.cityId.toUpperCase()} · Stato: {l.status}</div>
                    </div>
                    <span className="text-[#193C32] font-mono font-bold">
                      {l.viewsCount} visualizzazioni
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'switch_demo' && (
            <div className="space-y-3">
              <p className="text-[#777B76] text-[11px]">
                Seleziona uno dei profili predefiniti per testare i diversi permessi:
              </p>

              <div className="space-y-2">
                {allUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
                      currentUser.id === u.id
                        ? 'bg-[#E8EFEA] border-[#193C32] text-[#202522]'
                        : 'bg-white border-[#E5E7E1] text-[#777B76] hover:border-[#193C32]/40'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-[#202522] flex items-center gap-1.5">
                        <span>{u.name}</span>
                        {u.role === 'admin' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-[#193C32]" />
                        )}
                      </div>
                      <div className="text-[#777B76] text-[11px]">{u.email}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F8F8F5] text-[#193C32] uppercase font-bold border border-[#E5E7E1]">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
