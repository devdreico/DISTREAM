import { useRef, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CirclePlay,
  Headphones,
  Mail,
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

const services = [
  {
    slug: 'youtube-premium', name: 'YouTube Premium', short: 'YouTube', icon: siYoutube,
    category: 'VIDEO · SIN ANUNCIOS', color: '#ff3d45', plan: 'Plan familiar',
    image: 'photo-1485846234645-a62644f84728', description: 'Tus videos favoritos, sin interrupciones. Disfruta también de reproducción en segundo plano y descargas para llevar.',
    account: 'Correo de Google asociado a YouTube', accountPlaceholder: 'nombre@gmail.com',
  },
  {
    slug: 'spotify-premium', name: 'Spotify Premium', short: 'Spotify', icon: siSpotify,
    category: 'MÚSICA · A TU RITMO', color: '#25d66f', plan: 'Plan familiar',
    image: 'photo-1514525253161-7a46d19cd819', description: 'Música y podcasts sin anuncios, con saltos ilimitados y descargas para que el soundtrack no se detenga.',
    account: 'Correo asociado a Spotify', accountPlaceholder: 'tu@email.com',
  },
  {
    slug: 'crunchyroll', name: 'Crunchyroll', short: 'Crunchyroll', icon: siCrunchyroll,
    category: 'ANIME · SIMULCAST', color: '#f48a1d', plan: 'Acceso premium',
    image: 'photo-1578632767115-351597cf2477', description: 'Estrenos de anime, episodios sin anuncios y un catálogo para maratonear a tu manera.',
    account: 'Correo asociado a Crunchyroll', accountPlaceholder: 'tu@email.com',
  },
  {
    slug: 'netflix', name: 'Netflix', short: 'Netflix', icon: siNetflix,
    category: 'SERIES · PELÍCULAS', color: '#ef233c', plan: 'Plan premium',
    image: 'photo-1489599849927-2ee91cede3ba', description: 'Historias para cada mood: descubre series, películas y documentales desde tu pantalla favorita.',
    account: 'Correo asociado a Netflix', accountPlaceholder: 'tu@email.com',
  },
  {
    slug: 'prime-video', name: 'Prime Video', short: 'Prime Video', icon: null, iconFallback: '▶',
    category: 'PELÍCULAS · ORIGINALES', color: '#2cbbff', plan: 'Membresía mensual',
    image: 'photo-1440404653325-ab127d49abc1', description: 'Grandes estrenos, producciones originales y noches de película listas para empezar.',
    account: 'Correo asociado a Prime Video', accountPlaceholder: 'tu@email.com',
  },
  {
    slug: 'disney-plus', name: 'Disney+', short: 'Disney+', icon: null, iconFallback: 'D+',
    category: 'UNIVERSOS · EN FAMILIA', color: '#71a7ff', plan: 'Plan premium',
    image: 'photo-1536440136628-849c177e76a1', description: 'Películas y series de Disney, Pixar, Marvel, Star Wars y mucho más, todo en un mismo lugar.',
    account: 'Correo asociado a Disney+', accountPlaceholder: 'tu@email.com',
  },
  {
    slug: 'apple-music', name: 'Apple Music', short: 'Apple Music', icon: siApplemusic,
    category: 'MÚSICA · AUDIO ESPACIAL', color: '#fa4b76', plan: 'Plan familiar',
    image: 'photo-1516280440614-37939bbacd81', description: 'Más de cien millones de canciones, audio espacial y playlists para escuchar en alta fidelidad.',
    account: 'Correo asociado a Apple Music', accountPlaceholder: 'tu@email.com',
  },
  {
    slug: 'max', name: 'Max', short: 'Max', icon: siMax,
    category: 'HBO · SERIES PREMIUM', color: '#8a72ff', plan: 'Plan premium',
    image: 'photo-1517604931442-7e0c8ed2963c', description: 'Series que dan de qué hablar, cine aclamado y nuevas historias para tu próxima sesión.',
    account: 'Correo asociado a Max', accountPlaceholder: 'tu@email.com',
  },
  {
    slug: 'paramount-plus', name: 'Paramount+', short: 'Paramount+', icon: siParamountplus,
    category: 'ESTRENOS · SERIES', color: '#63a6ff', plan: 'Plan premium',
    image: 'photo-1505685296765-3a2736de412f', description: 'Películas, series y originales de Paramount para ponerle play a algo distinto.',
    account: 'Correo asociado a Paramount+', accountPlaceholder: 'tu@email.com',
  },
  {
    slug: 'deezer', name: 'Deezer', short: 'Deezer', icon: null, iconFallback: 'D',
    category: 'MÚSICA · FLOW', color: '#b28aff', plan: 'Plan familiar',
    image: 'photo-1511379938547-c1f69419868d', description: 'Tu música y podcasts con Flow, reproducción sin anuncios y una biblioteca hecha a tu medida.',
    account: 'Correo asociado a Deezer', accountPlaceholder: 'tu@email.com',
  },
];

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

  return (
    <header className="site-header">
      <Link to="/" className="wordmark" aria-label="DISTREAM, inicio" onClick={() => setMenuOpen(false)}>
        <span className="brand-symbol"><span /><span /><span /></span>
        DISTREAM<span className="wordmark-period">.</span>
      </Link>
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
            <p>Un mes de lo que amas.<br /><strong>Con un 30% menos.</strong></p>
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
  return (
    <motion.article
      className="service-card"
      style={{ '--service-color': service.color, '--card-index': index }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/servicio/${service.slug}`} className="service-card-link" aria-label={`Ver ${service.name}`}>
        <div className="service-image" style={{ backgroundImage: `url(https://images.unsplash.com/${service.image}?auto=format&fit=crop&w=1200&q=85)` }}>
          <div className="service-image-shade" />
          <span className="service-category">{service.category}</span>
          <span className="service-image-icon" style={{ color: service.color }}><BrandMark service={service} size={28} /></span>
          <span className="service-card-arrow"><ArrowUpRight size={17} /></span>
        </div>
        <div className="service-card-info">
          <div>
            <h3>{service.name}</h3>
            <span className="service-plan">{service.plan}</span>
          </div>
          <span className="discount-mark">−30%</span>
        </div>
      </Link>
    </motion.article>
  );
}

function ServicesSection() {
  return (
    <section className="services-section" id="servicios">
      <div className="section-topline"><span>01 — ELIGE TU PRÓXIMA SESIÓN</span><span>10 EXPERIENCIAS</span></div>
      <div className="services-heading-row">
        <h2>Una suscripción.<br /><em>Más para disfrutar.</em></h2>
        <p>Elige tu plataforma favorita.<br />Tu primer mes, con 30% menos.</p>
      </div>
      <div className="services-grid">
        {services.map((service, index) => <ServiceCard key={service.slug} service={service} index={index} />)}
      </div>
      <div className="services-footnote"><ShieldCheck size={15} /> Precios finales por confirmar. El descuento se calcula sobre la tarifa vigente.</div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <Link to="/" className="wordmark"><span className="brand-symbol"><span /><span /><span /></span>DISTREAM<span className="wordmark-period">.</span></Link>
      <span>Tu entretenimiento. A otro precio.</span>
      <a href="mailto:hola@distream.com"><Mail size={14} /> Hablemos</a>
    </footer>
  );
}

function HomePage() {
  return <><Header /><main><ScrollHero /><ServicesSection /></main><Footer /></>;
}

function RequestModal({ service, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', account: '', whatsapp: '' });

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <motion.section className="request-modal" role="dialog" aria-modal="true" aria-labelledby="request-title" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
        <button className="modal-close icon-button" type="button" aria-label="Cerrar" onClick={onClose}><X size={19} /></button>
        {!submitted ? <>
          <span className="modal-eyebrow"><span style={{ color: service.color }}><BrandMark service={service} /></span> SOLICITUD · {service.name.toUpperCase()}</span>
          <h2 id="request-title">Tu próximo mes<br /><em>empieza aquí.</em></h2>
          <p className="modal-copy">Déjanos estos datos para preparar tu acceso. Nunca compartas una contraseña.</p>
          <form className="request-form" onSubmit={handleSubmit}>
            <label>¿Cómo te llamas?<input required name="name" autoComplete="name" placeholder="Tu nombre" value={form.name} onChange={updateForm} /></label>
            <label>Tu correo electrónico<input required type="email" name="email" autoComplete="email" placeholder="tu@email.com" value={form.email} onChange={updateForm} /></label>
            <label>{service.account}<input required name="account" placeholder={service.accountPlaceholder} value={form.account} onChange={updateForm} /></label>
            <label>WhatsApp de contacto<input required type="tel" name="whatsapp" autoComplete="tel" placeholder="+00 000 000 0000" value={form.whatsapp} onChange={updateForm} /></label>
            <p className="form-privacy"><ShieldCheck size={14} /> Solo necesitamos tu correo o usuario. No solicitamos contraseñas.</p>
            <button className="button-primary form-submit" type="submit">Solicitar acceso <ArrowRight size={17} /></button>
          </form>
        </> : <div className="request-success">
          <span className="success-icon"><Check size={24} /></span>
          <span className="modal-eyebrow">SOLICITUD PREPARADA</span>
          <h2 id="request-title">Gracias,<br /><em>{form.name.split(' ')[0]}.</em></h2>
          <p>Tu solicitud para {service.name} quedó lista en esta demo. La confirmación por correo y el plazo de 24 horas se activarán cuando DISTREAM conecte su servicio de atención.</p>
          <button type="button" className="button-secondary" onClick={onClose}>Entendido <Check size={16} /></button>
        </div>}
      </motion.section>
    </div>
  );
}

function ServicePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = services.find((item) => item.slug === slug);
  const [modalOpen, setModalOpen] = useState(false);

  if (!service) return <><Header /><main className="not-found"><h1>No encontramos ese servicio.</h1><Link className="button-primary" to="/">Volver al inicio <ArrowRight size={16} /></Link></main></>;

  return <>
    <Header />
    <main className="detail-page" style={{ '--service-color': service.color }}>
      <div className="detail-cover" style={{ backgroundImage: `url(https://images.unsplash.com/${service.image}?auto=format&fit=crop&w=2000&q=90)` }}>
        <div className="detail-cover-overlay" />
        <button className="back-link" type="button" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Volver</button>
        <span className="detail-cover-index">DISTREAM ORIGINALS&nbsp;&nbsp; / &nbsp;&nbsp;{service.category}</span>
        <div className="detail-brand"><BrandMark service={service} size={33} /><span>{service.name}</span></div>
        <div className="detail-cover-bottom"><span>01 MES · {service.plan.toUpperCase()}</span><span>01 / 10</span></div>
      </div>
      <section className="detail-content">
        <div className="detail-copy">
          <span className="detail-eyebrow">TU PRÓXIMA SESIÓN TE ESPERA</span>
          <h1>Un mes de {service.short}.<br /><em>30% menos.</em></h1>
          <p>{service.description}</p>
          <div className="detail-perks"><span><Check size={15} /> Un mes premium</span><span><Check size={15} /> Sin pago por adelantado</span><span><Check size={15} /> Confirmación por correo</span></div>
        </div>
        <aside className="detail-action">
          <span className="detail-action-top">PRIMER MES <span>−30%</span></span>
          <p>El valor final se confirmará según la tarifa vigente de {service.name}.</p>
          <button className="button-primary" type="button" onClick={() => setModalOpen(true)}>Solicitar <ArrowRight size={17} /></button>
          <span className="detail-payment-note"><ShieldCheck size={14} /> Primero obtienes premium. Luego pagas.</span>
        </aside>
      </section>
      <section className="detail-process">
        <div className="section-topline"><span>QUÉ PASA DESPUÉS</span><span>EN 3 PASOS</span></div>
        <div className="detail-process-grid">
          <div><span>01</span><h3>Solicita</h3><p>Completa el formulario con tu correo asociado a la cuenta y tu WhatsApp.</p></div>
          <div><span>02</span><h3>Te agregamos</h3><p>Cuando tu acceso esté activo, recibirás una confirmación por correo.</p></div>
          <div><span>03</span><h3>Tienes 24 horas</h3><p>Desde la confirmación, tendrás 24 horas para efectuar el pago.</p></div>
        </div>
      </section>
    </main>
    <Footer />
    {modalOpen && <RequestModal service={service} onClose={() => setModalOpen(false)} />}
  </>;
}

export default function App() {
  return <Routes><Route path="/" element={<HomePage />} /><Route path="/servicio/:slug" element={<ServicePage />} /></Routes>;
}