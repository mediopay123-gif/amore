/**
 * Amico AI Copywriting & Marketing Generator Studio
 * Produces compliant, alluring, high-converting Italian listing and advertising copy.
 */

export interface CopyGenerationRequest {
  category: string;
  nameOrAlias: string;
  districtOrCity: string;
  tone: 'elegante' | 'discreto' | 'solare' | 'professionale';
  amenities: string[];
  keyHighlights: string;
}

export function generateListingCopy(req: CopyGenerationRequest): { title: string; description: string; tags: string[] } {
  const { category, nameOrAlias, districtOrCity, tone, amenities, keyHighlights } = req;
  const name = nameOrAlias.trim() || 'Sofia';
  const place = districtOrCity.trim() || 'Centro';

  let title = '';
  let description = '';
  let tags: string[] = [];

  const amenitiesList = amenities.length > 0 ? amenities.join(', ') : 'ambiente climatizzato, doccia, massima riservatezza';

  if (category === 'massaggi_spa' || tone === 'professionale') {
    title = `${name} – Oasi di Benessere & Massaggi Rigeneranti a ${place}`;
    description = `Benvenuti in un santuario dedicato all'equilibrio e alla serenità. Nel nostro spazio a ${place}, offriamo trattamenti esclusivi eseguiti con oli essenziali biologici e tecniche olistiche mirate a sciogliere ogni tensione fisica e mentale.

I nostri servizi includono:
· Massaggio rilassante profondo e antistress
· Trattamenti personalizzati con aromaterapia
· Cabine sanificate e dotate di ogni comfort (${amenitiesList})
${keyHighlights ? `Nota speciale: ${keyHighlights}\n` : ''}
Riceviamo su appuntamento per garantire ad ogni ospite il massimo della riservatezza e della tranquillità. Contattaci per concordare la tua pausa di relax.`;
    tags = ['Benessere', 'Oli Caldi', 'Doccia', 'Privacy Totale', place];
  } else if (tone === 'elegante') {
    title = `${name} – Raffinatezza, classe e momenti indimenticabili a ${place}`;
    description = `Ciao, sono ${name}. Una presenza sofisticata, curata ed accogliente, ideale per chi cerca una compagnia garbata, intelligente e riservata a ${place}.

Nel mio appartamento privato troverai un ambiente intimo, igienizzato e rilassante (${amenitiesList}).
Amo conversare, condividere un calice di vino e dedicare il giusto tempo senza alcuna fretta.
${keyHighlights ? `Particolarità: ${keyHighlights}\n` : ''}
Gradita la massima educazione e reciproco rispetto. Contattami con preavviso per organizzare il nostro incontro.`;
    tags = ['Elegante', 'Appartamento privato', 'Discrezione', 'Foto Reali', place];
  } else if (tone === 'discreto') {
    title = `${name} – Dolcezza e massima riservatezza a ${place}`;
    description = `Ciao a tutti, sono ${name}. Se stai cercando una parentesi di evasione in un ambiente tranquillo, riservato e pulitissimo a ${place}, sei nel posto giusto.

L'ambiente è accogliente e dotato di tutti i comfort (${amenitiesList}).
${keyHighlights ? `${keyHighlights}\n` : ''}
Garantisco e richiedo pulizia impeccabile e serietà. No numeri anonimi. A presto!`;
    tags = ['Discrezione', 'Riservatezza', 'Climatizzato', place];
  } else {
    // solare
    title = `${name} – Solare, affascinante e pronta a farti sorridere a ${place}`;
    description = `Ciao! Mi chiamo ${name}, ragazza solare, simpatica e sempre con il sorriso. Ricevo in un bellissimo ambiente a ${place}, dove potrai sentirti subito a tuo agio tra musica rilassante e profumi gradevoli.

Dotazioni: ${amenitiesList}.
${keyHighlights ? `Cosa mi piace: ${keyHighlights}\n` : ''}
Chiamami o inviami un messaggio su WhatsApp per tutti i dettagli. Ti aspetto con entusiasmo!`;
    tags = ['Solare', 'WhatsApp', 'Complicità', place];
  }

  return { title, description, tags };
}

export function generateAdCampaignHeadline(type: string, city: string): string {
  switch (type) {
    case 'vetrina_home':
      return `Vetrina Esclusiva ${city} – I Migliori Annunci Verificati della Settimana`;
    case 'top_city':
      return `Top Inserzionisti a ${city} – In cima alla bacheca e su Google Maps`;
    case 'category_spotlight':
      return `Speciale Benessere & Incontri a ${city} – Scopri le novità nelle vicinanze`;
    default:
      return `Promozione Sponsorizzata ${city}`;
  }
}
