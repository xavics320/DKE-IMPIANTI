import { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import "./App.css";

// ── Logo placeholder (sostituisci src con il path reale del logo) ──
import logo from "./assets/DKE_Logo_sfondoTrasparente.png";
import logoIcon from "./assets/dke-logo-icon.png";
import logoText from "./assets/dke-logo-text.png";
import phh from "./assets/dke-pannellosolare.jpeg";
import phh2 from "./assets/ele2.webp";
import phc from "./assets/pannello.webp";
import ph1 from "./assets/machapoke1.webp";
import ph2 from "./assets/machapoke2.webp";
import ph3 from "./assets/machapoke3.webp";
import ph21 from "./assets/brbergamo1.webp";
import ph22 from "./assets/brbergamo2.webp";
import ph23 from "./assets/brbergamo3.webp";
import ph31 from "./assets/brparma1.webp";
import ph32 from "./assets/brparma2.webp";
import ph33 from "./assets/brparma3.webp";
import ph41 from "./assets/romaantica.webp";
import ph42 from "./assets/romaantica2.webp";
import ph43 from "./assets/romaantica.webp";


const SERVICES = [
  {
    icon: "⚡",
    title: "Impianti Elettrici Civili",
    desc: "Progettazione e realizzazione di impianti elettrici per abitazioni private, condomini e uffici, nel rispetto delle normative vigenti.",
  },
  {
    icon: "🏭",
    title: "Impianti Industriali",
    desc: "Installazione e manutenzione di quadri elettrici, cablaggi e impianti di forza motrice per capannoni e aziende.",
  },
  {
    icon: "🌱",
    title: "Fotovoltaico & Rinnovabili",
    desc: "Installazione di impianti fotovoltaici residenziali e commerciali, con sistemi di accumulo e ottimizzazione energetica.",
  },
  {
    icon: "💡",
    title: "Illuminazione LED",
    desc: "Sostituzione e progettazione di impianti di illuminazione ad alta efficienza energetica per interni ed esterni.",
  },
  {
    icon: "🔌",
    title: "Domotica e impianti di sicurezza",
    desc: "Realizzazione e aggiornamenti di impianti di domotica e sistemi di sicurezza",
  },
  {
    icon: "🛡️",
    title: "Manutenzione & Verifiche",
    desc: "Interventi di manutenzione programmata, verifiche periodiche e certificazioni degli impianti elettrici.",
  },
];

const INTERVENTI = [
  "Impianto elettrico civile",
  "Impianto industriale",
  "Fotovoltaico",
  "Illuminazione LED",
  "Domotica",
  "Sistemi di sicurezza",
  "Manutenzione / Verifica",
  "Altro",
];

const PROJECTS = [
  {
    id: 1,
    title: "Impianto fotovoltaico 15 kW",
    tag: "Fotovoltaico",
    kw: "15 kW",
    details: ["Cliente privato", "Batterie di accumulo", "Installazione completa"],
    photos: [ph1, ph2, ph3],
    alt: "Impianto fotovoltaico da 15 kW realizzato da DKE Impianti",
  },
  {
    id: 2,
    title: "Rifacimento impianto elettrico",
    tag: "Civile",
    kw: null,
    details: ["Appartamento 120 mq", "Quadro elettrico nuovo", "Certificazione CEI"],
    photos: [ph21, ph22, ph23],
    alt: "Rifacimento impianto elettrico civile — DKE Impianti Milano",
  },
  {
    id: 3,
    title: "Sistema domotizzato",
    tag: "Domotica",
    kw: null,
    details: ["Efficenza energetica e risparmio", "Interoperabilità e integrazione", "Gestione remota"],
    photos: [ph31, ph32, ph33],
    alt: "Sistema domotica e automazione realizzato da DKE Impianti",
  },
  {
    id: 4,
    title: "Illuminazione LED capannone",
    tag: "Industriale",
    kw: null,
    details: ["2.000 mq", "Risparmio energetico 60%", "Sensori presenza"],
    photos: [ph41, ph42, ph43],
    alt: "Illuminazione LED industriale per capannone — DKE Impianti",
  },
];

// ── Carosello foto progetto ──
// Ogni progetto ha un array `photos`: usa `null` come placeholder finché non
// si dispone della foto reale, oppure passa il path dell'immagine importata.
function ProjectGallery({ photos = [], alt = "Progetto DKE Impianti" }) {
  const slides = photos.length ? photos : [null];
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <div className="project-gallery">
      <div
        className="project-gallery__track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((src, i) => (
          <div className="project-gallery__slide" key={i}>
            {src ? (
              <img src={src} alt={`${alt} — foto ${i + 1}`} loading="lazy" />
            ) : (
              <div className="project-placeholder">
                <span>📷</span>
                <p>Foto progetto {i + 1}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="project-gallery__nav project-gallery__nav--prev"
            onClick={prev}
            aria-label="Foto precedente"
          >
            ‹
          </button>
          <button
            type="button"
            className="project-gallery__nav project-gallery__nav--next"
            onClick={next}
            aria-label="Foto successiva"
          >
            ›
          </button>
          <div className="project-gallery__dots">
            {slides.map((_, i) => (
              <button
                type="button"
                key={i}
                className={`project-gallery__dot ${i === index ? "project-gallery__dot--active" : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Vai alla foto ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    nome: "",
    telefono: "",
    email: "",
    localita: "",
    intervento: "",
    messaggio: "",
    privacy: false,
    honeypot: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simula un caricamento di 2 secondi
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Rimuove l'errore sul campo appena l'utente inizia a correggere
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Honeypot — se compilato è uno spam bot, ignora silenziosamente
    if (formData.honeypot) return;

    // Validazione campi obbligatori
    const newErrors = {};
    if (!formData.nome.trim())     newErrors.nome     = "Il nome è obbligatorio";
    if (!formData.email.trim())    newErrors.email    = "L'email è obbligatoria";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                                   newErrors.email    = "Inserisci un'email valida";
    if (!formData.messaggio.trim()) newErrors.messaggio = "Descrivi brevemente il lavoro";
    if (!formData.privacy)         newErrors.privacy  = "Devi accettare la privacy policy";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus("sending");

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name:  formData.nome,
          from_email: formData.email,
          phone:      formData.telefono,
          localita:   formData.localita,
          intervento: formData.intervento,
          message:    formData.messaggio,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setStatus("success");
        setFormData({
          nome: "", telefono: "", email: "", localita: "",
          intervento: "", messaggio: "", privacy: false, honeypot: "",
        });
        setErrors({});
      })
      .catch(() => setStatus("error"));
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
    {loading && (
      <div className={`loader ${!loading ? "loader--hidden" : ""}`}>
        <div className="loader__spinner" />
        <img src={logoIcon} alt="DKE Impianti" className="loader__logo" />
      </div>
    )}

    <div className="site">
      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__inner">
          <div className="navbar__brand">
            <img src={logoIcon} alt="" className="navbar__logo-icon" />
            <img src={logoText} alt="DKE Impianti Srl" className="navbar__logo-text" />
          </div>
          <button
            className="navbar__burger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
          <ul className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
            <li><button onClick={() => scrollTo("servizi")}>Servizi</button></li>
            <li><button onClick={() => scrollTo("chi-siamo")}>Chi siamo</button></li>
            <li><button onClick={() => scrollTo("progetti")}>Progetti</button></li>
            <li><button onClick={() => scrollTo("contatti")} className="nav-cta">Preventivo</button></li>
          </ul>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__inner container">

          {/* LEFT */}
          <div className="hero__content">
            <p className="hero__eyebrow">Competenza · Passione · Professionalità  </p>
            <h1 className="hero__title">
              Progettiamo impianti.<br />
              <span className="hero__title--accent">Installiamo sicurezza.</span>
            </h1>
            <p className="hero__sub">
              DKE Impianti Srl realizza impianti elettrici civili, industriali, fotovoltaico,
              domotica e sistemi di sicurezza. Professionalità certificata, lavoro a regola d'arte.
            </p>
            <div className="hero__actions">
              <button className="btn btn--primary" onClick={() => scrollTo("contatti")}>
                Richiedi un preventivo
              </button>
              <button className="btn btn--ghost" onClick={() => scrollTo("servizi")}>
                Scopri i servizi
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hero__visual">
            {/* Main photo */}
            <div className="hero__photo-main">
              <img src={phh} alt="Tecnico DKE Impianti al lavoro su quadro elettrico" className="hero__img" fetchpriority="high" />
              {/* Floating card top-right */}
              <div className="hero__card hero__card--light">
                <span className="hero__card-icon">🏠</span>
                <div>
                  <strong>Soluzioni su misura</strong>
                  <p>Progettiamo impianti efficienti e sicuri, adattati ad ogni esigenza.</p>
                </div>
              </div>
              {/* Floating card mid-right */}
              <div className="hero__card hero__card--dark">
                <span className="hero__card-icon">⭐</span>
                <div>
                  <strong>Qualità garantita</strong>
                  <p>Materiali certificati e installazioni a regola d'arte, nel rispetto delle normative.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Stats bar — full width */}
        <div className="hero__stats-bar">
          <div className="container hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-icon">🛡️</span>
              <div>
                <strong>Lavori certificati</strong>
                <span>Norme CEI 64-8</span>
              </div>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-icon">🏅</span>
              <div>
                <strong>Oltre 10 anni</strong>
                <span>di passione e esperienza</span>
              </div>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-icon">👥</span>
              <div>
                <strong>500+ clienti</strong>
                <span>soddisfatti</span>
              </div>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-icon">📍</span>
              <div>
                <strong>Interventi in</strong>
                <span>tutto il nord Italia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVIZI ── */}
      <section className="section servizi" id="servizi">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Cosa facciamo</span>
            <h2 className="section__title">I nostri servizi</h2>
            <p className="section__sub">
              Dall'impianto di casa al capannone industriale, dalla ricarica EV al fotovoltaico:
              un interlocutore unico per tutte le tue esigenze elettriche.
            </p>
          </div>
          <div className="services-grid">
            {SERVICES.map((s) => (
              <div className="service-card" key={s.title}>
                <span className="service-card__icon">{s.icon}</span>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHI SIAMO ── */}
      <section className="section chi-siamo" id="chi-siamo">
        <div className="container chi-siamo__grid">
          <div className="chi-siamo__text">
            <span className="section__label">Chi siamo</span>
            <h2 className="section__title">Esperienza e certificazioni al tuo servizio</h2>
            <p>
              DKE Impianti Srl nasce dalla passione per l'impiantistica elettrica e da oltre quindici anni
              di esperienza sul campo. Operiamo su cantieri residenziali, commerciali e industriali con un
              team qualificato e costantemente aggiornato sulle normative vigenti.
            </p>
            <p>
              Ogni intervento è progettato su misura, seguito dalla fase di progettazione fino alla
              consegna con certificazione dell'impianto. La soddisfazione del cliente è la nostra
              misura di qualità.
            </p>
            <ul className="chi-siamo__list">
              <li>✔ Certificazione SOA e qualifiche professionali</li>
              <li>✔ Impianti conformi CEI 64-8</li>
              <li>✔ Garanzia su tutti i lavori eseguiti</li>
              <li>✔ Interventi in tutta la provincia</li>
            </ul>
          </div>
          <div className="chi-siamo__visual">
            <img src={phh2} alt="Il team di DKE Impianti Srl durante un intervento" className="chi-siamo__img" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ── PROGETTI ── */}
      <section className="section progetti" id="progetti">
        <div className="container">
          <div className="section__header">
            <span className="section__label">I nostri lavori</span>
            <h2 className="section__title">Progetti realizzati</h2>
            <p className="section__sub">
              Alcuni esempi dei lavori completati: ogni progetto è unico e realizzato su misura per il cliente.
            </p>
          </div>

          {PROJECTS.map((p, i) => (
            <div className={`project-hero ${i % 2 === 1 ? "project-hero--reverse" : ""}`} key={p.id}>
              <div className="project-hero__img">
                <ProjectGallery photos={p.photos} alt={p.alt} />
              </div>
              <div className="project-hero__info">
                <span className="project-tag">{p.tag}</span>
                <h3 className="project-title">{p.title}</h3>
                {p.kw && <p className="project-kw">{p.kw}</p>}
                <ul className="project-details">
                  {p.details.map((d) => <li key={d}>✔ {d}</li>)}
                </ul>
                <button className="btn btn--ghost" onClick={() => document.getElementById("contatti")?.scrollIntoView({ behavior: "smooth" })}>
                  Richiedi un intervento simile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORM PREVENTIVO ── */}
      <section className="section contatti" id="contatti">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Contatti</span>
            <h2 className="section__title">Richiedi un preventivo gratuito</h2>
            <p className="section__sub">
              Compila il modulo e ti ricontattiamo entro 24 ore lavorative.
            </p>
          </div>
          <div className="contact-wrap">
            <form ref={formRef} onSubmit={handleSubmit} className="contact-form" noValidate>

              {/* Honeypot — nascosto, serve solo per bloccare i bot */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Riga 1: Nome + Telefono */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nome">Nome e cognome *</label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    placeholder="Mario Rossi"
                    value={formData.nome}
                    onChange={handleChange}
                    aria-invalid={!!errors.nome}
                    aria-describedby={errors.nome ? "nome-error" : undefined}
                  />
                  {errors.nome && <span className="form-error" id="nome-error" role="alert">{errors.nome}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Telefono</label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    placeholder="+39 333 000 0000"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Riga 2: Email + Località */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="mario@email.it"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && <span className="form-error" id="email-error" role="alert">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="localita">Località</label>
                  <input
                    id="localita"
                    name="localita"
                    type="text"
                    placeholder="Es: Milano, Sesto San Giovanni..."
                    value={formData.localita}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Riga 3: Tipo intervento */}
              <div className="form-group">
                <label htmlFor="intervento">Tipo di intervento</label>
                <select
                  id="intervento"
                  name="intervento"
                  value={formData.intervento}
                  onChange={handleChange}
                >
                  <option value="">Seleziona...</option>
                  {INTERVENTI.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>

              {/* Messaggio */}
              <div className="form-group">
                <label htmlFor="messaggio">Descrivi brevemente il lavoro *</label>
                <textarea
                  id="messaggio"
                  name="messaggio"
                  rows={5}
                  placeholder="Es: ho bisogno di rifare l'impianto elettrico di un appartamento di 80mq..."
                  value={formData.messaggio}
                  onChange={handleChange}
                  aria-invalid={!!errors.messaggio}
                  aria-describedby={errors.messaggio ? "messaggio-error" : undefined}
                />
                {errors.messaggio && <span className="form-error" id="messaggio-error" role="alert">{errors.messaggio}</span>}
              </div>

              {/* Checkbox privacy GDPR */}
              <div className="form-group form-group--checkbox">
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    name="privacy"
                    checked={formData.privacy}
                    onChange={handleChange}
                    aria-invalid={!!errors.privacy}
                    aria-describedby={errors.privacy ? "privacy-error" : undefined}
                  />
                  <span>
                    Ho letto e accetto la{" "}
                    <a href="https://www.iubenda.com/privacy-policy/dkeimpianti" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>{" "}
                    ai sensi del Reg. UE 2016/679 (GDPR) *
                  </span>
                </label>
                {errors.privacy && <span className="form-error" id="privacy-error" role="alert">{errors.privacy}</span>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn--primary btn--full"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Invio in corso..." : "Invia richiesta"}
              </button>

              {/* Feedback */}
              {status === "success" && (
                <p className="form-feedback form-feedback--ok" role="alert">
                  ✅ Richiesta inviata! Ti ricontattiamo entro 24 ore lavorative.
                </p>
              )}
              {status === "error" && (
                <p className="form-feedback form-feedback--err" role="alert">
                  ❌ Errore nell'invio. Riprova o scrivici direttamente a{" "}
                  <a href="mailto:info@dkeimpianti.it">info@dkeimpianti.it</a>
                </p>
              )}
            </form>

            {/* Sidebar contatti */}
            <div className="contact-info">
              <h3>Contatti diretti</h3>
              <ul>
                <li>📞 <a href="tel:+393339168067">+39 333 916 8067</a></li>
                <li>✉️ <a href="mailto:info@dkeimpianti.it">info@dkeimpianti.it</a></li>
                <li>📍 Via Giovanni Dalle Bande Nere 7, 20146 Milano</li>
              </ul>
              <div className="contact-hours">
                <h4>Orari</h4>
                <p>Lun – Ven: 8:00 – 18:00</p>
                <p>Sab: 8:00 – 12:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <img src={logo} alt="DKE Impianti Srl" className="footer__logo" />
            <p className="footer__copy">
              © {new Date().getFullYear()} DKE Impianti Srl
              — Via Giovanni Dalle Bande Nere 7, 20146 Milano — P.IVA 13176380965
            </p>
          </div>
          <div className="footer__links">
            <nav className="footer__nav">
              <button onClick={() => scrollTo("servizi")}>Servizi</button>
              <button onClick={() => scrollTo("chi-siamo")}>Chi siamo</button>
              <button onClick={() => scrollTo("contatti")}>Contatti</button>
            </nav>
            <div className="footer__legal">
              <a href="https://www.iubenda.com/privacy-policy/75376521" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              <a href="https://www.iubenda.com/privacy-policy/75376521/cookie-policy" target="_blank" rel="noopener noreferrer">Cookie Policy</a>
            </div>
          </div>
        </div>
        <div className="container footer__credits">
          <a href="http://xavierparedes-dev.it" target="_blank" rel="noopener noreferrer">
            Design by Xavier Paredes
          </a>
        </div>
      </footer>
    </div>
    </>
  );
}