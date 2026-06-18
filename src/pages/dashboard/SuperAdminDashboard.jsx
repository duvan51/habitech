import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { supabase } from "../../api/supabaseClient";

// Valores por defecto para el reseteo
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

export default function SuperAdminDashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  // Control de Acceso Estricto
  const isSuperAdmin = profile?.role === 'superadmin' || user?.email === 'duvanaponteramirez@gmail.com';

  const [activeTab, setActiveTab] = useState("video");
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [reels, setReels] = useState([]);
  const [projects, setProjects] = useState([]);
  const [toast, setToast] = useState("");
  const [dbError, setDbError] = useState(false);

  // Cargar datos al montar
  useEffect(() => {
    async function fetchFromSupabase() {
      if (!isSuperAdmin) return;
      try {
        const { data, error } = await supabase
          .from("portfolio_settings")
          .select("*")
          .eq("id", "global")
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setHeroVideoUrl(data.hero_video || DEFAULT_HERO_VIDEO);
          setReels(data.reels && data.reels.length > 0 ? data.reels : DEFAULT_REELS);
          setProjects(data.projects && data.projects.length > 0 ? data.projects : DEFAULT_PROJECTS);
          setDbError(false);
          
          // Sincronizar localmente como copia
          localStorage.setItem("habitech_hero_video", data.hero_video || DEFAULT_HERO_VIDEO);
          localStorage.setItem("habitech_reels", JSON.stringify(data.reels && data.reels.length > 0 ? data.reels : DEFAULT_REELS));
          localStorage.setItem("habitech_projects", JSON.stringify(data.projects && data.projects.length > 0 ? data.projects : DEFAULT_PROJECTS));
        } else {
          loadFromLocal();
        }
      } catch (err) {
        console.error("Error al cargar de Supabase, usando LocalStorage:", err);
        setDbError(true);
        loadFromLocal();
      }
    }

    function loadFromLocal() {
      setHeroVideoUrl(localStorage.getItem("habitech_hero_video") || DEFAULT_HERO_VIDEO);
      
      const savedReels = localStorage.getItem("habitech_reels");
      setReels(savedReels ? JSON.parse(savedReels) : DEFAULT_REELS);

      const savedProjects = localStorage.getItem("habitech_projects");
      setProjects(savedProjects ? JSON.parse(savedProjects) : DEFAULT_PROJECTS);
    }

    fetchFromSupabase();
  }, [isSuperAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 font-bold uppercase tracking-widest text-sm bg-gray-50">
        Cargando privilegios...
      </div>
    );
  }

  if (!isSuperAdmin) {
    return <Navigate to="/" />;
  }

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Función genérica para subir archivos a Cloudinary
  const handleUploadToCloudinary = (onUploadSuccess, folderName = "habitech_portfolio") => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("⚠️ Configuración de Cloudinary incompleta en el archivo .env (Falta VITE_CLOUDINARY_CLOUD_NAME o VITE_CLOUDINARY_UPLOAD_PRESET).");
      return;
    }

    if (!window.cloudinary) {
      alert("⚠️ El script de Cloudinary no se ha cargado en la web. Revisa tu conexión a internet.");
      return;
    }

    window.cloudinary.openUploadWidget({
      cloudName,
      uploadPreset,
      sources: ["local", "camera", "url"],
      multiple: false,
      folder: folderName,
    }, (error, result) => {
      if (!error && result && result.event === "success") {
        onUploadSuccess(result.info.secure_url);
        showToast("¡Archivo subido con éxito a Cloudinary! 📤");
      }
    });
  };

  // Guardado unificado en Supabase
  const saveAllToSupabase = async (updatedHero = heroVideoUrl, updatedReels = reels, updatedProjects = projects) => {
    try {
      const { error } = await supabase
        .from("portfolio_settings")
        .upsert({
          id: "global",
          hero_video: updatedHero,
          reels: updatedReels,
          projects: updatedProjects,
          updated_at: new Date().toISOString()
        });
      if (error) throw error;
      setDbError(false);
      return true;
    } catch (err) {
      console.error("Error al guardar en Supabase:", err);
      setDbError(true);
      return false;
    }
  };

  // 1. Guardar Video Hero
  const handleSaveHeroVideo = async (e) => {
    if (e) e.preventDefault();
    localStorage.setItem("habitech_hero_video", heroVideoUrl);
    const success = await saveAllToSupabase(heroVideoUrl, reels, projects);
    if (success) {
      showToast("¡Video principal guardado en la Base de Datos! 🎬");
    } else {
      showToast("Guardado localmente. Falla de conexión a base de datos ⚠️");
    }
  };

  // 2. Operaciones con Reels
  const handleUpdateReel = (id, field, value) => {
    const updated = reels.map(r => {
      if (r.id === id) {
        return { ...r, [field]: value };
      }
      return r;
    });
    setReels(updated);
    localStorage.setItem("habitech_reels", JSON.stringify(updated));
  };

  const handleSaveReels = async () => {
    const success = await saveAllToSupabase(heroVideoUrl, reels, projects);
    if (success) {
      showToast("¡Todos los Reels guardados en la Base de Datos! 🎬");
    } else {
      showToast("Guardado localmente. Falla de conexión a base de datos ⚠️");
    }
  };

  const handleAddReel = async () => {
    const newReel = {
      id: "reel-" + Date.now(),
      title: "Nueva Obra Habitech",
      system: "Sistema Prefabricado",
      details: "Descripción detallada del nuevo proyecto en video...",
      videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054fc2d0d6eef3141f237efb46be98e&profile_id=165&oauth2_token_id=57447761",
      coverUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80",
      likes: 0,
      hasLiked: false,
      whatsappMsg: "Hola Habitech! Me gustaría pedir información sobre el nuevo proyecto de reels..."
    };
    const updated = [...reels, newReel];
    setReels(updated);
    localStorage.setItem("habitech_reels", JSON.stringify(updated));

    const success = await saveAllToSupabase(heroVideoUrl, updated, projects);
    if (success) {
      showToast("¡Nuevo Reel añadido y guardado en la Base de Datos! 🎬");
    } else {
      showToast("Añadido localmente. Falla de base de datos ⚠️");
    }
  };

  const handleDeleteReel = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este Reel del portafolio?")) return;
    const updated = reels.filter(r => r.id !== id);
    setReels(updated);
    localStorage.setItem("habitech_reels", JSON.stringify(updated));

    const success = await saveAllToSupabase(heroVideoUrl, updated, projects);
    if (success) {
      showToast("¡Reel eliminado de la Base de Datos! 🗑️");
    } else {
      showToast("Eliminado localmente. Falla de base de datos ⚠️");
    }
  };

  // 3. Operaciones con Proyectos de Galería
  const handleUpdateProject = (id, field, value) => {
    const updated = projects.map(p => {
      if (p.id === id) {
        if (field === "details") {
          return { ...p, details: value.split("\n").filter(line => line.trim() !== "") };
        }
        return { ...p, [field]: value };
      }
      return p;
    });
    setProjects(updated);
    localStorage.setItem("habitech_projects", JSON.stringify(updated));
  };

  const handleSaveProjects = async () => {
    const success = await saveAllToSupabase(heroVideoUrl, reels, projects);
    if (success) {
      showToast("¡Todas las Obras guardadas en la Base de Datos! 🏠");
    } else {
      showToast("Guardado localmente. Falla de conexión a base de datos ⚠️");
    }
  };

  const handleAddProject = async () => {
    const newProj = {
      id: Date.now(),
      title: "Nueva Cabaña Campestre",
      category: "liviano",
      area: "50m²",
      location: "Guatavita, Cundinamarca",
      duration: "30 días",
      image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80",
      description: "Descripción detallada del nuevo proyecto...",
      details: ["Estructura: Acero liviano.", "Aislamiento: Termoacústico premium."]
    };
    const updated = [...projects, newProj];
    setProjects(updated);
    localStorage.setItem("habitech_projects", JSON.stringify(updated));

    const success = await saveAllToSupabase(heroVideoUrl, reels, updated);
    if (success) {
      showToast("¡Nuevo proyecto añadido y guardado en la Base de Datos! 🏠");
    } else {
      showToast("Añadido localmente. Falla de base de datos ⚠️");
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este proyecto de la galería?")) return;
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem("habitech_projects", JSON.stringify(updated));

    const success = await saveAllToSupabase(heroVideoUrl, reels, updated);
    if (success) {
      showToast("¡Proyecto eliminado de la Base de Datos! 🗑️");
    } else {
      showToast("Eliminado localmente. Falla de base de datos ⚠️");
    }
  };

  // 4. Restaurar todo a valores de fábrica
  const handleResetToDefaults = async () => {
    if (!window.confirm("¿Estás seguro de que deseas restablecer TODOS los datos a los valores de fábrica de Habitech? Perderás las modificaciones hechas en esta sesión.")) return;
    localStorage.removeItem("habitech_hero_video");
    localStorage.removeItem("habitech_reels");
    localStorage.removeItem("habitech_projects");

    setHeroVideoUrl(DEFAULT_HERO_VIDEO);
    setReels(DEFAULT_REELS);
    setProjects(DEFAULT_PROJECTS);

    const success = await saveAllToSupabase(DEFAULT_HERO_VIDEO, DEFAULT_REELS, DEFAULT_PROJECTS);
    if (success) {
      showToast("¡Datos restaurados a valores originales en la Base de Datos! 🔄");
    } else {
      showToast("Restaurados localmente. Falla de base de datos ⚠️");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-[#172c34]">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] bg-[#172c34] text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm border border-orange-500 animate-bounce">
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Cabecera del Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#172c34] text-white p-8 rounded-3xl shadow-xl">
          <div className="space-y-2 text-left">
            <span className="bg-orange-600 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
              ACCESO ROOT SUPERADMIN
            </span>
            <h1 className="text-3xl font-black tracking-tight">Consola de Mando Habitech</h1>
            <p className="text-gray-400 text-xs font-semibold">
              Bienvenido, <strong>{user?.email}</strong>. Desde aquí puedes modificar dinámicamente y subir vídeos o fotos para el portafolio.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleResetToDefaults}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl border border-white/20 transition-all active:scale-95"
            >
              Restaurar Originales 🔄
            </button>
            <button
              onClick={() => navigate("/portafolio")}
              className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-md active:scale-95"
            >
              Ir a Portafolio →
            </button>
          </div>
        </div>

        {/* Warning Banner when DB Table is missing */}
        {dbError && (
          <div className="bg-amber-50 border-2 border-amber-300 text-amber-900 rounded-3xl p-6 shadow-md text-left space-y-4">
            <div className="flex items-start gap-4">
              <span className="text-3xl pt-1">⚠️</span>
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-amber-800">Modo de Respaldo Local Activo (Base de Datos no Conectada)</h3>
                <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                  Detectamos que la tabla <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-[11px]">portfolio_settings</code> aún no existe o no tiene permisos en tu base de datos de Supabase. Los cambios se están guardando localmente en tu navegador.
                </p>
                <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                  Para guardar globalmente y permitir que cualquier cliente vea las actualizaciones de tus videos y obras, copia el script SQL inferior, ve a tu panel de Supabase en <strong>SQL Editor</strong>, presiona <strong>New query</strong>, pégalo y haz clic en <strong>Run</strong>.
                </p>
              </div>
            </div>
            
            <div className="relative bg-[#172c34] text-gray-200 rounded-2xl p-4 font-mono text-[10px] overflow-x-auto border border-[#23424d] max-h-56 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`-- 1. Crear la tabla para guardar las configuraciones globales del portafolio
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  hero_video TEXT,
  reels JSONB,
  projects JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar la seguridad a nivel de fila (RLS)
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;

-- 3. Crear política para permitir que todo el mundo lea los datos
CREATE POLICY "Permitir lectura pública de portafolio" 
ON public.portfolio_settings 
FOR SELECT 
USING (true);

-- 4. Crear política para permitir que usuarios autenticados gestionen los datos
CREATE POLICY "Permitir gestión a usuarios autenticados" 
ON public.portfolio_settings 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 5. Insertar el registro semilla inicial
INSERT INTO public.portfolio_settings (id, hero_video, reels, projects)
VALUES (
  'global',
  'https://player.vimeo.com/external/459389137.sd.mp4?s=8720e517a1d939bce56a84f32ab0a457&profile_id=165&oauth2_token_id=57447761',
  '[]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO NOTHING;`);
                  showToast("¡Código SQL copiado! 📋");
                }}
                className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white font-extrabold text-[9px] uppercase px-3 py-2 rounded-xl border border-white/10 transition-all active:scale-95 shadow-md"
              >
                Copiar SQL 📋
              </button>
              <pre className="text-left select-all whitespace-pre leading-relaxed pr-24">
{`-- 1. Crear la tabla
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  hero_video TEXT,
  reels JSONB,
  projects JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;

-- 3. Política Lectura Pública
CREATE POLICY "Permitir lectura pública de portafolio" 
ON public.portfolio_settings FOR SELECT USING (true);

-- 4. Política Gestión Autenticados
CREATE POLICY "Permitir gestión a usuarios autenticados" 
ON public.portfolio_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Registro Semilla Inicial
INSERT INTO public.portfolio_settings (id, hero_video, reels, projects)
VALUES ('global', 'https://player.vimeo.com/external/459389137.sd.mp4?s=8720e517a1d939bce56a84f32ab0a457&profile_id=165&oauth2_token_id=57447761', '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;`}
              </pre>
            </div>
          </div>
        )}

        {/* Barra de Pestañas */}
        <div className="flex bg-white p-1.5 rounded-2xl shadow-md border border-gray-100 max-w-md">
          <button
            onClick={() => setActiveTab("video")}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
              activeTab === "video" ? "bg-[#172c34] text-white shadow-lg" : "text-gray-400 hover:text-[#172c34]"
            }`}
          >
            Video Hero
          </button>
          <button
            onClick={() => setActiveTab("reels")}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
              activeTab === "reels" ? "bg-[#172c34] text-white shadow-lg" : "text-gray-400 hover:text-[#172c34]"
            }`}
          >
            Gestión Reels
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
              activeTab === "projects" ? "bg-[#172c34] text-white shadow-lg" : "text-gray-400 hover:text-[#172c34]"
            }`}
          >
            Gestión Obras
          </button>
        </div>

        {/* CONTENEDORES DE CONTENIDO */}

        {/* PESTAÑA 1: VIDEO HERO */}
        {activeTab === "video" && (
          <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-xl space-y-6 text-left">
            <h2 className="text-xl font-extrabold">1. Video del Banner Principal (Hero)</h2>
            <p className="text-gray-500 text-sm font-semibold">
              Modifica el video vertical que se visualiza en bucle en el hero del portafolio. Puedes ingresar una URL directa o subir un video desde tu ordenador a Cloudinary.
            </p>

            <form onSubmit={handleSaveHeroVideo} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                  URL del Video (MP4) *
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    className="flex-1 rounded-xl border border-gray-200 text-sm px-4 py-3 focus:outline-none focus:border-orange-500"
                    value={heroVideoUrl}
                    onChange={(e) => setHeroVideoUrl(e.target.value)}
                    placeholder="https://ejemplo.com/video.mp4"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleUploadToCloudinary((url) => setHeroVideoUrl(url), "habitech_hero_videos")}
                    className="px-6 py-3 bg-gray-900 text-white font-extrabold text-xs uppercase rounded-xl transition-all shadow-md active:scale-95 shrink-0 flex items-center gap-1.5"
                  >
                    📤 Subir Video
                  </button>
                </div>
              </div>

              <div className="aspect-[16/9] max-w-md bg-slate-900 rounded-2xl overflow-hidden relative border border-gray-200">
                <video
                  key={heroVideoUrl}
                  src={heroVideoUrl}
                  controls
                  muted
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase px-6 py-3.5 rounded-xl shadow-md transition-all active:scale-95"
              >
                Guardar Video Hero 💾
              </button>
            </form>
          </div>
        )}

        {/* PESTAÑA 2: GESTIÓN REELS */}
        {activeTab === "reels" && (
          <div className="space-y-6 text-left">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-md">
              <div>
                <h2 className="text-xl font-extrabold">2. Administrador de Video Reels</h2>
                <p className="text-gray-500 text-xs font-semibold">
                  Añade, edita y elimina los videos de tus construcciones. Sube los videos directamente desde tu equipo.
                </p>
              </div>
              <button
                onClick={handleAddReel}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-md active:scale-95"
              >
                + Agregar Nuevo Reel
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {reels.map((reel, index) => (
                <div key={reel.id} className="bg-white rounded-3xl border border-gray-200 p-6 shadow-lg space-y-4 relative flex flex-col justify-between">
                  <span className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                    Reel #{index + 1}
                  </span>
                  
                  <div className="space-y-4">
                    {/* Campos de Entrada */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Título del Reel</label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-gray-200 text-xs px-3 py-2"
                          value={reel.title}
                          onChange={(e) => handleUpdateReel(reel.id, "title", e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Sistema</label>
                        <select
                          className="w-full rounded-xl border border-gray-200 text-xs px-3 py-2 cursor-pointer bg-white"
                          value={reel.system}
                          onChange={(e) => handleUpdateReel(reel.id, "system", e.target.value)}
                        >
                          <option value="Sistema Prefabricado">Sistema Prefabricado</option>
                          <option value="Sistema Liviano">Sistema Liviano</option>
                          <option value="Sistema Tradicional">Sistema Tradicional</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Detalles / Subtítulo</label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-gray-200 text-xs px-3 py-2"
                        value={reel.details}
                        onChange={(e) => handleUpdateReel(reel.id, "details", e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase flex justify-between">
                        <span>URL del Video (MP4)</span>
                        <span className="text-[8px] text-orange-600 font-black">Cloudinary integrado</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          className="flex-1 rounded-xl border border-gray-200 text-xs px-3 py-2"
                          value={reel.videoUrl}
                          onChange={(e) => handleUpdateReel(reel.id, "videoUrl", e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleUploadToCloudinary((url) => handleUpdateReel(reel.id, "videoUrl", url), "habitech_reels_videos")}
                          className="px-3 py-2 bg-[#172c34] hover:bg-orange-600 text-white font-extrabold text-[10px] uppercase rounded-xl transition-all shrink-0 flex items-center gap-1"
                        >
                          📤 Subir
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase flex justify-between">
                          <span>URL Portada</span>
                          <span className="text-[8px] text-orange-600 font-black">Subir imagen</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            className="flex-1 rounded-xl border border-gray-200 text-xs px-3 py-2"
                            value={reel.coverUrl}
                            onChange={(e) => handleUpdateReel(reel.id, "coverUrl", e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => handleUploadToCloudinary((url) => handleUpdateReel(reel.id, "coverUrl", url), "habitech_reels_covers")}
                            className="px-2 py-2 bg-[#172c34] hover:bg-orange-600 text-white font-extrabold text-[10px] uppercase rounded-xl transition-all shrink-0 flex items-center justify-center"
                            title="Subir Imagen de Portada"
                          >
                            📤
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Likes Iniciales</label>
                        <input
                          type="number"
                          className="w-full rounded-xl border border-gray-200 text-xs px-3 py-2"
                          value={reel.likes}
                          onChange={(e) => handleUpdateReel(reel.id, "likes", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Mensaje Predeterminado WhatsApp</label>
                      <textarea
                        rows={2}
                        className="w-full rounded-xl border border-gray-200 text-xs px-3 py-2"
                        value={reel.whatsappMsg || ""}
                        onChange={(e) => handleUpdateReel(reel.id, "whatsappMsg", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Acciones del Reel */}
                  <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-4">
                    <button
                      onClick={() => handleDeleteReel(reel.id)}
                      className="text-red-500 hover:bg-red-50 text-[10px] font-bold uppercase px-3 py-2 rounded-xl"
                    >
                      ✕ Eliminar Reel
                    </button>
                    
                    <div className="w-16 aspect-[9/16] bg-slate-900 rounded-lg overflow-hidden relative border border-gray-100">
                      <video src={reel.videoUrl} muted className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end pt-6">
              <button
                onClick={handleSaveReels}
                className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95"
              >
                Guardar Todos los Reels en la Base de Datos 💾
              </button>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: GESTIÓN OBRAS */}
        {activeTab === "projects" && (
          <div className="space-y-6 text-left">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-md">
              <div>
                <h2 className="text-xl font-extrabold">3. Administrador de Galería de Proyectos</h2>
                <p className="text-gray-500 text-xs font-semibold">
                  Gestiona las obras mostradas en la grilla inferior del portafolio. Sube fotos reales de tus proyectos.
                </p>
              </div>
              <button
                onClick={handleAddProject}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-md active:scale-95"
              >
                + Agregar Nuevo Proyecto
              </button>
            </div>

            <div className="space-y-6">
              {projects.map((proj, idx) => (
                <div key={proj.id} className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-md grid md:grid-cols-12 gap-6 items-start relative">
                  <span className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                    Proyecto #{idx + 1}
                  </span>

                  <div className="md:col-span-4 space-y-4">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                      <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase flex justify-between">
                        <span>URL de Imagen Principal</span>
                        <span className="text-[8px] text-orange-600 font-black">Cargar Archivo</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          className="flex-1 rounded-xl border border-gray-200 text-xs px-3 py-2"
                          value={proj.image}
                          onChange={(e) => handleUpdateProject(proj.id, "image", e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleUploadToCloudinary((url) => handleUpdateProject(proj.id, "image", url), "habitech_project_images")}
                          className="px-3 py-2 bg-[#172c34] hover:bg-orange-600 text-white font-extrabold text-[10px] uppercase rounded-xl transition-all shrink-0 flex items-center gap-1"
                        >
                          📤 Subir
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-8 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Título del Proyecto</label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-gray-200 text-xs px-3 py-2 font-bold"
                          value={proj.title}
                          onChange={(e) => handleUpdateProject(proj.id, "title", e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Categoría Sistema</label>
                        <select
                          className="w-full rounded-xl border border-gray-200 text-xs px-3 py-2 bg-white cursor-pointer"
                          value={proj.category}
                          onChange={(e) => handleUpdateProject(proj.id, "category", e.target.value)}
                        >
                          <option value="prefabricado">Prefabricado</option>
                          <option value="liviano">Liviano (Glampings/Alpinas)</option>
                          <option value="tradicional">Tradicional</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Área Total (m²)</label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-gray-200 text-xs px-3 py-2"
                          value={proj.area}
                          onChange={(e) => handleUpdateProject(proj.id, "area", e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Ubicación</label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-gray-200 text-xs px-3 py-2"
                          value={proj.location}
                          onChange={(e) => handleUpdateProject(proj.id, "location", e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Tiempo Duración</label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-gray-200 text-xs px-3 py-2"
                          value={proj.duration}
                          onChange={(e) => handleUpdateProject(proj.id, "duration", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Descripción de la Obra</label>
                      <textarea
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 text-xs px-3 py-2"
                        value={proj.description}
                        onChange={(e) => handleUpdateProject(proj.id, "description", e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Ficha Técnica (Un detalle por renglón)</label>
                      <textarea
                        rows={2}
                        className="w-full rounded-xl border border-gray-200 text-xs px-3 py-2"
                        value={proj.details?.join("\n") || ""}
                        onChange={(e) => handleUpdateProject(proj.id, "details", e.target.value)}
                        placeholder="Ej. Estructura: Acero liviano&#10;Aislamiento: Lana de vidrio"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-red-500 hover:bg-red-50 text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-colors"
                      >
                        ✕ Eliminar Obra
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={handleSaveProjects}
                className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95"
              >
                Guardar Todas las Obras en la Base de Datos 💾
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
