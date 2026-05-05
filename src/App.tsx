import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, Star, ArrowUpRight, MapPin, Phone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- Google Icon SVG ---
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

// --- 1. Loading Screen ---
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1500;
    
    const updateCounter = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(progress * 100);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setTimeout(onComplete, 200);
      }
    };
    requestAnimationFrame(updateCounter);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-center items-center p-8"
    >
        <div className="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums leading-none">
          {String(count).padStart(3, "0")}
        </div>
        <div className="w-64 h-[2px] bg-stroke/50 mt-8 overflow-hidden relative">
          <div 
            className="absolute inset-y-0 left-0 bg-accent w-full origin-left"
            style={{ transform: `scaleX(${count / 100})` }}
          />
        </div>
    </motion.div>
  );
};

// --- Section Header Component ---
const SectionHeader = ({ eyebrow, title1, title2, subtext }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="flex flex-col items-center text-center mb-10 md:mb-16"
    >
      <div className="flex items-center gap-4 mb-4 md:mb-6">
        <div className="w-6 md:w-8 h-px bg-accent" />
        <span className="text-[10px] md:text-xs text-light uppercase tracking-[0.3em]">{eyebrow}</span>
        <div className="w-6 md:w-8 h-px bg-accent" />
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 text-text-primary">
        {title1} <span className="font-display italic text-light">{title2}</span>
      </h2>
      {subtext && <p className="text-muted text-sm md:text-base max-w-lg mt-2 md:mt-4 px-4">{subtext}</p>}
    </motion.div>
  );
};

// --- Navbar ---
const Navbar = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true); // Hide on scroll down
    } else {
      setHidden(false); // Show on scroll up
    }
    setScrolled(latest > 50);
  });

  return (
    <motion.nav 
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4"
    >
      <div className={`inline-flex items-center rounded-full glass-panel px-1.5 md:px-2 py-1.5 md:py-2 transition-all max-w-[95vw] md:w-auto overflow-x-auto no-scrollbar ${scrolled ? 'shadow-lg shadow-black/80 bg-bg/95 border-stroke' : 'border-white/10'}`}>
        <div className="min-w-[36px] w-9 h-9 rounded-full bg-accent flex items-center justify-center font-display italic text-[15px] font-bold text-white shadow-[0_0_10px_rgba(0,121,98,0.5)]">RR</div>
        <div className="w-px h-5 bg-stroke mx-2 shrink-0" />
        <div className="flex items-center space-x-0.5 md:space-x-1 shrink-0">
          {["Início", "Sobre", "Direção", "Feedbacks"].map((link, i) => (
            <a key={link} href={`#${link.toLowerCase() === 'feedbacks' ? 'depoimentos' : (link.toLowerCase() === 'direção' ? 'diferenciais' : link.toLowerCase())}`} className={`text-[10px] sm:text-sm rounded-full px-2 md:px-3 py-1.5 transition-colors ${i===0 ? 'text-text-primary bg-stroke/50' : 'text-muted hover:text-text-primary hover:bg-stroke/50'}`}>
              {link}
            </a>
          ))}
        </div>
        <div className="w-px h-5 bg-stroke mx-2 hidden sm:block shrink-0" />
        <a href="https://wa.me/5524999015018?text=Ol%C3%A1%20Rafael!%20Vim%20pelo%20seu%20site%20e%20gostaria%20de%20agendar%20uma%20consulta%20nutricional." target="_blank" rel="noreferrer" className="hidden sm:flex bg-accent hover:bg-[#00997a] transition-colors rounded-full text-xs px-4 py-2 text-white font-medium items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(0,121,98,0.4)] hover:shadow-[0_0_20px_rgba(0,121,98,0.6)]">
          Agendar <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </motion.nav>
  );
};

// --- Hero Section ---
const Hero = () => {
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".hero-reveal", { opacity: 0, filter: "blur(5px)" }, { opacity: 1, filter: "blur(0px)", duration: 1.5 })
      .fromTo(".name-reveal", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2 }, "-=1")
      .fromTo(".blur-in", { opacity: 0, filter: "blur(10px)", y: 20 }, { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1 }, "-=0.8");
  }, []);

  return (
    <section id="início" className="relative w-full min-h-[100svh] flex flex-col justify-center overflow-hidden bg-bg">
      {/* Imagem clareada: degradê menos escuro para mostrar bem a foto */}
      <div className="absolute inset-0 z-0 hero-reveal">
        <img 
          src="/images/HERO-RAFAEL-V3.webp" 
          alt="Rafael Romanha" 
          className="w-full h-full object-cover object-center md:object-right" 
        />
        {/* Degradê apenas na esquerda/baixo, deixando a parte direita (rosto dele) visível */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-transparent md:w-[70%]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto text-left pt-24 md:pt-32 pb-16 flex-1 flex flex-col justify-center">
        <div className="blur-in inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30 w-fit mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] md:text-xs font-medium tracking-widest uppercase text-light">Nutrição Clínica e Esportiva</span>
        </div>
        
        <h1 className="name-reveal text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white mb-6 max-w-2xl drop-shadow-lg">
          Nutrição com <span className="font-display italic text-light font-normal">direção</span><br/>gera resultado.
        </h1>
        
        <p className="blur-in text-sm sm:text-base md:text-lg text-gray-200 max-w-lg mb-8 font-light drop-shadow-md">
          Planos pensados para o seu objetivo. Foco em resultado real e sustentável. Cada paciente com atenção individual.
        </p>

        <div className="blur-in mt-2 flex flex-col sm:flex-row gap-4">
          <a href="https://wa.me/5524999015018?text=Ol%C3%A1%20Rafael!%20Vim%20pelo%20seu%20site%20e%20gostaria%20de%20agendar%20uma%20consulta%20nutricional." target="_blank" rel="noreferrer" className="bg-accent hover:bg-[#00997a] text-white rounded-full text-sm md:text-base font-medium px-8 py-4 transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(0,121,98,0.5)] hover:shadow-[0_0_30px_rgba(0,121,98,0.7)] flex items-center justify-center gap-2 text-center w-full sm:w-auto">
            AGENDAR CONSULTA <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

// --- Infinite Partners Carousel (Claro) ---
const Partners = () => {

  const logos = [
    "/images/MEDISERVICE-768x228.webp",
    "/images/12.-inb.webp",
    "/images/AMILL-768x228.webp",
    "/images/BRADESCOO-768x228.webp",
    "/images/Logo_SulAmerica_RGB-scaled-copiar-768x228.webp"
  ];

  return (
    <div className="py-8 md:py-12 border-y border-stroke/20 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing bg-gray-50 relative z-20 group">
      <p className="text-center text-[10px] md:text-xs tracking-[0.2em] text-gray-500 font-semibold uppercase mb-6">Parceiros & Convênios</p>
      <div className="overflow-hidden">
        <div className="flex items-center w-max marquee-left group-hover:![animation-play-state:paused] group-active:![animation-play-state:paused]" style={{ animationDuration: '25s' }}>
          {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
             <img key={i} src={logo} alt="Parceiro" className="h-10 sm:h-14 md:h-16 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 mix-blend-multiply mx-8 md:mx-16" />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Bento Grid (Diferenciais) ---
const Diferenciais = () => {
  const p = [
    { title: "Nutrição Estratégica", span: "md:col-span-7", text: "Planejamento milimétrico para que cada refeição seja um passo em direção ao seu objetivo." },
    { title: "Performance e Saúde", span: "md:col-span-5", text: "Equilíbrio perfeito entre rendimento máximo no esporte e vitalidade no dia a dia." },
    { title: "Acompanhamento Individual", span: "md:col-span-5", text: "Cada biotipo, rotina e preferência são respeitados na elaboração da sua dieta." },
    { title: "Resultados Sustentáveis", span: "md:col-span-7", text: "Sem dietas extremas ou sofrimento. Construímos hábitos que duram para a vida toda." }
  ];

  return (
    <section id="diferenciais" className="bg-bg py-20 md:py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <SectionHeader 
          eyebrow="A Metodologia"
          title1="Os Pilares do"
          title2="sucesso"
          subtext="Uma abordagem completa que une ciência, prática e adaptação à sua realidade."
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {p.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              key={i} 
              className={`group relative bg-gradient-to-br from-[#002b20] to-[#001711] border border-accent/20 shadow-xl shadow-black/40 rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_0_30px_rgba(0,121,98,0.25)] p-6 md:p-10 flex flex-col justify-between min-h-[250px] md:min-h-[300px] ${item.span}`}
            >
              <div className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #C4E2DC 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-light mb-6 md:mb-8 group-hover:scale-110 group-hover:border-accent transition-all">
                <span className="font-display italic text-lg md:text-xl">0{i+1}</span>
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-white group-hover:text-light transition-colors">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Alta Performance (Cara Correndo) ---
const Performance = () => {
  return (
    <section className="bg-bg py-10 md:py-20 overflow-hidden relative border-y border-stroke">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center flex-col-reverse lg:flex-row">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-stroke aspect-[4/3] md:aspect-[16/9] lg:aspect-square order-2 lg:order-1"
          >
            <img src="/images/running_man.png" alt="Alta Performance" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-accent" />
              <span className="text-[10px] md:text-xs text-light uppercase tracking-[0.2em]">Desempenho</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Alcance o ápice da sua <span className="font-display italic text-light font-normal">performance</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed">
              Atletas e entusiastas do esporte precisam de combustível na medida certa. 
              Ajustamos seus macronutrientes, periodização e hidratação para que você quebre recordes e evite lesões, mantendo o corpo no seu estado mais otimizado.
            </p>
            <ul className="space-y-4 mb-8">
              {['Aumento de rendimento', 'Recuperação muscular acelerada', 'Ajuste de energia pré e pós-treino'].map((txt, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-accent" /> {txt}
                </li>
              ))}
            </ul>
            <a href="https://wa.me/5524999015018?text=Ol%C3%A1%20Rafael!%20Vim%20pelo%20seu%20site%20e%20gostaria%20de%20agendar%20uma%20consulta%20nutricional." target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white text-bg font-medium px-6 py-3 rounded-full hover:bg-gray-200 transition-colors text-sm">
               Preparar para o próximo nível <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

// --- Sobre o Mentor ---
const Sobre = () => {
  return (
    <section id="sobre" className="bg-surface py-20 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden group aspect-square shadow-[0_0_50px_rgba(0,0,0,0.3)] order-1"
          >
            <div className="absolute inset-0 bg-accent/10 group-hover:bg-transparent transition-colors duration-700 z-10 mix-blend-overlay pointer-events-none" />
            <img src="/images/IMG-SOBRE-RAFAEL-2-1024x686.webp" alt="Rafael Romanha" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-2"
          >
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="w-6 md:w-8 h-px bg-accent" />
              <span className="text-[10px] md:text-xs text-light uppercase tracking-[0.3em]">O Mentor</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Rafael <span className="font-display italic text-light font-normal">Romanha</span>
            </h2>
            
            <div className="space-y-4 md:space-y-6 text-gray-300 text-sm md:text-base font-light mb-8 border-l-2 border-accent/50 pl-4 md:pl-6">
              <p>
                Sou nutricionista clínico e esportivo, atuando em Resende (RJ) com foco em transformar a alimentação em uma ferramenta estratégica para saúde, estética e performance.
              </p>
              <p>
                Meu trabalho é desenvolver planos personalizados que se adaptam à rotina de cada paciente, promovendo resultados reais e sustentáveis.
              </p>
            </div>

            <a href="https://wa.me/5524999015018?text=Ol%C3%A1%20Rafael!%20Vim%20pelo%20seu%20site%20e%20gostaria%20de%20agendar%20uma%20consulta%20nutricional." target="_blank" rel="noreferrer" className="inline-flex bg-accent hover:bg-[#00997a] text-white rounded-full px-6 py-3 transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(0,121,98,0.3)] font-medium items-center gap-2 text-sm md:text-base w-full sm:w-auto justify-center">
               Agendar Consulta <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- CTA Localização ---
const Localizacao = () => {
  return (
    <section className="bg-bg py-20 overflow-hidden relative border-y border-stroke/50">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <div className="flex flex-col items-center lg:items-start mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-accent" />
                <span className="text-[10px] md:text-xs text-light uppercase tracking-[0.3em] font-semibold">Onde Atendemos</span>
                <div className="w-6 h-px bg-accent lg:hidden" />
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">Consultório <span className="font-display italic text-light font-normal">Presencial</span></h2>
            </div>
            <p className="text-gray-300 text-sm md:text-lg mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed font-light border-l-2 border-accent/50 pl-4">
              Venha conhecer nosso espaço em Resende - RJ. Preparado para oferecer a melhor experiência, conforto e precisão durante sua avaliação física completa.
            </p>
            <div className="flex justify-center lg:justify-start">
              <a href="https://www.google.com/maps/place/Rafael+Romanha+%7C+Nutricionista+em+Resende/data=!4m2!3m1!1s0x0:0x792c95804ab5c70b?sa=X&ved=1t:2428&ictx=111" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-white text-[#01130C] hover:bg-gray-100 transition-all hover:-translate-y-1 shadow-[0_0_30px_rgba(255,255,255,0.15)] rounded-full px-8 py-4 font-semibold text-sm md:text-base">
                 <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                   <MapPin className="w-4 h-4 text-[#007962]" />
                 </div>
                 Abrir no Google Maps
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,121,98,0.2)] border border-stroke/50 order-1 lg:order-2 aspect-[4/3] lg:aspect-auto"
          >
            <img src="/images/LOCALIZACAO-V3.webp" alt="Localização" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-40 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- Depoimentos Estilo Google Meu Negócio (Efeito Cabuloso) ---
const Depoimentos = () => {

  const reviews = [
    { name: "Vitória Farias", text: "O melhor da região disparado." },
    { name: "Jacson Junior", text: "Excelente atendimento!!" },
    { name: "Estefanya Rosa", text: "Melhor nutri que já vi na vida. Olha que fui em muitos." },
    { name: "Márcia Caden", text: "Nutricionista de excelência" },
    { name: "Aline Calado", text: "Excelente profissional, muito seguro com suas avaliações e excelentes dicas de alimentação. Gostei muito!" },
    { name: "Angélica Guimarães", text: "Excelente profissional! Muito atencioso, escuta com paciência e explica tudo de forma clara..." },
    { name: "Marcus vinicius Faquir", text: "Excelente profissional" },
    { name: "Enderson Silva", text: "Excelente profissional." }
  ];

  const row1 = reviews.slice(0, 4);
  const row2 = reviews.slice(4, 8);

  const ReviewCard = ({ r }: any) => (
    <div className="bg-white rounded-2xl p-5 md:p-6 w-[300px] md:w-[380px] shrink-0 shadow-xl border border-gray-100/50 transform transition-transform duration-300 hover:scale-[1.02] mx-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm md:text-lg uppercase">
            {r.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-gray-900 font-bold text-xs md:text-sm">{r.name}</h4>
            <p className="text-gray-500 text-[10px] md:text-xs flex items-center gap-1 mt-0.5">
               Publicado em Google
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <GoogleIcon />
        </div>
      </div>
      <div className="flex gap-1 mb-2 md:mb-3">
        {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 md:w-4 md:h-4 fill-[#FBBC05] text-[#FBBC05]" />)}
      </div>
      <p className="text-gray-700 text-xs md:text-sm leading-relaxed whitespace-normal">
        "{r.text}"
      </p>
    </div>
  );

  return (
    <section id="depoimentos" className="bg-surface py-20 md:py-28 border-y border-stroke relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[500px] bg-accent/5 rounded-[100%] blur-[150px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 relative z-10 mb-12">
        <SectionHeader 
          eyebrow="Resultados reais"
          title1="Depoimentos do"
          title2="Google"
          subtext="Centenas de pacientes que transformaram sua saúde e performance com acompanhamento profissional."
        />
      </div>

      <div className="relative z-10 flex flex-col gap-6 -mx-4 md:mx-0 pb-8 group touch-pan-y">
        {/* Sombras laterais para o degradê no marquee */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-surface to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-surface to-transparent z-20 pointer-events-none" />

        {/* Row 1 (Esquerda) */}
        <div className="overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing py-4">
          <div className="flex items-center w-max marquee-left group-hover:![animation-play-state:paused] group-active:![animation-play-state:paused]">
            {[...row1, ...row1, ...row1, ...row1].map((r, i) => (
              <ReviewCard key={`r1-${i}`} r={r} />
            ))}
          </div>
        </div>

        {/* Row 2 (Direita) */}
        <div className="overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing py-4">
          <div className="flex items-center w-max marquee-right group-hover:![animation-play-state:paused] group-active:![animation-play-state:paused]">
            {[...row2, ...row2, ...row2, ...row2].map((r, i) => (
              <ReviewCard key={`r2-${i}`} r={r} />
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-[1200px] mx-auto text-center mt-16 relative z-10">
         <a href="https://wa.me/5524999015018?text=Ol%C3%A1%20Rafael!%20Vim%20pelo%20seu%20site%20e%20gostaria%20de%20agendar%20uma%20consulta%20nutricional." target="_blank" rel="noreferrer" className="inline-flex bg-accent hover:bg-[#00997a] text-white rounded-full px-10 py-4 transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(0,121,98,0.3)] items-center gap-3 font-semibold text-sm md:text-base">
            Quero ter esses resultados <ArrowRight className="w-5 h-5" />
         </a>
      </div>
    </section>
  );
};

// --- Checkmarks / O que tem direito + Suporte Exclusivo ---
const Garantias = () => {
  const items = [
    "Leitura de exames laboratoriais",
    "Suplementos/manipulados",
    "Plano alimentar individualizado",
    "Avaliação física com bioimpedância",
    "Suporte direto via WhatsApp",
    "Aplicativo exclusivo"
  ];

  return (
    <section className="bg-bg py-20 relative z-10 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-panel p-6 md:p-12 rounded-[30px] md:rounded-[40px] border-accent/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
            
            <h2 className="relative z-10 text-2xl md:text-4xl font-bold mb-8 text-text-primary">
              Na consulta você tem <span className="font-display italic text-light font-normal">direito:</span>
            </h2>
            
            <div className="flex flex-col gap-4 md:gap-6 text-left relative z-10">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 md:gap-4">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-200 text-sm md:text-base">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-stroke/50 text-xs text-light italic relative z-10">
               * Condições especiais e pacotes disponíveis no atendimento particular.
            </div>
          </motion.div>

          <div className="flex flex-col gap-6 md:gap-8">
             <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
             >
               <a href="https://wa.me/5524999015018?text=Ol%C3%A1%20Rafael!%20Vim%20pelo%20seu%20site%20e%20gostaria%20de%20agendar%20uma%20consulta%20nutricional." target="_blank" rel="noreferrer" className="block w-full rounded-[30px] md:rounded-[40px] overflow-hidden shadow-xl hover:scale-[1.02] transition-transform">
                 <img src="/images/suporte-exclusivo.webp" alt="Suporte Exclusivo" className="w-full h-auto object-cover" />
               </a>
             </motion.div>

             <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
             >
               <a href="https://wa.me/5524999015018?text=Ol%C3%A1%20Rafael!%20Vim%20pelo%20seu%20site%20e%20gostaria%20de%20agendar%20uma%20consulta%20nutricional." target="_blank" rel="noreferrer" className="block w-full rounded-[30px] md:rounded-[40px] overflow-hidden shadow-xl hover:scale-[1.02] transition-transform">
                 <img src="/images/AGENDE.webp" alt="Agende sua consulta" className="w-full h-auto object-cover" />
               </a>
             </motion.div>

             <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
             >
               <a href="https://wa.me/5524999015018?text=Ol%C3%A1%20Rafael!%20Vim%20pelo%20seu%20site%20e%20gostaria%20de%20agendar%20uma%20consulta%20nutricional.?text=Ol%C3%A1%20Rafael%2C%20gostaria%20de%20agendar%20uma%20consulta%20nutricional!" target="_blank" rel="noreferrer" className="block w-full rounded-[30px] md:rounded-[40px] overflow-hidden shadow-xl hover:scale-[1.02] transition-transform">
                 <img src="/images/IMGG-CTA.webp" alt="Consultoria" className="w-full h-auto object-cover" />
               </a>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Novo Footer Minimalista Profissional ---
const Footer = () => {
  return (
    <footer className="bg-[#000604] pt-16 pb-8 border-t border-stroke relative z-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
        
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center font-display italic text-2xl font-bold text-white mb-4">RR</div>
          <h3 className="text-white text-lg font-medium mb-1">Rafael Romanha</h3>
          <p className="text-gray-500 text-sm">Nutrição Clínica e Esportiva</p>
        </div>

        {/* Links */}
        <div className="flex gap-16 text-sm">
           <div className="flex flex-col items-center md:items-start gap-3">
             <span className="text-gray-400 font-semibold mb-1">Navegação</span>
             <a href="#início" className="text-gray-500 hover:text-white transition-colors">Início</a>
             <a href="#sobre" className="text-gray-500 hover:text-white transition-colors">Sobre o Mentor</a>
             <a href="#diferenciais" className="text-gray-500 hover:text-white transition-colors">A Metodologia</a>
           </div>
           
           <div className="flex flex-col items-center md:items-start gap-3">
             <span className="text-gray-400 font-semibold mb-1">Contato</span>
             <a href="https://wa.me/5524999015018" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2"><Phone className="w-4 h-4"/> WhatsApp</a>
             <a href="https://www.instagram.com/rafael.romanhanutri/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
               Instagram
             </a>
             <a href="https://www.facebook.com/share/1JKUHV8vo1/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
               Facebook
             </a>
           </div>
        </div>

      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 mt-16 pt-8 border-t border-stroke/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Rafael Romanha. Todos os Direitos Reservados.</p>
        <p>Desenvolvido por: <span className="text-accent font-semibold tracking-wide">DK Sistemas</span></p>
      </div>
    </footer>
  );
};

// --- App ---
function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <main className={`bg-bg min-h-screen ${isLoading ? 'h-screen overflow-hidden' : ''} font-body text-text-primary`}>
        <Navbar />
        <Hero />
        <Partners />
        <Diferenciais />
        <Performance />
        <Sobre />
        <Localizacao />
        <Depoimentos />
        <Garantias />
        <Footer />
      </main>
    </>
  );
}

export default App;
