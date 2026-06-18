import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useConfig from "../hooks/useConfig";
import { useDataSdk } from "../hooks/useDataSdk";
import { useAuth } from "../hooks/AuthContext";
import { supabase } from "../api/supabaseClient";

// Valores por defecto sembrados para LocalStorage
const DEFAULT_HERO_VIDEO = "https://player.vimeo.com/external/459389137.sd.mp4?s=8720e517a1d939bce56a84f32ab0a457&profile_id=165&oauth2_token_id=57447761";

const DEFAULT_REELS = [
  {
    id: "reel-1",
    title: "Cabaña Alpina Nido del Viento",
    system: "Sistema Liviano",
    details: "Diseño A-Frame en medio del bosque, 52m² con deck exterior en pino tratado.",
    videoUrl: "https://player.vimeo.com/external/459389137.sd.mp4?s=8720e517a1d939bce56a84f32ab0a457&profile_id=165&oauth2_token_id=57447761",
    coverUrl: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80",
    likes: 142,
    hasLiked: false,
    whatsappMsg: "Hola Habitech! Me interesó mucho el reel de la Cabaña Alpina Nido del Viento (Sistema Liviano). ¿Me darían información de este proyecto?"
  },
  {
    id: "reel-2",
    title: "Montaje de Vivienda Modular",
    system: "Sistema Prefabricado",
    details: "Vea cómo instalamos la estructura y paneles termoacústicos en solo 10 días.",
    videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054fc2d0d6eef3141f237efb46be98e&profile_id=165&oauth2_token_id=57447761",
    coverUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80",
    likes: 98,
    hasLiked: false,
    whatsappMsg: "Hola Habitech! Vi el reel de Montaje Modular Prefabricado. Quisiera conocer más sobre las opciones de casas prefabricadas."
  },
  {
    id: "reel-3",
    title: "Residencia Campestre Premium",
    system: "Sistema Tradicional",
    details: "Obras con acabados de primera en mampostería reforzada, 180m² de solidez.",
    videoUrl: "https://player.vimeo.com/external/435674703.sd.mp4?s=7fdf7c258d4a6f9f60e90c6ca7a72d73&profile_id=165&oauth2_token_id=57447761",
    coverUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    likes: 215,
    hasLiked: false,
    whatsappMsg: "Hola Habitech! Me llamó la atención el reel de la Residencia Campestre en Sistema Tradicional. Quisiera cotizar una obra similar."
  }
];

const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: "Chalet Alpino Los Pinos",
    category: "liviano",
    area: "48m²",
    location: "Guatavita, Cundinamarca",
    duration: "28 días",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80",
    description: "Espectacular cabaña A-frame en sistema liviano de madera y acero. Diseñado especialmente para rentas turísticas tipo Airbnb, cuenta con un aislamiento térmico de primer nivel para bajas temperaturas, habitación tipo loft en el mezanino y un ventanal panorámico de doble altura que maximiza la iluminación.",
    details: ["Estructura: Acero liviano (Steel Frame) y pino tratado.", "Aislamiento: Lana de vidrio de alta densidad en muros y techo.", "Acabados: Deck de pino inmunizado, ventanería termoacústica."]
  },
  {
    id: 2,
    title: "Vivienda Modular Sopó",
    category: "prefabricado",
    area: "110m²",
    location: "Sopó, Cundinamarca",
    duration: "35 días",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80",
    description: "Casa modular de un solo nivel fabricada industrialmente en taller e instalada en obra en un tiempo récord de 35 días. Cuenta con distribución de 3 habitaciones, 2 baños y una amplia zona social con concepto abierto, maximizando la eficiencia energética gracias a paneles EPS termoacústicos.",
    details: ["Paredes: Paneles estructurales con núcleo de poliuretano inyectado (EPS).", "Tiempo de Montaje: 10 días de ensamble en sitio tras cimentación.", "Eficiencia: Reduce hasta un 40% el consumo de energía en calefacción."]
  },
  {
    id: 3,
    title: "Refugio Glamping El Bosque",
    category: "liviano",
    area: "35m²",
    location: "Villa de Leyva, Boyacá",
    duration: "22 días",
    image: "https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&w=600&q=80",
    description: "Refugio liviano optimizado para climas templados. Su peso reducido permitió construir en una pendiente pronunciada sin necesidad de maquinaria pesada ni cimentaciones de concreto masivas, conservando la vegetación natural y el cauce biológico del terreno.",
    details: ["Cimentación: Pilotes de acero estructural elevados.", "Materiales: Madera certificada inmunizada y cubiertas termo-flexibles.", "Retorno de Inversión: Proyectado a 14 meses operando como Airbnb."]
  },
  {
    id: 4,
    title: "Casa Campestre La Calera",
    category: "tradicional",
    area: "185m²",
    location: "La Calera, Cundinamarca",
    duration: "110 días",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    description: "Residencia unifamiliar construida mediante mampostería reforzada tradicional, con pórticos de concreto y ladrillo a la vista. El diseño arquitectónico personalizado integra una terraza exterior con chimenea, tejas de barro de estilo colonial moderno y una distribución de doble planta con excelentes vistas.",
    details: ["Cimentación: Zapatas y vigas de amarre en concreto reforzado.", "Estructura: Columnas y vigas portantes con muros divisorios de ladrillo estructural.", "Acabados: Fachada combinada con piedra natural, pisos de madera maciza."]
  },
  {
    id: 5,
    title: "Casa Prefabricada Horizon",
    category: "prefabricado",
    area: "85m²",
    location: "El Retiro, Antioquia",
    duration: "30 días",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
    description: "Vivienda prefabricada de diseño contemporáneo y cúbico. Los módulos fueron pre-ensamblados en un 70% en fábrica con especificaciones estrictas de calidad, logrando acabados pulidos y una hermeticidad superior. Incluye amplias puertas corredizas que conectan con la terraza.",
    details: ["Sistema: Placas de cemento curadas en autoclave (Superboard).", "Estructura: Perfiles de acero galvanizado anticorrosivo.", "Adicionales: Cubierta plana transitable y pre-instalación de paneles solares."]
  },
  {
    id: 6,
    title: "Residencia Tradicional San Jerónimo",
    category: "tradicional",
    area: "220m²",
    location: "San Jerónimo, Antioquia",
    duration: "135 días",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
    description: "Magnífica casa de recreo diseñada para clima cálido. Utiliza sistema de construcción tradicional con muros gruesos aislantes, techos altos para favorecer la ventilación cruzada y una gran piscina integrada directamente en la terraza principal. Combina acabados modernos de microcemento y piedra local.",
    details: ["Estructura: Sistema aporticado tradicional antisísmico.", "Piscina: En concreto vaciado con recubrimiento de membrana premium.", "Climatización: Diseño bioclimático pasivo para reducir el aire acondicionado."]
  }
];

export default function Portafolio() {
  const config = useConfig();
  const { createRecord } = useDataSdk();
  const { user, profile } = useAuth();

  const isSuperAdmin = profile?.role === 'superadmin' || user?.email === 'duvanaponteramirez@gmail.com';

  // 1. Estados dinámicos sincronizados con Supabase / LocalStorage
  const [heroVideoUrl, setHeroVideoUrl] = useState(DEFAULT_HERO_VIDEO);
  const [reels, setReels] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function loadPortfolioData() {
      try {
        const { data, error } = await supabase
          .from("portfolio_settings")
          .select("*")
          .eq("id", "global")
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Asignar lo que viene de la BD (con fallback a defaults si las columnas son nulas)
          setHeroVideoUrl(data.hero_video || DEFAULT_HERO_VIDEO);
          setReels(data.reels && data.reels.length > 0 ? data.reels : DEFAULT_REELS);
          setProjects(data.projects && data.projects.length > 0 ? data.projects : DEFAULT_PROJECTS);
          
          // Opcionalmente guardar localmente para el fallback futuro
          localStorage.setItem("habitech_hero_video", data.hero_video || DEFAULT_HERO_VIDEO);
          localStorage.setItem("habitech_reels", JSON.stringify(data.reels && data.reels.length > 0 ? data.reels : DEFAULT_REELS));
          localStorage.setItem("habitech_projects", JSON.stringify(data.projects && data.projects.length > 0 ? data.projects : DEFAULT_PROJECTS));
        } else {
          // Si no existe la fila, usar lo de localStorage o los valores por defecto
          loadFromFallback();
        }
      } catch (err) {
        console.warn("⚠️ No se pudo cargar desde Supabase. Cargando de LocalStorage/Código:", err);
        loadFromFallback();
      }
    }

    function loadFromFallback() {
      // Sincronizar Hero Video
      const savedHero = localStorage.getItem("habitech_hero_video");
      if (savedHero) {
        setHeroVideoUrl(savedHero);
      } else {
        localStorage.setItem("habitech_hero_video", DEFAULT_HERO_VIDEO);
        setHeroVideoUrl(DEFAULT_HERO_VIDEO);
      }

      // Sincronizar Reels
      const savedReels = localStorage.getItem("habitech_reels");
      if (savedReels) {
        setReels(JSON.parse(savedReels));
      } else {
        localStorage.setItem("habitech_reels", JSON.stringify(DEFAULT_REELS));
        setReels(DEFAULT_REELS);
      }

      // Sincronizar Proyectos
      const savedProjects = localStorage.getItem("habitech_projects");
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      } else {
        localStorage.setItem("habitech_projects", JSON.stringify(DEFAULT_PROJECTS));
        setProjects(DEFAULT_PROJECTS);
      }
    }

    loadPortfolioData();
  }, []);

  const [mutedGlobal, setMutedGlobal] = useState(true);
  const [playingReelId, setPlayingReelId] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // NUEVO: Estado del Modal estilo TikTok
  const [activeReelModalIndex, setActiveReelModalIndex] = useState(null);
  const [modalVideoPaused, setModalVideoPaused] = useState(false);
  const [showFlashIcon, setShowFlashIcon] = useState(""); // "play" o "pause"
  const [modalProgress, setModalProgress] = useState(0);

  const modalVideoRef = useRef(null);
  const touchStartY = useRef(0);
  const wheelTimeout = useRef(null);

  // Inicializar primer reel activo una vez que los reels carguen en la grilla
  useEffect(() => {
    if (reels.length > 0 && !playingReelId) {
      setPlayingReelId(reels[0].id);
    }
  }, [reels]);

  // Manejar referencias dinámicas para los videos de reels en la grilla
  const videoRefs = useRef({});

  // Efecto para manejar qué video de la grilla se reproduce
  useEffect(() => {
    if (activeReelModalIndex !== null) {
      // Si el modal de TikTok está abierto, pausamos todos los videos de fondo
      reels.forEach((reel) => {
        const video = videoRefs.current[reel.id];
        if (video) video.pause();
      });
    } else {
      // Si el modal está cerrado, reproducimos el reel activo en la grilla
      reels.forEach((reel) => {
        const video = videoRefs.current[reel.id];
        if (video) {
          if (reel.id === playingReelId) {
            video.play().catch((err) => console.log("Auto-play blocked:", err));
          } else {
            video.pause();
          }
        }
      });
    }
  }, [playingReelId, activeReelModalIndex, reels]);

  // Efecto para reproducir/reiniciar automáticamente el video del Modal de TikTok al deslizar
  useEffect(() => {
    if (activeReelModalIndex !== null && modalVideoRef.current) {
      modalVideoRef.current.load();
      modalVideoRef.current.play()
        .then(() => {
          setModalVideoPaused(false);
        })
        .catch(err => console.log("Modal autoplay blocked:", err));
      setModalProgress(0);
    }
  }, [activeReelModalIndex]);

  // Evento de teclado global para el modal
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (activeReelModalIndex !== null) {
        if (e.key === "ArrowDown") {
          handleNextReelModal();
        } else if (e.key === "ArrowUp") {
          handlePrevReelModal();
        } else if (e.key === "Escape") {
          setActiveReelModalIndex(null);
        }
      }
    };
    
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [activeReelModalIndex, reels]);

  const handleNextReelModal = () => {
    if (activeReelModalIndex !== null && activeReelModalIndex < reels.length - 1) {
      setActiveReelModalIndex(activeReelModalIndex + 1);
    }
  };

  const handlePrevReelModal = () => {
    if (activeReelModalIndex !== null && activeReelModalIndex > 0) {
      setActiveReelModalIndex(activeReelModalIndex - 1);
    }
  };

  // Desplazamiento por scroll del ratón en el modal (Debounce de 800ms)
  const handleWheel = (e) => {
    if (activeReelModalIndex === null) return;
    e.preventDefault();
    if (wheelTimeout.current) return;
    
    wheelTimeout.current = setTimeout(() => {
      wheelTimeout.current = null;
    }, 850);
    
    if (e.deltaY > 0) {
      handleNextReelModal();
    } else {
      handlePrevReelModal();
    }
  };

  // Gestos táctiles para el modal
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (activeReelModalIndex === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;

    // Desplazamiento mínimo de 60px para evitar falsos positivos
    if (Math.abs(deltaY) > 60) {
      if (deltaY < 0) {
        handleNextReelModal();
      } else {
        handlePrevReelModal();
      }
    }
  };

  // Pausar y reproducir al hacer clic en el video del modal
  const toggleModalPlayPause = () => {
    const video = modalVideoRef.current;
    if (video) {
      if (video.paused) {
        video.play().catch(err => console.log(err));
        setModalVideoPaused(false);
        setShowFlashIcon("play");
      } else {
        video.pause();
        setModalVideoPaused(true);
        setShowFlashIcon("pause");
      }
      setTimeout(() => setShowFlashIcon(""), 600);
    }
  };

  // Actualizar barra de progreso del modal
  const handleModalTimeUpdate = () => {
    const video = modalVideoRef.current;
    if (video) {
      const pct = (video.currentTime / video.duration) * 100;
      setModalProgress(pct || 0);
    }
  };

  // Manejar el me gusta
  const handleLike = (id) => {
    const updatedReels = reels.map(reel => {
      if (reel.id === id) {
        return {
          ...reel,
          likes: reel.hasLiked ? reel.likes - 1 : reel.likes + 1,
          hasLiked: !reel.hasLiked
        };
      }
      return reel;
    });
    setReels(updatedReels);
    localStorage.setItem("habitech_reels", JSON.stringify(updatedReels));
  };

  // Copiar link y mostrar toast
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage("¡Enlace de portafolio copiado al portapapeles! 📋");
    setTimeout(() => setToastMessage(""), 3000);
  };

  // 2. Estados para el Cotizador Inteligente
  const [calcStep, setCalcStep] = useState(1);
  const [calcData, setCalcData] = useState({
    sistema: "",
    area: "",
    ubicacion: "",
    nombre: "",
    telefono: "",
    email: ""
  });
  const [calcResult, setCalcResult] = useState(null);
  const [calcSubmitting, setCalcSubmitting] = useState(false);

  const calculateEstimate = () => {
    let costPerM2 = 0;
    let baseArea = 0;

    switch (calcData.area) {
      case "30-50": baseArea = 40; break;
      case "50-80": baseArea = 65; break;
      case "80-120": baseArea = 100; break;
      case "120+": baseArea = 150; break;
      default: baseArea = 50;
    }

    switch (calcData.sistema) {
      case "prefabricado":
        costPerM2 = 1450000;
        break;
      case "liviano":
        costPerM2 = 1950000;
        break;
      case "tradicional":
        costPerM2 = 2700000;
        break;
      default:
        costPerM2 = 1800000;
    }

    const totalCOP = costPerM2 * baseArea;
    const totalUSD = Math.round(totalCOP / 4000);

    const minCOP = Math.round((totalCOP * 0.85) / 100000) * 100000;
    const maxCOP = Math.round((totalCOP * 1.15) / 100000) * 100000;
    const minUSD = Math.round(minCOP / 4000);
    const maxUSD = Math.round(maxCOP / 4000);

    return {
      minCOP: minCOP.toLocaleString("es-CO"),
      maxCOP: maxCOP.toLocaleString("es-CO"),
      minUSD: minUSD.toLocaleString("en-US"),
      maxUSD: maxUSD.toLocaleString("en-US"),
      baseArea,
      costPerM2: costPerM2.toLocaleString("es-CO")
    };
  };

  const handleNextStep = () => {
    if (calcStep === 1 && !calcData.sistema) return;
    if (calcStep === 2 && !calcData.area) return;
    if (calcStep === 3 && !calcData.ubicacion.trim()) return;

    if (calcStep === 3) {
      setCalcStep(4);
    } else {
      setCalcStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCalcStep(prev => prev - 1);
  };

  const handleCalcSubmit = async (e) => {
    e.preventDefault();
    if (!calcData.nombre || !calcData.telefono || !calcData.email) return;

    setCalcSubmitting(true);
    const result = calculateEstimate();
    setCalcResult(result);

    const leadRecord = {
      nombre: calcData.nombre.trim(),
      email: calcData.email.trim(),
      telefono: calcData.telefono.trim(),
      tipo_proyecto: `Cotizador Portafolio: ${calcData.sistema}`,
      mensaje: `Cotización automática calculada para terreno en ${calcData.ubicacion} con área ${calcData.area} m². Estimado calculado: COP $${result.minCOP} - $${result.maxCOP}.`,
      origen: "Cotizador Inteligente Portafolio",
      created_at: new Date().toISOString()
    };

    await createRecord(leadRecord);
    setCalcSubmitting(false);
    setCalcStep(5);
  };

  const resetCalculator = () => {
    setCalcStep(1);
    setCalcData({
      sistema: "",
      area: "",
      ubicacion: "",
      nombre: "",
      telefono: "",
      email: ""
    });
    setCalcResult(null);
  };

  const getCalcWhatsAppUrl = () => {
    if (!calcResult) return "";
    const systemName = calcData.sistema === "prefabricado" ? "Prefabricado" : calcData.sistema === "liviano" ? "Liviano (Glampings/Alpinas)" : "Tradicional";
    const text = `Hola Habitech! 👋 Acabo de realizar una cotización en su web:\n\n*Proyecto:* Casa/Cabaña ${systemName}\n*Área:* ${calcData.area} m² aprox.\n*Ubicación:* ${calcData.ubicacion}\n*Rango Estimado:* COP $${calcResult.minCOP} - $${calcResult.maxCOP} (USD $${calcResult.minUSD} - $${calcResult.maxUSD})\n\n*Nombre:* ${calcData.nombre}\n*WhatsApp:* ${calcData.telefono}\n\nMe gustaría agendar una asesoría gratuita para revisar los planos y detalles del proyecto.`;
    return `https://wa.me/573000000000?text=${encodeURIComponent(text)}`;
  };

  // 3. Estados para Galería Filtrable
  const [filter, setFilter] = useState("todos");
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = filter === "todos"
    ? projects
    : projects.filter(p => p.category === filter);

  // 4. Estados para FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const faqs = [
    {
      question: "¿Cuál es la diferencia real de precio entre el sistema prefabricado y el tradicional?",
      answer: "El sistema prefabricado permite un ahorro promedio del 25% al 35% en comparación con la construcción tradicional. Esto se debe principalmente a la reducción extrema en tiempos de mano de obra en sitio, la optimización industrializada de los materiales (cero desperdicio de cemento, acero o ladrillos) y la certeza del costo final desde el día uno."
    },
    {
      question: "¿Los sistemas livianos (glampings y alpinas) son aptos para climas muy fríos o lluviosos?",
      answer: "Sí, absolutamente. De hecho, el sistema liviano (Wood Frame / Steel Frame) permite rellenar el interior de los muros con materiales termoacústicos como lana de roca o fibra de vidrio, ofreciendo una resistencia térmica hasta 4 veces superior a una pared de ladrillo tradicional. Esto mantiene la cabaña templada y reduce significativamente los costos de calefacción en zonas frías como Guatavita o Villa de Leyva."
    },
    {
      question: "¿Qué incluye la entrega 'Llave en Mano' de Habitech?",
      answer: "Nuestra modalidad 'Llave en Mano' incluye todo lo necesario para habitar de inmediato: diseño arquitectónico básico y planos de taller, trámite de licencias de construcción (asesoría de radicación), cimentación adaptada al tipo de suelo, instalación de estructura, redes eléctricas, sanitarias e hidráulicas internas, pintura, sanitarios, lavamanos, grifería, puertas e interruptores. No incluye la acometida de servicios públicos desde la calle hasta la casa (que depende de la empresa de servicios públicos local)."
    },
    {
      question: "¿Es posible personalizar los planos en los modelos prefabricados?",
      answer: "Sí. A diferencia de las casas prefabricadas clásicas rígidas, nuestro sistema de paneles modulares nos permite adaptar los planos a tus necesidades específicas. Podemos expandir áreas de habitaciones, reubicar baños o añadir terrazas exteriores sin comprometer la ingeniería estructural."
    },
    {
      question: "¿Qué tipo de garantía ofrecen en sus obras?",
      answer: "En Habitech cumplimos estrictamente con la legislación colombiana (Ley de Vivienda Segura). Ofrecemos una garantía de 10 años por estabilidad estructural y fallas del terreno que afecten la estructura, y 1 año de garantía en acabados, tuberías, pintura e instalaciones eléctricas a partir del día de la firma del acta de entrega oficial."
    }
  ];

  // 5. Estado de contacto de respaldo
  const [contactState, setContactState] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: ""
  });
  const [contactStatus, setContactStatus] = useState("");

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactState.nombre || !contactState.email) return;

    setContactStatus("sending");
    const record = {
      nombre: contactState.nombre.trim(),
      email: contactState.email.trim(),
      telefono: contactState.telefono.trim(),
      mensaje: contactState.mensaje.trim(),
      origen: "Formulario Respaldo Portafolio",
      created_at: new Date().toISOString()
    };

    const res = await createRecord(record);
    if (res && res.isOk) {
      setContactStatus("success");
      setContactState({ nombre: "", email: "", telefono: "", mensaje: "" });
    } else {
      setContactStatus("error");
    }
  };

  return (
    <div id="app-root" className="w-full bg-[#fafbfc] text-[#172c34]">
      {/* BANNER SUPERADMIN DE ACCESO RÁPIDO */}
      {isSuperAdmin && (
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white font-extrabold text-xs uppercase px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl z-50 relative border-b border-orange-500/40">
          <div className="flex items-center gap-2">
            <span>🛡️ Modo Superadmin Activo:</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] tracking-widest">{user?.email}</span>
          </div>
          <Link 
            to="/dashboard/superadmin" 
            className="bg-[#172c34] hover:bg-[#0f1d22] text-white font-black px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-[10px] tracking-widest"
          >
            ⚙️ PANEL DE CONTROL SUPERADMIN
          </Link>
        </div>
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] bg-[#172c34] text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 animate-bounce border border-orange-500">
          <span>✨</span> {toastMessage}
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#172c34] text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0f1d22] opacity-80"></div>
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-block bg-orange-600/20 text-orange-400 font-extrabold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-orange-500/30">
              CONSTRUCTORA HABITECH PORTAFOLIO
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Proyectos Reales,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                Diseños Extraordinarios
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
              Explora nuestros proyectos ejecutados a través de video reels. Compara sistemas constructivos y cotiza en línea al instante la casa o cabaña de tus sueños.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#cotizador"
                className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold uppercase text-sm px-8 py-4 rounded-xl transition-all shadow-xl shadow-orange-950/20 active:scale-95"
              >
                🛠️ Cotizar Mi Proyecto
              </a>
              <a
                href="#reels"
                className="bg-white/10 hover:bg-white/20 text-white font-extrabold uppercase text-sm px-8 py-4 rounded-xl border border-white/20 transition-all active:scale-95"
              >
                🎬 Ver Reels de Obra
              </a>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-xl">
              <div>
                <p className="text-3xl font-black text-orange-400">100%</p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Garantizado</p>
              </div>
              <div>
                <p className="text-3xl font-black text-orange-400">+{projects.length + 70}</p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Obras Listas</p>
              </div>
              <div>
                <p className="text-3xl font-black text-orange-400">Llave</p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">En Mano</p>
              </div>
            </div>
          </div>

          {/* Reel Destacado en Hero */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[320px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white/10 bg-[#122228] group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10 pointer-events-none"></div>
              
              <img 
                src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80" 
                alt="Chalet Cover" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
              />

              <video
                src={heroVideoUrl}
                loop
                muted={mutedGlobal}
                playsInline
                autoPlay
                className="absolute inset-0 w-full h-full object-cover z-0 cursor-pointer"
                onClick={(e) => {
                  if (e.target.paused) e.target.play();
                  else e.target.pause();
                }}
              />

              <button 
                onClick={() => setMutedGlobal(!mutedGlobal)}
                className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 p-2.5 rounded-full text-white transition-all scale-95 hover:scale-100"
              >
                {mutedGlobal ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-5 z-20 space-y-2 pointer-events-auto">
                <span className="bg-orange-600 text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded">
                  Vídeo Principal
                </span>
                <h3 className="font-extrabold text-base text-white line-clamp-1">
                  Obra Habitech Tour
                </h3>
                <p className="text-gray-300 text-xs font-medium line-clamp-2">
                  Visualiza nuestros acabados interiores premium y el confort de habitar un diseño inteligente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REELS SECTION */}
      <section id="reels" className="py-20 max-w-6xl mx-auto px-4 text-center space-y-12">
        <div className="space-y-4">
          <span className="text-orange-600 font-extrabold text-xs uppercase tracking-widest">
            EXPERIENCIA INMERSIVA
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#172c34]">
            Nuestras Obras en 30 Segundos
          </h2>
          <p className="text-gray-500 font-medium text-base max-w-2xl mx-auto">
            Selecciona cualquier Reel de la grilla para abrir el **reproductor vertical inmersivo estilo TikTok**, donde podrás deslizar (hacia arriba/abajo) para ver todos los videos de manera fluida.
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 bg-orange-50 border border-orange-200 rounded-2xl py-3 px-6 max-w-lg mx-auto">
          <span className="text-xl">📢</span>
          <p className="text-sm font-bold text-[#172c34] text-left">
            ¿Quieres escuchar el audio de los videos? Activa el sonido global:
          </p>
          <button 
            onClick={() => setMutedGlobal(!mutedGlobal)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${
              !mutedGlobal ? 'bg-orange-600 text-white' : 'bg-white text-[#172c34] border border-gray-200'
            }`}
          >
            {!mutedGlobal ? "🔊 Sonido Activo" : "🔇 Sonido Desactivado"}
          </button>
        </div>

        {/* Grid de Reels */}
        <div className="grid md:grid-cols-3 gap-8 pt-4">
          {reels.map((reel, index) => {
            const isPlaying = playingReelId === reel.id;
            return (
              <div 
                key={reel.id}
                onClick={() => setActiveReelModalIndex(index)}
                className={`relative aspect-[9/16] rounded-3xl overflow-hidden shadow-xl border-4 transition-all duration-300 bg-[#122228] group cursor-pointer ${
                  isPlaying ? 'border-orange-500 ring-4 ring-orange-500/10 scale-102 shadow-orange-100' : 'border-white hover:border-gray-200'
                }`}
              >
                {/* Visual indicator of "Tiktok style access" */}
                <div className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-wider flex items-center gap-1">
                  <span>🎬</span> Ver pantalla completa
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 z-10 pointer-events-none"></div>

                <img 
                  src={reel.coverUrl} 
                  alt={reel.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 z-0 transition-transform duration-700 group-hover:scale-105"
                />

                <video
                  ref={(el) => (videoRefs.current[reel.id] = el)}
                  src={reel.videoUrl}
                  loop
                  muted={mutedGlobal}
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />

                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 opacity-70 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/95 text-[#172c34] p-4 rounded-full shadow-2xl transform scale-90 group-hover:scale-100 transition-all duration-300">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 z-20 text-left space-y-2 pointer-events-auto">
                  <span className="inline-block bg-orange-600 text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded">
                    {reel.system}
                  </span>
                  <h3 className="font-extrabold text-base text-white line-clamp-1">
                    {reel.title}
                  </h3>
                  <p className="text-gray-300 text-xs font-semibold leading-relaxed line-clamp-2">
                    {reel.details}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-white/10" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleLike(reel.id)}
                        className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full transition-colors ${
                          reel.hasLiked ? 'bg-red-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        <span>{reel.hasLiked ? "❤️" : "🤍"}</span>
                        <span>{reel.likes}</span>
                      </button>
                    </div>

                    <a 
                      href={`https://wa.me/573000000000?text=${encodeURIComponent(reel.whatsappMsg || '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1 active:scale-95 transition-transform"
                    >
                      <span>Cotizar</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TIKTOK STYLE FULL SCREEN REELS MODAL */}
      {activeReelModalIndex !== null && reels.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/95 z-[99999] flex items-center justify-center animate-in fade-in duration-300"
          onWheel={handleWheel}
        >
          {/* BOTÓN CERRAR MODAL */}
          <button 
            onClick={() => setActiveReelModalIndex(null)}
            className="absolute top-6 right-6 z-50 bg-[#172c34]/80 border border-white/10 hover:bg-[#ff6b00] text-white rounded-full w-12 h-12 flex items-center justify-center font-black transition-all hover:scale-105 active:scale-95 shadow-2xl text-lg"
            title="Cerrar reproductor"
          >
            ✕
          </button>

          {/* CONTENEDOR CENTRAL MÓVIL ESTILO TIKTOK */}
          <div 
            className="relative w-full max-w-[450px] h-full md:h-[90vh] bg-[#0c1214] md:rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border border-white/10"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* VIDEO PLAYER */}
            <video
              ref={modalVideoRef}
              src={reels[activeReelModalIndex].videoUrl}
              loop
              muted={mutedGlobal}
              playsInline
              onClick={toggleModalPlayPause}
              onTimeUpdate={handleModalTimeUpdate}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* CONTROL PLAY/PAUSA FLASH ANIMADO EN EL CENTRO */}
            {showFlashIcon && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                <div className="bg-black/60 text-white p-5 rounded-full animate-ping">
                  {showFlashIcon === "play" ? (
                    <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  )}
                </div>
              </div>
            )}

            {/* BOTÓN PLAY EN EL CENTRO SI ESTÁ PAUSADO */}
            {modalVideoPaused && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/20 z-20 cursor-pointer"
                onClick={toggleModalPlayPause}
              >
                <div className="bg-[#ff6b00] text-white p-5 rounded-full shadow-2xl transform scale-100 hover:scale-105 transition-all">
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}

            {/* GRADIENTES DE LEIBILIDAD */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none z-10"></div>

            {/* BOTONES FLOTANTES DE NAVEGACIÓN VERTICAL (DESKTOP) */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 hidden md:flex">
              {activeReelModalIndex > 0 && (
                <button 
                  onClick={handlePrevReelModal}
                  className="bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full shadow-lg border border-white/10 active:scale-95"
                  title="Video anterior"
                >
                  ▲
                </button>
              )}
              {activeReelModalIndex < reels.length - 1 && (
                <button 
                  onClick={handleNextReelModal}
                  className="bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full shadow-lg border border-white/10 active:scale-95"
                  title="Siguiente video"
                >
                  ▼
                </button>
              )}
            </div>

            {/* INFO PANEL (Base del Video) */}
            <div className="absolute bottom-6 left-0 right-16 p-5 z-20 text-left space-y-3 pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="bg-orange-600 text-white font-extrabold text-[9px] uppercase px-2 py-0.5 rounded shadow-sm">
                  {reels[activeReelModalIndex].system}
                </span>
                <span className="text-white text-xs font-bold opacity-80">
                  @habitech.co
                </span>
              </div>
              
              <h3 className="font-extrabold text-base text-white leading-tight">
                {reels[activeReelModalIndex].title}
              </h3>
              
              <p className="text-gray-300 text-xs font-semibold leading-relaxed line-clamp-2">
                {reels[activeReelModalIndex].details}
              </p>

              {/* Botón WhatsApp de Acción Inmediata */}
              <div className="pt-2">
                <a 
                  href={`https://wa.me/573000000000?text=${encodeURIComponent(reels[activeReelModalIndex].whatsappMsg || '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.233-1.371a9.936 9.936 0 004.779 1.229h.005c5.505 0 9.988-4.478 9.989-9.985a9.983 9.983 0 00-3-7.061A9.922 9.922 0 0012.012 2zm5.727 14.126c-.312.879-1.536 1.62-2.106 1.706-.57.086-1.127.353-3.619-.676-2.99-1.239-4.887-4.286-5.037-4.485-.15-.199-1.196-1.593-1.196-3.039 0-1.447.749-2.155 1.018-2.438.27-.284.599-.355.799-.355.2 0 .399.002.573.01.183.008.43-.072.673.513.25.599.855 2.083.929 2.233.075.15.124.324.025.523-.1.199-.15.324-.299.497-.15.174-.316.388-.45.52-.15.149-.306.312-.132.61.174.299.773 1.276 1.662 2.067.942.841 1.737 1.101 1.986 1.225.25.124.394.1.537-.062.144-.162.623-.722.793-.97.168-.249.336-.211.566-.124.23.087 1.458.687 1.708.812.249.124.417.186.479.299.062.112.062.649-.25 1.528z"/>
                  </svg>
                  <span>Cotizar esta Obra 💬</span>
                </a>
              </div>
            </div>

            {/* PANEL DE ACCIONES LATERALES (Derecha) */}
            <div className="absolute bottom-16 right-3 flex flex-col items-center gap-5 z-20 pointer-events-auto">
              
              {/* Spinning Logo / Profile */}
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative shadow-lg bg-[#172c34] flex items-center justify-center animate-spin duration-10000 ease-linear">
                <img src="/logoHabitech.png" alt="Profile" className="w-7 h-7 object-contain" />
              </div>

              {/* Botón Like */}
              <div className="flex flex-col items-center gap-1">
                <button 
                  onClick={() => handleLike(reels[activeReelModalIndex].id)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                    reels[activeReelModalIndex].hasLiked 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' 
                      : 'bg-black/50 text-white hover:bg-black/70'
                  }`}
                >
                  <span className="text-xl">{reels[activeReelModalIndex].hasLiked ? "❤️" : "🤍"}</span>
                </button>
                <span className="text-[10px] text-white font-black">{reels[activeReelModalIndex].likes}</span>
              </div>

              {/* Botón Sonido */}
              <div className="flex flex-col items-center gap-1">
                <button 
                  onClick={() => setMutedGlobal(!mutedGlobal)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center bg-black/50 text-white hover:bg-black/70`}
                >
                  <span className="text-sm">{mutedGlobal ? "🔇" : "🔊"}</span>
                </button>
                <span className="text-[9px] text-white font-bold uppercase tracking-tighter">{mutedGlobal ? "Silenciado" : "Activo"}</span>
              </div>

              {/* Botón Compartir */}
              <div className="flex flex-col items-center gap-1">
                <button 
                  onClick={handleShare}
                  className="w-11 h-11 rounded-full flex items-center justify-center bg-black/50 text-white hover:bg-black/70 active:scale-90 transition-transform"
                  title="Copiar enlace"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 10.742l4.606-2.303m0 0a3 3 0 10-3.003-3.003m3.003 3.003a3 3 0 103.003 3.003m-3.003-3.003l-4.606 2.303m0 0a3 3 0 10-3.003 3.003" />
                  </svg>
                </button>
                <span className="text-[9px] text-white font-bold uppercase tracking-tighter">Compartir</span>
              </div>

              {/* Direct WhatsApp CTA Button */}
              <a 
                href={`https://wa.me/573000000000?text=${encodeURIComponent(reels[activeReelModalIndex].whatsappMsg || '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 active:scale-90 transition-transform"
                title="Escribir por WhatsApp"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.233-1.371a9.936 9.936 0 004.779 1.229h.005c5.505 0 9.988-4.478 9.989-9.985a9.983 9.983 0 00-3-7.061A9.922 9.922 0 0012.012 2zm5.727 14.126c-.312.879-1.536 1.62-2.106 1.706-.57.086-1.127.353-3.619-.676-2.99-1.239-4.887-4.286-5.037-4.485-.15-.199-1.196-1.593-1.196-3.039 0-1.447.749-2.155 1.018-2.438.27-.284.599-.355.799-.355.2 0 .399.002.573.01.183.008.43-.072.673.513.25.599.855 2.083.929 2.233.075.15.124.324.025.523-.1.199-.15.324-.299.497-.15.174-.316.388-.45.52-.15.149-.306.312-.132.61.174.299.773 1.276 1.662 2.067.942.841 1.737 1.101 1.986 1.225.25.124.394.1.537-.062.144-.162.623-.722.793-.97.168-.249.336-.211.566-.124.23.087 1.458.687 1.708.812.249.124.417.186.479.299.062.112.062.649-.25 1.528z"/>
                </svg>
              </a>
            </div>

            {/* BARRA DE PROGRESO DE REPRODUCCIÓN */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-30">
              <div 
                className="bg-orange-500 h-full transition-all duration-100" 
                style={{ width: `${modalProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* COMPARATIVO DE LOS 3 SISTEMAS CONSTRUCTIVOS */}
      <section className="bg-white border-y border-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-orange-600 font-extrabold text-xs uppercase tracking-widest">
              SISTEMAS CONSTRUCTIVOS
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#172c34]">
              ¿Cómo Construimos Tu Proyecto?
            </h2>
            <p className="text-gray-500 font-medium text-base max-w-2xl mx-auto">
              Contamos con tres métodos de edificación certificados. Elige el que mejor se adapte a tu presupuesto, tiempo disponible y terreno.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 pt-4">
            {/* Sistema 1: Prefabricado */}
            <div className="border border-gray-100 rounded-3xl p-6 bg-[#fafbfc] flex flex-col justify-between hover:shadow-xl hover:border-gray-200 transition-all group">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <span className="text-3xl">🏗️</span>
                  <span className="bg-orange-100 text-orange-700 font-black text-[10px] uppercase px-3 py-1 rounded-full">
                    Ahorro y Rapidez
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#172c34]">1. Sistema Prefabricado</h3>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-wide">Estructuras Modulares Modernas</p>
                </div>
                <p className="text-gray-600 text-sm font-semibold leading-relaxed">
                  Basado en placas de cemento autoclavado (Superboard) u hormigón modular y perfiles metálicos galvanizados. Se fabrica bajo estrictos estándares industriales, minimizando desperdicios en obra.
                </p>
                
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase">Aislamiento Térmico</span>
                    <span className="font-extrabold text-[#172c34]">Medio / Alto</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase">Tiempo de Entrega</span>
                    <span className="font-extrabold text-[#172c34]">30 - 45 días</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase">Costo Relativo</span>
                    <span className="font-extrabold text-orange-600">$$ (Económico)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase">Garantía Estructural</span>
                    <span className="font-extrabold text-[#172c34]">10 Años</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="#cotizador"
                  onClick={() => setCalcData(prev => ({ ...prev, sistema: "prefabricado" }))}
                  className="block text-center w-full bg-[#172c34] hover:bg-[#ff6b00] hover:text-white text-white font-extrabold text-xs uppercase py-3.5 rounded-xl transition-all shadow-md group-hover:scale-[1.02]"
                >
                  Cotizar Prefabricado
                </a>
              </div>
            </div>

            {/* Sistema 2: Liviano (Glampings y Alpinas) */}
            <div className="border border-orange-500/30 rounded-3xl p-6 bg-orange-50/20 flex flex-col justify-between hover:shadow-xl hover:border-orange-500/50 transition-all relative group">
              <div className="absolute -top-3.5 left-6 bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
                RECOMENDADO PARA TURISMO
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start pt-2">
                  <span className="text-3xl">🏔️</span>
                  <span className="bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase px-3 py-1 rounded-full">
                    Eco-Eficiente
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#172c34]">2. Sistema Liviano</h3>
                  <p className="text-orange-600 font-bold text-xs uppercase tracking-wide">Cabañas Alpinas & Glampings</p>
                </div>
                <p className="text-gray-600 text-sm font-semibold leading-relaxed">
                  Ideal para terrenos rurales, pendientes de montaña y proyectos hoteleros/Airbnb. Combina marcos de madera inmunizada y acero (Steel Frame) con núcleo multicapa termoacústico y amplios ventanales.
                </p>
                
                <div className="space-y-3 pt-4 border-t border-orange-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase">Aislamiento Térmico</span>
                    <span className="font-extrabold text-emerald-700">Excelente (Multicapa)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase">Tiempo de Entrega</span>
                    <span className="font-extrabold text-[#172c34]">25 - 30 días</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase">Costo Relativo</span>
                    <span className="font-extrabold text-orange-600">$$$ (Equilibrado)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase">Impacto Ambiental</span>
                    <span className="font-extrabold text-emerald-700">Mínimo / Ecológico</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="#cotizador"
                  onClick={() => setCalcData(prev => ({ ...prev, sistema: "liviano" }))}
                  className="block text-center w-full bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs uppercase py-3.5 rounded-xl transition-all shadow-md group-hover:scale-[1.02]"
                >
                  Cotizar Cabaña Alpina
                </a>
              </div>
            </div>

            {/* Sistema 3: Tradicional */}
            <div className="border border-gray-100 rounded-3xl p-6 bg-[#fafbfc] flex flex-col justify-between hover:shadow-xl hover:border-gray-200 transition-all group">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <span className="text-3xl">🧱</span>
                  <span className="bg-gray-200 text-gray-700 font-black text-[10px] uppercase px-3 py-1 rounded-full">
                    Máxima Robustez
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#172c34]">3. Sistema Tradicional</h3>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-wide">Mampostería Reforzada Clásica</p>
                </div>
                <p className="text-gray-600 text-sm font-semibold leading-relaxed">
                  Ladrillo, concreto estructural, cemento y columnas reforzadas. Permite total flexibilidad en el diseño de planos arquitectónicos a medida y alturas complejas. Estabilidad y plusvalía garantizada.
                </p>
                
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase">Aislamiento Térmico</span>
                    <span className="font-extrabold text-[#172c34]">Alto (Por ladrillo)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase">Tiempo de Entrega</span>
                    <span className="font-extrabold text-[#172c34]">90 - 120 días</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase">Costo Relativo</span>
                    <span className="font-extrabold text-orange-600">$$$$ (Alto)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase">Durabilidad</span>
                    <span className="font-extrabold text-[#172c34]">Centenaria</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="#cotizador"
                  onClick={() => setCalcData(prev => ({ ...prev, sistema: "tradicional" }))}
                  className="block text-center w-full bg-[#172c34] hover:bg-[#ff6b00] hover:text-white text-white font-extrabold text-xs uppercase py-3.5 rounded-xl transition-all shadow-md group-hover:scale-[1.02]"
                >
                  Cotizar Obra Tradicional
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COTIZADOR INTELIGENTE (Conversion Engine) */}
      <section id="cotizador" className="py-20 bg-gradient-to-b from-slate-50 to-slate-100 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center space-y-4 mb-10">
            <span className="bg-orange-100 text-orange-800 font-extrabold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full">
              COTIZACIÓN INSTANTÁNEA
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#172c34] tracking-tight">
              Calcula el Presupuesto de tu Proyecto
            </h2>
            <p className="text-gray-500 font-medium text-sm max-w-xl mx-auto">
              Completa las 4 breves preguntas y nuestro cotizador inteligente simulará el costo de obra estimado inmediatamente.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/60 shadow-2xl p-6 md:p-10 relative overflow-hidden">
            {calcStep <= 4 && (
              <div className="w-full bg-gray-100 h-2 rounded-full mb-8 relative overflow-hidden">
                <div 
                  className="bg-orange-600 h-full transition-all duration-500" 
                  style={{ width: `${(calcStep / 4) * 100}%` }}
                ></div>
              </div>
            )}

            {/* PASO 1: SISTEMA */}
            {calcStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-extrabold text-[#172c34] text-center">
                  Paso 1: ¿Qué sistema constructivo prefieres?
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { id: "prefabricado", name: "Modular Prefabricado", desc: "Velocidad y ahorro con paneles modulares.", icon: "🏗️" },
                    { id: "liviano", name: "Liviano (Alpinas / Glamping)", desc: "Estilo ecológico en madera y acero para turismo.", icon: "🏔️" },
                    { id: "tradicional", name: "Mampostería Tradicional", desc: "El método clásico de ladrillo y concreto a la medida.", icon: "🧱" }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCalcData(prev => ({ ...prev, sistema: opt.id }))}
                      className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-102 flex flex-col justify-between gap-4 ${
                        calcData.sistema === opt.id 
                          ? 'border-orange-500 bg-orange-50/20' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <span className="text-3xl">{opt.icon}</span>
                      <div>
                        <h4 className="font-extrabold text-[#172c34] text-sm mb-1">{opt.name}</h4>
                        <p className="text-gray-500 text-xs font-semibold leading-relaxed">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!calcData.sistema}
                    className="bg-orange-600 disabled:opacity-50 text-white font-extrabold uppercase text-xs px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Siguiente Paso →
                  </button>
                </div>
              </div>
            )}

            {/* PASO 2: ÁREA EN M2 */}
            {calcStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-extrabold text-[#172c34] text-center">
                  Paso 2: ¿Qué tamaño estimado tiene tu construcción?
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: "30-50", label: "Cabaña Pequeña", size: "30 - 50 m²", desc: "Ideal para glamping, cuarto de huéspedes o refugio." },
                    { id: "50-80", label: "Casa Pequeña", size: "50 - 80 m²", desc: "2 habitaciones, concepto compacto eficiente." },
                    { id: "80-120", label: "Casa Mediana", size: "80 - 120 m²", desc: "3 habitaciones, ideal para familias." },
                    { id: "120+", label: "Residencia Grande", size: "Más de 120 m²", desc: "Amplios espacios, acabados premium." }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCalcData(prev => ({ ...prev, area: opt.id }))}
                      className={`p-5 rounded-2xl border-2 text-left transition-all hover:scale-102 flex flex-col justify-between gap-3 ${
                        calcData.area === opt.id 
                          ? 'border-orange-500 bg-orange-50/20' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div>
                        <h4 className="font-extrabold text-[#172c34] text-sm mb-0.5">{opt.label}</h4>
                        <p className="text-orange-600 font-black text-base">{opt.size}</p>
                      </div>
                      <p className="text-gray-500 text-xs font-semibold leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="border border-gray-200 text-[#172c34] font-extrabold uppercase text-xs px-6 py-3.5 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                  >
                    ← Atrás
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!calcData.area}
                    className="bg-orange-600 disabled:opacity-50 text-white font-extrabold uppercase text-xs px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Siguiente Paso →
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3: UBICACIÓN */}
            {calcStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-extrabold text-[#172c34] text-center">
                  Paso 3: ¿Dónde se encuentra el terreno para construir?
                </h3>
                <div className="max-w-md mx-auto space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="ubicacion" className="block text-xs font-bold text-[#172c34] uppercase tracking-wide">
                      Ciudad / Departamento / Municipio *
                    </label>
                    <input
                      id="ubicacion"
                      type="text"
                      className="w-full rounded-xl border-2 border-gray-200 text-sm px-4 py-3.5 focus:outline-none focus:border-orange-500 text-[#172c34]"
                      placeholder="Ej. Guatavita, Cundinamarca"
                      value={calcData.ubicacion}
                      onChange={(e) => setCalcData(prev => ({ ...prev, ubicacion: e.target.value }))}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                    💡 Nota: Construimos en toda la zona andina y el país. Dependiendo del acceso al terreno y transporte de materiales, el valor de fletes puede variar.
                  </p>
                </div>
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="border border-gray-200 text-[#172c34] font-extrabold uppercase text-xs px-6 py-3.5 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                  >
                    ← Atrás
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!calcData.ubicacion.trim()}
                    className="bg-orange-600 disabled:opacity-50 text-white font-extrabold uppercase text-xs px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Siguiente Paso →
                  </button>
                </div>
              </div>
            )}

            {/* PASO 4: DATOS DE CONTACTO */}
            {calcStep === 4 && (
              <form onSubmit={handleCalcSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-extrabold text-[#172c34] text-center">
                  Paso 4: Ingresa tus datos para calcular el presupuesto
                </h3>
                <div className="max-w-md mx-auto grid gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="calc-name" className="block text-xs font-bold text-[#172c34] uppercase tracking-wide">
                      Nombre Completo *
                    </label>
                    <input
                      id="calc-name"
                      type="text"
                      className="w-full rounded-xl border-2 border-gray-200 text-sm px-4 py-3 focus:outline-none focus:border-orange-500 text-[#172c34]"
                      placeholder="Escribe tu nombre"
                      value={calcData.nombre}
                      onChange={(e) => setCalcData(prev => ({ ...prev, nombre: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="calc-phone" className="block text-xs font-bold text-[#172c34] uppercase tracking-wide">
                      WhatsApp de Contacto *
                    </label>
                    <input
                      id="calc-phone"
                      type="tel"
                      className="w-full rounded-xl border-2 border-gray-200 text-sm px-4 py-3 focus:outline-none focus:border-orange-500 text-[#172c34]"
                      placeholder="Ej. +57 320 123 4567"
                      value={calcData.telefono}
                      onChange={(e) => setCalcData(prev => ({ ...prev, telefono: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="calc-email" className="block text-xs font-bold text-[#172c34] uppercase tracking-wide">
                      Correo Electrónico *
                    </label>
                    <input
                      id="calc-email"
                      type="email"
                      className="w-full rounded-xl border-2 border-gray-200 text-sm px-4 py-3 focus:outline-none focus:border-orange-500 text-[#172c34]"
                      placeholder="tu@correo.com"
                      value={calcData.email}
                      onChange={(e) => setCalcData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="border border-gray-200 text-[#172c34] font-extrabold uppercase text-xs px-6 py-3.5 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                  >
                    ← Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={calcSubmitting || !calcData.nombre || !calcData.telefono || !calcData.email}
                    className="bg-orange-600 disabled:opacity-50 text-white font-extrabold uppercase text-xs px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
                  >
                    {calcSubmitting ? "Calculando..." : "📊 Generar Presupuesto"}
                  </button>
                </div>
              </form>
            )}

            {/* PASO 5: RESULTADO */}
            {calcStep === 5 && calcResult && (
              <div className="space-y-6 text-center animate-in zoom-in duration-300">
                <span className="text-5xl">🎉</span>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#172c34]">¡Tu Cotización Estimada está Lista!</h3>
                  <p className="text-gray-500 text-sm font-semibold">
                    Basado en tus selecciones de obra para <strong>{calcData.ubicacion}</strong>:
                  </p>
                </div>

                <div className="bg-[#172c34] text-white rounded-3xl p-6 md:p-8 max-w-xl mx-auto space-y-4 shadow-xl border-4 border-orange-500">
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                    Rango de Presupuesto Estimado Obra Gris y Acabados
                  </span>
                  
                  <div className="space-y-1">
                    <p className="text-3xl md:text-5xl font-black tracking-tight text-white">
                      ${calcResult.minCOP} <span className="text-sm font-normal text-gray-400">a</span> ${calcResult.maxCOP} <span className="text-xs font-black text-orange-400">COP</span>
                    </p>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">
                      Equivalente aproximado: USD ${calcResult.minUSD} - ${calcResult.maxUSD}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs text-left text-gray-300">
                    <div>
                      <p className="font-bold text-gray-400">SISTEMA:</p>
                      <p className="font-extrabold text-white uppercase">{calcData.sistema}</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-400">ÁREA SIMULADA:</p>
                      <p className="font-extrabold text-white">{calcResult.baseArea} m² promedio</p>
                    </div>
                  </div>
                </div>

                <div className="max-w-xl mx-auto bg-gray-50 rounded-2xl p-5 text-left border border-gray-100 space-y-3">
                  <h4 className="font-extrabold text-xs text-[#172c34] uppercase tracking-wide">✓ ¿Qué incluye esta estimación básica?</h4>
                  <ul className="text-xs text-gray-600 space-y-1 font-semibold">
                    <li>• Diseño estructural básico y planos de taller.</li>
                    <li>• Cimentación base (para suelo firme plano).</li>
                    <li>• Kit de paneles / muros y estructura según el sistema.</li>
                    <li>• Redes internas de agua, energía y desagües en puntos listos.</li>
                    <li>• Acabados estándar (puertas, baños enchapados, pintura).</li>
                  </ul>
                  <p className="text-[10px] text-gray-400 font-bold">
                    *El valor real final puede variar dependiendo de estudios de suelos definitivos, fletes exactos al lote y personalizaciones añadidas.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto pt-4">
                  <a
                    href={getCalcWhatsAppUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold uppercase text-xs px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 animate-pulse"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.233-1.371a9.936 9.936 0 004.779 1.229h.005c5.505 0 9.988-4.478 9.989-9.985a9.983 9.983 0 00-3-7.061A9.922 9.922 0 0012.012 2zm5.727 14.126c-.312.879-1.536 1.62-2.106 1.706-.57.086-1.127.353-3.619-.676-2.99-1.239-4.887-4.286-5.037-4.485-.15-.199-1.196-1.593-1.196-3.039 0-1.447.749-2.155 1.018-2.438.27-.284.599-.355.799-.355.2 0 .399.002.573.01.183.008.43-.072.673.513.25.599.855 2.083.929 2.233.075.15.124.324.025.523-.1.199-.15.324-.299.497-.15.174-.316.388-.45.52-.15.149-.306.312-.132.61.174.299.773 1.276 1.662 2.067.942.841 1.737 1.101 1.986 1.225.25.124.394.1.537-.062.144-.162.623-.722.793-.97.168-.249.336-.211.566-.124.23.087 1.458.687 1.708.812.249.124.417.186.479.299.062.112.062.649-.25 1.528z"/>
                    </svg>
                    <span>Enviar a mi Asesor por WhatsApp</span>
                  </a>
                  
                  <button
                    type="button"
                    onClick={resetCalculator}
                    className="w-full sm:w-auto border border-gray-200 text-[#172c34] font-extrabold uppercase text-xs px-8 py-4 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                  >
                    Nueva Cotización 🔄
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GALERÍA DE PROYECTOS COMPLETADOS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-orange-600 font-extrabold text-xs uppercase tracking-widest">
              GALERÍA DE OBRAS
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#172c34]">
              Nuestra Experiencia Impresa en Detalle
            </h2>
            <p className="text-gray-500 font-medium text-base max-w-2xl mx-auto">
              Filtra y revisa los planos, tiempos y particularidades de los proyectos habitacionales que hemos entregado con orgullo.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {[
              { id: "todos", label: "📂 Todos" },
              { id: "prefabricado", label: "🏗️ Prefabricados" },
              { id: "liviano", label: "🏔️ Liviano (Glampings/Alpinas)" },
              { id: "tradicional", label: "🧱 Tradicionales" }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wide transition-all active:scale-95 ${
                  filter === btn.id
                    ? 'bg-[#172c34] text-white shadow-lg shadow-slate-900/10'
                    : 'bg-gray-100 hover:bg-gray-200 text-[#172c34]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Grid de Proyectos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {filteredProjects.map(proj => (
              <div 
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="border border-gray-100 rounded-3xl overflow-hidden bg-[#fafbfc] cursor-pointer hover:shadow-xl hover:border-gray-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden relative bg-gray-100">
                    <img 
                      src={proj.image} 
                      alt={proj.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-[#172c34] text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      {proj.category === "liviano" ? "Liviano" : proj.category === "prefabricado" ? "Prefabricado" : "Tradicional"}
                    </span>
                  </div>
                  
                  <div className="p-6 space-y-3 text-left">
                    <h3 className="font-extrabold text-lg text-[#172c34] group-hover:text-orange-600 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-gray-400 font-bold text-xs flex items-center gap-1">
                      <span>📍</span> {proj.location}
                    </p>
                    <p className="text-gray-500 text-xs font-semibold leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  <span>📐 {proj.area}</span>
                  <span>⏱️ {proj.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL DETALLE DE PROYECTO */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[9999] p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedProject(null)}>
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="aspect-[16/9] w-full relative bg-gray-100 flex-none">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 text-xs font-black shadow-lg"
              >
                ✕ Cerrar
              </button>
              <span className="absolute bottom-4 left-4 bg-orange-600 text-white text-xs font-extrabold uppercase px-4 py-1.5 rounded-full shadow-md">
                Sistema {selectedProject.category}
              </span>
            </div>

            <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
              <div className="space-y-2 text-left">
                <h3 className="text-2xl font-black text-[#172c34]">{selectedProject.title}</h3>
                <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-400 uppercase">
                  <span>📍 {selectedProject.location}</span>
                  <span>📐 Área: {selectedProject.area}</span>
                  <span>⏱️ Durabilidad/Entrega: {selectedProject.duration}</span>
                </div>
              </div>

              <div className="space-y-2 text-left">
                <h4 className="font-extrabold text-sm text-[#172c34] uppercase tracking-wide">Descripción del Proyecto:</h4>
                <p className="text-gray-600 text-sm font-semibold leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {selectedProject.details && selectedProject.details.length > 0 && (
                <div className="space-y-3 text-left bg-slate-50 p-5 rounded-2xl border border-gray-100">
                  <h4 className="font-extrabold text-xs text-orange-600 uppercase tracking-widest">Ficha Técnica Obra:</h4>
                  <ul className="text-xs text-gray-600 space-y-2 font-semibold">
                    {selectedProject.details.map((det, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-500">✔</span>
                        <span>{det}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2">
                <a 
                  href={`https://wa.me/573000000000?text=${encodeURIComponent(
                    `Hola Habitech! 👋 Estaba revisando la galería de proyectos del portafolio y me gustó mucho el caso de éxito: "${selectedProject.title}" en ${selectedProject.location}. Quisiera recibir más planos, cotización y detalles de viabilidad en mi terreno.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold uppercase text-xs py-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.233-1.371a9.936 9.936 0 004.779 1.229h.005c5.505 0 9.988-4.478 9.989-9.985a9.983 9.983 0 00-3-7.061A9.922 9.922 0 0012.012 2zm5.727 14.126c-.312.879-1.536 1.62-2.106 1.706-.57.086-1.127.353-3.619-.676-2.99-1.239-4.887-4.286-5.037-4.485-.15-.199-1.196-1.593-1.196-3.039 0-1.447.749-2.155 1.018-2.438.27-.284.599-.355.799-.355.2 0 .399.002.573.01.183.008.43-.072.673.513.25.599.855 2.083.929 2.233.075.15.124.324.025.523-.1.199-.15.324-.299.497-.15.174-.316.388-.45.52-.15.149-.306.312-.132.61.174.299.773 1.276 1.662 2.067.942.841 1.737 1.101 1.986 1.225.25.124.394.1.537-.062.144-.162.623-.722.793-.97.168-.249.336-.211.566-.124.23.087 1.458.687 1.708.812.249.124.417.186.479.299.062.112.062.649-.25 1.528z"/>
                  </svg>
                  <span>Consultar sobre este proyecto</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN PREGUNTAS FRECUENTES (FAQ Accordion) */}
      <section className="py-20 bg-slate-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-orange-600 font-extrabold text-xs uppercase tracking-widest">
              RESOLVEMOS TUS DUDAS
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#172c34]">
              Preguntas Frecuentes de Clientes
            </h2>
            <p className="text-gray-500 font-medium text-sm max-w-xl mx-auto">
              Antes de iniciar tu obra, es normal tener interrogantes. Aquí te respondemos detalladamente las más habituales.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-slate-50/50"
                  >
                    <span className="font-extrabold text-[#172c34] text-sm md:text-base leading-tight">
                      {faq.question}
                    </span>
                    <span className="flex-none text-orange-600 font-black text-xl">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-96 opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-6 text-xs md:text-sm text-gray-600 font-semibold leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FORMULARIO DE RESPALDO (High Converting CTA Final) */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="text-orange-600 font-extrabold text-xs uppercase tracking-widest">
              CONTÁCTANOS HOY
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#172c34]">
              ¿Tienes un terreno y quieres empezar a construir?
            </h2>
            <p className="text-gray-500 font-medium text-base leading-relaxed">
              Agenda una llamada con uno de nuestros asesores técnicos y arquitectos. Evaluaremos las particularidades de tu lote, el sistema constructivo conveniente y resolveremos cada duda estructural sin ningún costo.
            </p>
            
            <div className="space-y-3 font-semibold text-sm text-[#172c34]">
              <div className="flex items-center gap-3">
                <span className="text-lg bg-orange-100 text-orange-600 p-2 rounded-full">✓</span>
                <span>Visita técnica de viabilidad de terreno (opcional)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg bg-orange-100 text-orange-600 p-2 rounded-full">✓</span>
                <span>Modificaciones personalizadas de planos</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg bg-orange-100 text-orange-600 p-2 rounded-full">✓</span>
                <span>Asistencia completa para permisos de planeación municipal</span>
              </div>
            </div>
          </div>

          <div className="bg-[#fafbfc] rounded-3xl border border-gray-200/80 p-6 md:p-8 shadow-xl">
            <h3 className="font-extrabold text-xl text-[#172c34] mb-2 text-left">
              Solicitar Asesoría Personalizada
            </h3>
            <p className="text-xs text-gray-500 font-semibold mb-6 text-left">
              Deja tus datos y nos pondremos en contacto contigo en menos de 24 horas hábiles.
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label htmlFor="cont-name" className="block text-xs font-bold text-[#172c34] uppercase tracking-wide">
                  Nombre Completo *
                </label>
                <input
                  id="cont-name"
                  type="text"
                  required
                  placeholder="Tu nombre completo"
                  className="w-full rounded-xl border border-gray-200 text-sm px-4 py-3 focus:outline-none focus:border-orange-500 text-[#172c34] bg-white"
                  value={contactState.nombre}
                  onChange={(e) => setContactState(prev => ({ ...prev, nombre: e.target.value }))}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="cont-email" className="block text-xs font-bold text-[#172c34] uppercase tracking-wide">
                    Correo Electrónico *
                  </label>
                  <input
                    id="cont-email"
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    className="w-full rounded-xl border border-gray-200 text-sm px-4 py-3 focus:outline-none focus:border-orange-500 text-[#172c34] bg-white"
                    value={contactState.email}
                    onChange={(e) => setContactState(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="cont-phone" className="block text-xs font-bold text-[#172c34] uppercase tracking-wide">
                    Teléfono celular / WhatsApp
                  </label>
                  <input
                    id="cont-phone"
                    type="tel"
                    placeholder="Ej. +57 321 000 0000"
                    className="w-full rounded-xl border border-gray-200 text-sm px-4 py-3 focus:outline-none focus:border-orange-500 text-[#172c34] bg-white"
                    value={contactState.telefono}
                    onChange={(e) => setContactState(prev => ({ ...prev, telefono: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="cont-msg" className="block text-xs font-bold text-[#172c34] uppercase tracking-wide">
                  Cuéntanos un poco sobre tu lote o idea:
                </label>
                <textarea
                  id="cont-msg"
                  rows={3}
                  placeholder="Ej. Tengo un lote en Boyacá y quiero cotizar una cabaña alpina de 50m²..."
                  className="w-full rounded-xl border border-gray-200 text-sm px-4 py-3 focus:outline-none focus:border-orange-500 text-[#172c34] bg-white"
                  value={contactState.mensaje}
                  onChange={(e) => setContactState(prev => ({ ...prev, mensaje: e.target.value }))}
                />
              </div>

              {contactStatus === "success" && (
                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  ✓ ¡Tu solicitud ha sido guardada con éxito! Un asesor te escribirá muy pronto.
                </div>
              )}

              {contactStatus === "error" && (
                <div className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                  ✕ Ocurrió un error al guardar. Revisa los datos o intenta de nuevo.
                </div>
              )}

              <button
                type="submit"
                disabled={contactStatus === "sending" || !contactState.nombre || !contactState.email}
                className="w-full bg-[#172c34] hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold uppercase text-xs py-4 rounded-xl transition-all shadow-md active:scale-95"
              >
                {contactStatus === "sending" ? "Enviando..." : "Enviar Solicitud"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
