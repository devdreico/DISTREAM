import { useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  MessageCircle,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import {
  siApplemusic,
  siCrunchyroll,
  siMax,
  siNetflix,
  siParamountplus,
  siSpotify,
  siYoutube,
} from 'simple-icons';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mzeeqdjq';

const services = [
  {
    slug: 'youtube-premium', name: 'YouTube Premium', short: 'YouTube', icon: siYoutube,
    category: 'VIDEO · SIN ANUNCIOS', color: '#ff3d45', available: true,
    cardNote: 'Incluye YouTube Videos + YouTube Music',
    offers: { month: { price: 12000, basePrice: 23900 }, year: { price: 140000, basePrice: 23900 * 12 } },
    image: 'photo-1485846234645-a62644f84728', description: 'Tus videos favoritos, sin interrupciones. Disfruta también de reproducción en segundo plano y descargas para llevar.',
    account: 'Correo de Google asociado a YouTube', accountPlaceholder: 'nombre@gmail.com',
  },
  {
    slug: 'spotify-premium', name: 'Spotify Premium', short: 'Spotify', icon: siSpotify,
    category: 'MÚSICA · A TU RITMO', color: '#25d66f', available: true,
    offers: { month: { price: 7000, basePrice: 18500 }, year: { price: 80000, basePrice: 18500 * 12 } },
    image: 'photo-1514525253161-7a46d19cd819', description: 'Música y podcasts sin anuncios, con saltos ilimitados y descargas para que el soundtrack no se detenga.',
    account: 'Correo asociado a Spotify', accountPlaceholder: 'tu@email.com',
  },
  {
    slug: 'crunchyroll', name: 'Crunchyroll', short: 'Crunchyroll', icon: siCrunchyroll,
    category: 'ANIME · SIMULCAST', color: '#f48a1d', available: false,
    image: 'photo-1578632767115-351597cf2477', description: 'Estrenos de anime, episodios sin anuncios y un catálogo para maratonear a tu manera.',
    account: 'Correo asociado a Crunchyroll', accountPlaceholder: 'tu@email.com',
  },
  {
    slug: 'netflix', name: 'Netflix', short: 'Netflix', icon: siNetflix,
    category: 'SERIES · PELÍCULAS', color: '#ef233c', available: false,
    image: 'photo-1489599849927-2ee91cede3ba', description: 'Historias para cada mood: descubre series, películas y documentales desde tu pantalla favorita.',
    account: 'Correo asociado a Netflix', accountPlaceholder: 'tu@email.com',
  },
  {
    slug: 'prime-video', name: 'Prime Video', short: 'Prime Video', icon: null, iconFallback: '▶',
    category: 'PELÍCULAS · ORIGINALES', color: '#2cbbff', available: false,
    image: 'photo-1440404653325-ab127d49abc1', description: 'Grandes estrenos, producciones originales y noches de película listas para empezar.',
    account: 'Correo asociado a Prime Video', accountPlaceholder: 'tu@email.com',
  },
  {
    slug: 'disney-plus', name: 'Disney+', short: 'Disney+', icon: null, iconFallback: 'D+',
    category: 'UNIVERSOS · EN FAMILIA', color: '#71a7ff', available: false,
    image: 'photo-1536440136628-849c177e76a1', description: 'Películas y series de Disney, Pixar, Marvel, Star Wars y mucho más, todo en un mismo lugar.',
    account: 'Correo asociado a Disney+', accountPlaceholder: 'tu@email.com',
  },
  {
    slug: 'apple-music', name: 'Apple Music', short: 'Apple Music', icon: siApplemusic,
    category: 'MÚSICA · AUDIO ESPACIAL', color: '#fa4b76', available: false,
    image: 'photo-1516280440614-37939bbacd81', description: 'Más de cien millones de canciones, audio espacial y playlists para escuchar en alta fidelidad.',
    account: 'Correo asociado a Apple Music', accountPlaceholder: 'tu@email.com',
  },
  {
    slug: 'max', name: 'Max', short: 'Max', icon: siMax,
    category: 'HBO · SERIES PREMIUM', color: '#8a72ff', available: false,
    image: 'photo-1517604931442-7e0c8ed2963c', description: 'Series que dan de qué hablar, cine aclamado y nuevas historias para tu próxima sesión.',
    account: 'Correo asociado a Max', accountPlaceholder: 'tu@email.com',
  },
  {
    slug: 'paramount-plus', name: 'Paramount+', short: 'Paramount+', icon: siParamountplus,
    category: 'ESTRENOS · SERIES', color: '#63a6ff', available: false,
    image: 'photo-1505685296765-3a2736de412f', description: 'Películas, series y originales de Paramount para ponerle play a algo distinto.',
    account: 'Correo asociado a Paramount+', accountPlaceholder: 'tu@email.com',
  },
  {
    slug: 'deezer', name: 'Deezer', short: 'Deezer', icon: null, iconFallback: 'D',
    category: 'MÚSICA · FLOW', color: '#b28aff', available: false,
    image: 'photo-1511379938547-c1f69419868d', description: 'Tu música y podcasts con Flow, reproducción sin anuncios y una biblioteca hecha a tu medida.',
    account: 'Correo asociado a Deezer', accountPlaceholder: 'tu@email.com',
  },
];

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  currencyDisplay: 'code',
  maximumFractionDigits: 0,
});

function formatPrice(amount) {
  return currencyFormatter.format(amount);
}

function getDiscountPercent(offer) {
  return ((offer.basePrice - offer.price) / offer.basePrice) * 100;
}

function formatDiscount(offer) {
  return `${getDiscountPercent(offer).toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

function getMaximumDiscount() {
  return Math.max(...services.flatMap((service) => service.available
    ? Object.values(service.offers).map(getDiscountPercent)
    : []));
}

function BrandMark({ service, size = 22 }) {
  if (!service.icon) return <span aria-hidden="true" className="brand-fallback" style={{ fontSize: size * 0.68 }}>{service.iconFallback}</span>;

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d={service.icon.path} />
    </svg>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [mobileVisible, setMobileVisible] = useState(location.pathname !== '/');

  useEffect(() => {
    if (location.pathname !== '/') {
      setMobileVisible(true);
      return undefined;
    }

    const servicesSection = document.getElementById('servicios');
    if (!servicesSection) return undefined;

    const observer = new IntersectionObserver(([entry]) => setMobileVisible(entry.isIntersecting), {
      rootMargin: '-72px 0px 0px 0px',
    });
    observer.observe(servicesSection);
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <header className={`site-header ${mobileVisible ? 'mobile-visible' : ''}`}>
      <Link to="/" className="wordmark" aria-label="DISTREAM, inicio" onClick={() => setMenuOpen(false)}>
        <span className="brand-symbol"><span /><span /><span /></span>
        DISTREAM<span className="wordmark-period">.</span>
      </Link>
      <a className="mobile-whatsapp" href="https://wa.me/573144572008" target="_blank" rel="noreferrer" aria-label="Contactar a DISTREAM por WhatsApp al 3144572008">
        <MessageCircle size={16} /> WhatsApp
      </a>
      <button className="mobile-menu icon-button" type="button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav className={`header-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegación principal">
        <a href="/#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
        <a className="nav-cta" href="/#servicios" onClick={() => setMenuOpen(false)}>Ver planes <ArrowUpRight size={14} /></a>
      </nav>
    </header>
  );
}

function ScrollHero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });
  const haloRotation = useTransform(scrollYProgress, [0, 1], [0, 36]);
  const [activeWord, setActiveWord] = useState(0);
  const words = ['PAGA', 'MENOS', 'POR', 'MÁS'];

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setActiveWord(Math.min(3, Math.floor(value * 4)));
  });

  return (
    <section ref={heroRef} className="hero-scroll" aria-label="Paga menos por más">
      <div className="hero-stage">
        <div className="hero-backdrop" />
        <motion.div className="hero-halo" style={{ scale: scrollYProgress, rotate: haloRotation }} />
        <div className="hero-grain" />
        <div className="hero-side-note"><span>ENTRETENIMIENTO,</span><span>A TU MANERA.</span></div>
        <div className="hero-content">
          <div className="hero-kicker"><Sparkles size={13} /> TU PRÓXIMO MES EMPIEZA AQUÍ</div>
          <div className="hero-type" aria-label="Paga menos por más">
            {words.map((word, index) => (
              <motion.div
                key={word}
                className={`hero-word ${index === 3 ? 'hero-word-accent' : ''} ${activeWord === index ? 'is-active' : ''}`}
                animate={{ opacity: activeWord === index ? 1 : 0.24, x: activeWord === index ? 0 : (index % 2 ? 18 : -18) }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden="true"
              >
                {word}
                {activeWord === index && <motion.span layoutId="hero-marker" className="hero-word-marker" transition={{ type: 'spring', stiffness: 240, damping: 24 }} />}
              </motion.div>
            ))}
          </div>
          <motion.div className="hero-footer" style={{ opacity: scrollYProgress }}>
            <p>Un mes de lo que amas.<br /><strong>Hasta {getMaximumDiscount().toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% menos.</strong></p>
            <a href="#servicios" className="hero-scroll-link">Explora los servicios <ArrowDown size={16} /></a>
          </motion.div>
        </div>
        <div className="hero-progress" aria-hidden="true"><motion.span style={{ scaleX: scrollYProgress }} /></div>
        <div className="hero-index"><span>SCROLL PARA SENTIRLO</span><span>0{activeWord + 1} / 04</span></div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }) {
  const [term, setTerm] = useState('month');
  const detailUrl = `/servicio/${service.slug}?term=${term}`;
  const offer = service.offers?.[term];

  return (
    <motion.article
      className="service-card"
      style={{ '--service-color': service.color, '--card-index': index }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={detailUrl} className="service-card-link" aria-label={`Ver ${service.name}, ${term === 'year' ? 'Premium 1 Año' : 'Premium 1 Mes'}`}>
        <div className="service-image" style={{ backgroundImage: `url(https://images.unsplash.com/${service.image}?auto=format&fit=crop&w=1200&q=85)` }}>
          <div className="service-image-shade" />
          <span className="service-category">{service.category}</span>
          <span className="service-image-icon" style={{ color: service.color }}><BrandMark service={service} size={28} /></span>
          <span className="service-card-arrow"><ArrowUpRight size={17} /></span>
        </div>
      </Link>
      <div className="service-card-info">
        <div className="service-card-info-heading">
          <h3>{service.name}</h3>
          {service.available && <span className="discount-mark">−{formatDiscount(offer)}</span>}
        </div>
        {service.cardNote && <p className="service-card-note">{service.cardNote}</p>}
        {service.available ? <>
          <div className="service-price"><strong>{formatPrice(offer.price)}</strong><del>{formatPrice(offer.basePrice)}</del></div>
          <div className="service-term-switch" role="group" aria-label={`Duración de ${service.name}`}>
            <button type="button" className={term === 'month' ? 'is-selected' : ''} aria-pressed={term === 'month'} onClick={() => setTerm('month')}>Premium 1 Mes</button>
            <button type="button" className={term === 'year' ? 'is-selected' : ''} aria-pressed={term === 'year'} onClick={() => setTerm('year')}>Premium 1 Año</button>
          </div>
          <Link to={detailUrl} className="button-primary service-card-cta">Obtener Premium <ArrowRight size={15} /></Link>
        </> : <button className="button-primary service-card-cta is-coming-soon" type="button" disabled>Próximamente</button>}
      </div>
    </motion.article>
  );
}

function ServicesSection() {
  return (
    <section className="services-section" id="servicios">
      <div className="section-topline"><span>01 — ELIGE TU PRÓXIMA SESIÓN</span><span>10 EXPERIENCIAS</span></div>
      <div className="services-heading-row">
        <h2>Una suscripción.<br /><em>Más para disfrutar.</em></h2>
        <p>Elige tu plataforma y duración.<br />Precios y ahorros en COP.</p>
      </div>
      <div className="services-grid">
        {services.map((service, index) => <ServiceCard key={service.slug} service={service} index={index} />)}
      </div>
      <div className="services-footnote"><ShieldCheck size={15} /> Descuentos calculados frente al precio base mensual de cada servicio.</div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <Link to="/" className="wordmark"><span className="brand-symbol"><span /><span /><span /></span>DISTREAM<span className="wordmark-period">.</span></Link>
      <span>Tu entretenimiento. A otro precio.</span>
      <a href="https://wa.me/573144572008" target="_blank" rel="noreferrer"><MessageCircle size={14} /> WhatsApp</a>
    </footer>
  );
}

function HomePage() {
  return <><Header /><main><ScrollHero /><ServicesSection /></main><Footer /></>;
}

function RequestModal({ service, term, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', account: '', whatsapp: '' });
  const planLabel = term === 'year' ? 'Premium 1 Año' : 'Premium 1 Mes';

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionError('');

    const submission = new FormData(event.currentTarget);
    submission.set('service', service.name);
    submission.set('plan', planLabel);
    submission.set('_subject', `Solicitud DISTREAM: ${service.name} · ${planLabel}`);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: submission,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        const message = result?.errors?.map((error) => error.message).join(' ');
        throw new Error(message || 'No pudimos enviar tu solicitud. Inténtalo nuevamente.');
      }

      setSubmitted(true);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'No pudimos enviar tu solicitud. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <motion.section className="request-modal" role="dialog" aria-modal="true" aria-labelledby="request-title" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
        <button className="modal-close icon-button" type="button" aria-label="Cerrar" onClick={onClose}><X size={19} /></button>
        {!submitted ? <>
          <span className="modal-eyebrow"><span style={{ color: service.color }}><BrandMark service={service} /></span> SOLICITUD · {service.name.toUpperCase()} · {planLabel.toUpperCase()}</span>
          <h2 id="request-title">Tu {term === 'year' ? 'próximo año' : 'próximo mes'}<br /><em>empieza aquí.</em></h2>
          <p className="modal-copy">Déjanos estos datos para preparar tu acceso. Nunca compartas una contraseña.</p>
          <form className="request-form" onSubmit={handleSubmit}>
            <label>¿Cómo te llamas?<input required name="name" autoComplete="name" placeholder="Tu nombre" value={form.name} onChange={updateForm} /></label>
            <label>Tu correo electrónico<input required type="email" name="email" autoComplete="email" placeholder="tu@email.com" value={form.email} onChange={updateForm} /></label>
            <label>{service.account}<input required name="account" placeholder={service.accountPlaceholder} value={form.account} onChange={updateForm} /></label>
            <label>WhatsApp de contacto<input required type="tel" name="whatsapp" autoComplete="tel" placeholder="+00 000 000 0000" value={form.whatsapp} onChange={updateForm} /></label>
            <p className="form-privacy"><ShieldCheck size={14} /> Tus datos se enviarán a DISTREAM mediante Formspree. No incluyas contraseñas.</p>
            {submissionError && <p className="form-error" role="alert">{submissionError}</p>}
            <button className="button-primary form-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? 'Enviando solicitud...' : 'Obtener Premium'} <ArrowRight size={17} />
            </button>
          </form>
        </> : <div className="request-success">
          <span className="success-icon"><Check size={24} /></span>
          <span className="modal-eyebrow">SOLICITUD RECIBIDA</span>
          <h2 id="request-title">Gracias,<br /><em>{form.name.split(' ')[0]}.</em></h2>
          <p>Te confirmaremos por WhatsApp tu suscripción de {planLabel} a {service.name} y te indicaremos nuestros medios de pago.</p>
          <button type="button" className="button-secondary" onClick={onClose}>Entendido <Check size={16} /></button>
        </div>}
      </motion.section>
    </div>
  );
}

function ServicePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const service = services.find((item) => item.slug === slug);
  const [modalOpen, setModalOpen] = useState(false);
  const term = searchParams.get('term') === 'year' ? 'year' : 'month';
  const planLabel = term === 'year' ? 'Premium 1 Año' : 'Premium 1 Mes';
  const offer = service?.offers?.[term];

  if (!service) return <><Header /><main className="not-found"><h1>No encontramos ese servicio.</h1><Link className="button-primary" to="/">Volver al inicio <ArrowRight size={16} /></Link></main></>;

  return <>
    <Header />
    <main className="detail-page" style={{ '--service-color': service.color }}>
      <div className="detail-cover" style={{ backgroundImage: `url(https://images.unsplash.com/${service.image}?auto=format&fit=crop&w=2000&q=90)` }}>
        <div className="detail-cover-overlay" />
        <button className="back-link" type="button" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Volver</button>
        <span className="detail-cover-index">DISTREAM ORIGINALS&nbsp;&nbsp; / &nbsp;&nbsp;{service.category}</span>
        <div className="detail-brand"><BrandMark service={service} size={33} /><span>{service.name}</span></div>
        <div className="detail-cover-bottom"><span>{planLabel.toUpperCase()}</span><span>01 / 10</span></div>
      </div>
      <section className="detail-content">
        <div className="detail-copy">
          <span className="detail-eyebrow">TU PRÓXIMA SESIÓN TE ESPERA</span>
          <h1>{service.available ? <>{term === 'year' ? 'Un año' : 'Un mes'} de {service.short}.</> : service.name}<br /><em>{service.available ? `Ahorras ${formatDiscount(offer)}.` : 'Próximamente.'}</em></h1>
          <p>{service.description}</p>
          {service.available && <div className="detail-perks"><span><Check size={15} /> {planLabel}</span><span><Check size={15} /> Sin pago por adelantado</span><span><Check size={15} /> Confirmación por WhatsApp</span></div>}
        </div>
        <aside className="detail-action">
          {service.available ? <>
            <span className="detail-action-top">{planLabel.toUpperCase()} <span>−{formatDiscount(offer)}</span></span>
            <div className="detail-price"><strong>{formatPrice(offer.price)}</strong><del>{formatPrice(offer.basePrice)}</del></div>
            <div className="detail-term-switch" role="group" aria-label={`Duración de ${service.name}`}>
              <button type="button" className={term === 'month' ? 'is-selected' : ''} aria-pressed={term === 'month'} onClick={() => setSearchParams({ term: 'month' })}>Premium 1 Mes</button>
              <button type="button" className={term === 'year' ? 'is-selected' : ''} aria-pressed={term === 'year'} onClick={() => setSearchParams({ term: 'year' })}>Premium 1 Año</button>
            </div>
            <button className="button-primary" type="button" onClick={() => setModalOpen(true)}>Obtener Premium <ArrowRight size={17} /></button>
            <span className="detail-payment-note"><ShieldCheck size={14} /> Primero obtienes premium. Luego pagas.</span>
          </> : <>
            <span className="detail-action-top">DISPONIBILIDAD <span>PRÓXIMAMENTE</span></span>
            <p>Estamos preparando este servicio para DISTREAM.</p>
            <button className="button-primary is-coming-soon" type="button" disabled>Próximamente</button>
          </>}
        </aside>
      </section>
      <section className="detail-process">
        <div className="section-topline"><span>QUÉ PASA DESPUÉS</span><span>EN 3 PASOS</span></div>
        <div className="detail-process-grid">
          <div><span>01</span><h3>Solicita</h3><p>Completa el formulario con tu correo asociado a la cuenta y tu WhatsApp.</p></div>
          <div><span>02</span><h3>Te confirmamos</h3><p>Te contactaremos por WhatsApp con la confirmación de tu suscripción y los medios de pago.</p></div>
          <div><span>03</span><h3>Tienes 24 horas</h3><p>Desde la confirmación por WhatsApp, tendrás 24 horas para efectuar el pago.</p></div>
        </div>
      </section>
    </main>
    <Footer />
    {modalOpen && <RequestModal service={service} term={term} onClose={() => setModalOpen(false)} />}
  </>;
}

export default function App() {
  return <Routes><Route path="/" element={<HomePage />} /><Route path="/servicio/:slug" element={<ServicePage />} /></Routes>;
}