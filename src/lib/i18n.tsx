"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Lightweight multilingual architecture for the prelaunch draft: English is
// canonical; Spanish and Italian dictionaries cover navigation, the mandatory
// disclosure, waitlist form and shared UI strings, with English fallback.
// Full page-level content translation is Pending Owner Input (approved legal
// translations). Legal wording: "Subject to professional legal review."

export type Locale = "en" | "es" | "it";
export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
];

const dict: Record<string, Partial<Record<Locale, string>>> = {
  "nav.howItWorks": { en: "How It Works", es: "Cómo Funciona", it: "Come Funziona" },
  "nav.assets": { en: "Assets", es: "Activos", it: "Asset" },
  "nav.verification": { en: "Verification", es: "Verificación", it: "Verifica" },
  "nav.tokenization": { en: "Tokenization", es: "Tokenización", it: "Tokenizzazione" },
  "nav.enterprise": { en: "Enterprise", es: "Empresas", it: "Enterprise" },
  "nav.documents": { en: "Documents", es: "Documentos", it: "Documenti" },
  "nav.waitlist": { en: "Join the Project Waitlist", es: "Únase a la Lista de Espera", it: "Iscriviti alla Lista d'Attesa" },
  // Compact header label — the full phrase does not fit alongside the primary
  // navigation on narrower desktop widths.
  "nav.waitlistShort": { en: "Join Waitlist", es: "Lista de Espera", it: "Lista d'Attesa" },
  "status.prelaunch": { en: "PRELAUNCH / INFORMATION PLATFORM", es: "PRELANZAMIENTO / PLATAFORMA INFORMATIVA", it: "PRELANCIO / PIATTAFORMA INFORMATIVA" },
  "status.swiss": {
    en: "Swiss corporate and issuance structure in development.",
    es: "Estructura corporativa y de emisión suiza en desarrollo.",
    it: "Struttura societaria e di emissione svizzera in fase di sviluppo.",
  },
  "disclosure.title": { en: "Mandatory Disclosure", es: "Divulgación Obligatoria", it: "Informativa Obbligatoria" },
  "disclosure.body": {
    en: "ReserveChain is currently in development. No tokens are being offered or sold through this website. Registration of interest does not constitute an investment, token purchase, asset reservation, price reservation, token allocation or entitlement to participate in any future offering. Any future availability will be subject to the final Swiss corporate and legal structure, definitive offering documentation, asset verification, custody arrangements, jurisdictional eligibility, KYC/KYB, sanctions screening and final approval.",
    es: "ReserveChain se encuentra actualmente en desarrollo. No se ofrecen ni venden tokens a través de este sitio web. El registro de interés no constituye una inversión, compra de tokens, reserva de activos, reserva de precio, asignación de tokens ni derecho a participar en ninguna oferta futura. Cualquier disponibilidad futura estará sujeta a la estructura corporativa y legal suiza definitiva, la documentación definitiva de la oferta, la verificación de activos, los acuerdos de custodia, la elegibilidad jurisdiccional, KYC/KYB, el control de sanciones y la aprobación final.",
    it: "ReserveChain è attualmente in fase di sviluppo. Nessun token viene offerto o venduto tramite questo sito web. La registrazione dell'interesse non costituisce un investimento, un acquisto di token, una prenotazione di asset, una prenotazione di prezzo, un'assegnazione di token né un diritto a partecipare a future offerte. Qualsiasi disponibilità futura sarà soggetta alla struttura societaria e legale svizzera definitiva, alla documentazione definitiva dell'offerta, alla verifica degli asset, agli accordi di custodia, all'idoneità giurisdizionale, a KYC/KYB, allo screening delle sanzioni e all'approvazione finale.",
  },
  "disclosure.legalReview": {
    en: "Final public wording remains subject to professional legal review.",
    es: "La redacción pública final está sujeta a revisión legal profesional.",
    it: "La formulazione pubblica finale resta soggetta a revisione legale professionale.",
  },
  "footer.status": {
    en: "Corporate Development Status",
    es: "Estado del Desarrollo Corporativo",
    it: "Stato dello Sviluppo Societario",
  },
  "waitlist.title": { en: "Join the Project Waitlist", es: "Únase a la Lista de Espera del Proyecto", it: "Iscriviti alla Lista d'Attesa del Progetto" },
  "waitlist.microcopy": {
    en: "Registration does not constitute an investment, token purchase or reservation of industrial metals.",
    es: "El registro no constituye una inversión, compra de tokens ni reserva de metales industriales.",
    it: "La registrazione non costituisce un investimento, un acquisto di token né una prenotazione di metalli industriali.",
  },
  "form.firstName": { en: "First Name", es: "Nombre", it: "Nome" },
  "form.lastName": { en: "Last Name", es: "Apellidos", it: "Cognome" },
  "form.email": { en: "Email Address", es: "Correo Electrónico", it: "Indirizzo Email" },
  "form.country": { en: "Country of Residence", es: "País de Residencia", it: "Paese di Residenza" },
  "form.submit": { en: "Register Interest", es: "Registrar Interés", it: "Registra Interesse" },
  "lang.note": {
    en: "Translations of legal content are subject to professional legal review.",
    es: "Las traducciones del contenido legal están sujetas a revisión legal profesional.",
    it: "Le traduzioni dei contenuti legali sono soggette a revisione legale professionale.",
  },
};

interface I18n {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18n>({
  locale: "en",
  setLocale: () => undefined,
  t: (key) => dict[key]?.en ?? key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  useEffect(() => {
    const saved = window.localStorage.getItem("rc-locale") as Locale | null;
    if (saved && ["en", "es", "it"].includes(saved)) setLocaleState(saved);
  }, []);
  const setLocale = (l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem("rc-locale", l);
    document.documentElement.lang = l;
  };
  const t = (key: string) => dict[key]?.[locale] ?? dict[key]?.en ?? key;
  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  return useContext(I18nContext);
}
