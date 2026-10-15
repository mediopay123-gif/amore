import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PromotionTier } from '../types';
import {
  X,
  Upload,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Eye,
  AlertCircle,
  Wand2,
} from 'lucide-react';
import { generateListingCopy } from '../utils/aiStudio';

interface PostAdModalProps {
  onClose: () => void;
}

export const PostAdModal: React.FC<PostAdModalProps> = ({ onClose }) => {
  const {
    cities,
    categories,
    selectedCity,
    addListing,
    currentUser,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [cityId, setCityId] = useState<string>(selectedCity.id);
  const [categoryId, setCategoryId] = useState<string>('escort');
  const [subcategoryId, setSubcategoryId] = useState<string>('Indipendente');
  const [district, setDistrict] = useState<string>('Centro');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [ratePerHour, setRatePerHour] = useState<number>(100);
  const [phone, setPhone] = useState<string>(currentUser.phone || '+39 34');
  const [whatsapp, setWhatsapp] = useState<string>(currentUser.phone || '+39 34');
  const [telegram, setTelegram] = useState<string>('');
  const [images, setImages] = useState<string[]>([
    '/src/assets/images/verified_profile_preview_1792082231358.jpg',
  ]);
  const [promotionTier, setPromotionTier] = useState<PromotionTier>('top_city');
  const [tagInput, setTagInput] = useState<string>('Disponibile ora, Appartamento privato, Riservatezza');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [selectedTone, setSelectedTone] = useState<'elegante' | 'discreto' | 'solare' | 'professionale'>('elegante');

  const selectedCategoryObj = categories.find((c) => c.id === categoryId) || categories[0];
  const selectedCityObj = cities.find((c) => c.id === cityId) || cities[0];

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Il file immagine supera il limite di 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImages([uploadEvent.target.result as string, ...images]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiGenerate = () => {
    const generated = generateListingCopy({
      category: categoryId,
      nameOrAlias: currentUser.name.split(' ')[0],
      districtOrCity: district || selectedCityObj.name,
      tone: selectedTone,
      amenities: ['aria condizionata', 'doccia privata', 'massima pulizia'],
      keyHighlights: 'Foto 100% autentiche e recenti',
    });

    setTitle(generated.title);
    setDescription(generated.description);
    setTagInput(generated.tags.join(', '));
  };

  const handleNext = () => {
    setErrorMessage(null);
    if (step === 1) {
      if (!title.trim() || title.length < 10) {
        setErrorMessage('Inserisci un titolo descrittivo di almeno 10 caratteri.');
        return;
      }
      if (!district.trim()) {
        setErrorMessage('Specifica il quartiere o la zona della città.');
        return;
      }
    }
    if (step === 2) {
      if (!description.trim() || description.length < 30) {
        setErrorMessage('La descrizione deve essere di almeno 30 caratteri.');
        return;
      }
    }
    setStep((s) => (s + 1) as any);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const spamWords = ['free money', 'bitcoin hack', 'casino online', 'minorenne'];
    const lowerContent = (title + ' ' + description).toLowerCase();
    for (const word of spamWords) {
      if (lowerContent.includes(word)) {
        setErrorMessage('Il testo inserito contiene termini contrari alle linee guida.');
        return;
      }
    }

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addListing({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId,
      subcategoryId,
      cityId,
      district,
      address: `Zona ${district}, ${selectedCityObj.name}`,
      lat: selectedCityObj.lat + (Math.random() - 0.5) * 0.03,
      lng: selectedCityObj.lng + (Math.random() - 0.5) * 0.03,
      description,
      images,
      ratePerHour: ratePerHour > 0 ? ratePerHour : undefined,
      phone: phone.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      telegram: telegram.trim() || undefined,
      verified: true,
      authorId: currentUser.id,
      authorName: currentUser.name,
      status: 'active',
      promotionTier,
      tags,
    });

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white border border-[#E5E7E1] rounded-3xl shadow-xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#F8F8F5] border-b border-[#E5E7E1] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#202522] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#193C32]" />
              <span>Pubblica Annuncio su AMICA</span>
            </h2>
            <div className="text-xs text-[#777B76] mt-0.5">
              Passaggio {step} di 4: {step === 1 ? 'Categoria e Città' : step === 2 ? 'Contenuto & Assistente AI' : step === 3 ? 'Foto e Contatti' : 'Promozione & Conferma'}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777B76] hover:text-[#202522] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Splash */}
        {isSuccess ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-[#E8EFEA] text-[#193C32] rounded-full flex items-center justify-center mx-auto border border-[#193C32]/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#202522]">Annuncio Pubblicato con Successo!</h3>
            <p className="text-xs text-[#777B76] max-w-md mx-auto">
              Il tuo annuncio è ora online a {selectedCityObj.name} nella categoria {selectedCategoryObj.name} ed è immediatamente visibile su mappa e nei risultati di ricerca.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            
            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: Category & City */}
            {step === 1 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City Selection */}
                  <div>
                    <label className="block font-semibold text-[#202522] mb-1.5">
                      Città Principale *
                    </label>
                    <select
                      value={cityId}
                      onChange={(e) => setCityId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] focus:outline-none focus:border-[#193C32]"
                    >
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.region})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block font-semibold text-[#202522] mb-1.5">
                      Quartiere / Zona *
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="es. Centro Storico, Saragozza..."
                      className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] focus:outline-none focus:border-[#193C32]"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block font-semibold text-[#202522] mb-1.5">
                    Sezione / Categoria *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategoryId(cat.id);
                          setSubcategoryId(cat.subcategories[1] || cat.subcategories[0]);
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                          categoryId === cat.id
                            ? 'bg-[#E8EFEA] border-[#193C32] text-[#193C32] font-bold'
                            : 'bg-white border-[#E5E7E1] text-[#777B76] hover:border-[#193C32]/30'
                        }`}
                      >
                        <div className="font-semibold">{cat.name}</div>
                        <div className="text-[10px] text-[#777B76] font-normal truncate">{cat.subtitle}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategory */}
                <div>
                  <label className="block font-semibold text-[#202522] mb-1.5">
                    Sotto-categoria
                  </label>
                  <select
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] focus:outline-none focus:border-[#193C32]"
                  >
                    {selectedCategoryObj.subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block font-semibold text-[#202522] mb-1.5">
                    Titolo dell'Annuncio *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="es. Sofia – Elegante e riservata in centro storico, ambiente climatizzato"
                    className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] focus:outline-none focus:border-[#193C32]"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Description & AI Writing */}
            {step === 2 && (
              <div className="space-y-4 text-xs">
                
                {/* AI Assistant Banner */}
                <div className="p-3.5 bg-[#F8F8F5] border border-[#E5E7E1] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#193C32] flex items-center gap-1.5">
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>AMICA AI Copywriting Studio</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAiGenerate}
                      className="px-3 py-1 bg-[#193C32] hover:bg-[#244D40] text-white font-semibold rounded-lg text-[11px] shadow-xs"
                    >
                      Genera Testo
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#777B76]">
                    <span>Tono desiderato:</span>
                    {(['elegante', 'discreto', 'solare', 'professionale'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTone(t)}
                        className={`capitalize px-2 py-0.5 rounded transition-colors ${
                          selectedTone === t
                            ? 'bg-[#E8EFEA] text-[#193C32] font-bold border border-[#193C32]/30'
                            : 'text-[#777B76] hover:text-[#202522]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description Textarea */}
                <div>
                  <label className="block font-semibold text-[#202522] mb-1.5">
                    Descrizione Completa *
                  </label>
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Presentati, descrivi l'ambiente, i comfort disponibili e le modalità di accoglienza..."
                    className="w-full p-3 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] focus:outline-none focus:border-[#193C32] leading-relaxed"
                  />
                  <div className="text-[11px] text-[#777B76] flex justify-between mt-1">
                    <span>Minimo 30 caratteri</span>
                    <span>{description.length} caratteri</span>
                  </div>
                </div>

                {/* Rate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#202522] mb-1.5">
                      Tariffa Indicativa (€ / ora)
                    </label>
                    <input
                      type="number"
                      value={ratePerHour}
                      onChange={(e) => setRatePerHour(Number(e.target.value))}
                      min={0}
                      step={10}
                      className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] font-mono focus:outline-none focus:border-[#193C32]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202522] mb-1.5">
                      Caratteristiche (separate da virgola)
                    </label>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="es. Doccia, Climatizzato, Fuori sede..."
                      className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] focus:outline-none focus:border-[#193C32]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Images & Contacts */}
            {step === 3 && (
              <div className="space-y-4 text-xs">
                {/* Photos */}
                <div>
                  <label className="block font-semibold text-[#202522] mb-1.5">
                    Fotografie dell'Annuncio
                  </label>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#E5E7E1] group">
                        <img src={img} alt="Foto annuncio" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 rounded text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    <label className="aspect-[4/3] rounded-xl border-2 border-dashed border-[#E5E7E1] hover:border-[#193C32] bg-[#F8F8F5] flex flex-col items-center justify-center cursor-pointer transition-colors text-[#777B76] hover:text-[#193C32] p-2 text-center">
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-semibold">Carica Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-[#777B76]">
                    Formati ammessi JPG, PNG, WebP fino a 5MB. Vietate foto non autorizzate o di terzi.
                  </p>
                </div>

                {/* Contacts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block font-semibold text-[#202522] mb-1">
                      Numero di Telefono *
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+39 340 000 0000"
                      className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] focus:outline-none focus:border-[#193C32] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202522] mb-1">
                      WhatsApp (Opzionale)
                    </label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+39 340 000 0000"
                      className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] focus:outline-none focus:border-[#193C32] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202522] mb-1">
                      Telegram Username
                    </label>
                    <input
                      type="text"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="@username"
                      className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] focus:outline-none focus:border-[#193C32]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Promotion & Summary */}
            {step === 4 && (
              <div className="space-y-4 text-xs">
                <div className="font-semibold text-[#202522] mb-2">
                  Seleziona il Livello di Visibilità dell'Annuncio:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'none',
                      title: 'Standard',
                      price: 'Gratuito',
                      desc: 'Pubblicazione ordinaria nell\'elenco della città.',
                    },
                    {
                      id: 'highlighted',
                      title: 'In Evidenza',
                      price: '€15 / mese',
                      desc: 'Bordo verde scuro e priorità nella ricerca per quartiere.',
                    },
                    {
                      id: 'top_city',
                      title: 'Top di Città',
                      price: '€40 / mese',
                      desc: 'In cima alla città, pin primario sulla mappa radar e massima visibilità.',
                    },
                  ].map((tier) => (
                    <div
                      key={tier.id}
                      onClick={() => setPromotionTier(tier.id as any)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        promotionTier === tier.id
                          ? 'bg-[#E8EFEA] border-[#193C32] text-[#202522] ring-2 ring-[#193C32]/10'
                          : 'bg-white border-[#E5E7E1] text-[#777B76] hover:border-[#193C32]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{tier.title}</span>
                        <span className="text-[11px] font-mono text-[#193C32] font-bold">{tier.price}</span>
                      </div>
                      <p className="text-[11px] text-[#777B76] mt-1 leading-normal font-normal">
                        {tier.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Summary Card */}
                <div className="p-4 rounded-2xl bg-[#F8F8F5] border border-[#E5E7E1] text-xs space-y-1.5">
                  <div className="font-bold text-[#202522] flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#193C32]" />
                    <span>Riepilogo Scheda:</span>
                  </div>
                  <div className="text-[#202522] font-semibold">{title}</div>
                  <div className="text-[#777B76]">
                    {selectedCityObj.name} · {district} · Categoria: {selectedCategoryObj.name}
                  </div>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-[#E5E7E1] flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as any)}
                  className="px-4 py-2 bg-white hover:bg-[#F8F8F5] text-[#777B76] text-xs font-semibold rounded-xl border border-[#E5E7E1] flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Indietro</span>
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 bg-[#193C32] hover:bg-[#244D40] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Continua</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#193C32] hover:bg-[#244D40] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Conferma e Pubblica</span>
                </button>
              )}
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
