import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { supabase } from "../api/supabaseClient";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function FullscreenPreview({ isOpen, onClose, items, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  if (!isOpen) return null;

  const next = () => setCurrentIndex((currentIndex + 1) % items.length);
  const prev = () => setCurrentIndex((currentIndex - 1 + items.length) % items.length);

  const currentItem = items[currentIndex];
  const isVideo = currentItem?.type === 'video';

  return (
    <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[1010] p-2 hover:bg-white/10 rounded-full"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div className="relative w-full max-w-5xl aspect-video flex items-center justify-center">
        {items.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-0 lg:-left-20 z-[1010] p-4 text-white/50 hover:text-white transition-all hover:bg-white/5 rounded-full">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={next} className="absolute right-0 lg:-right-20 z-[1010] p-4 text-white/50 hover:text-white transition-all hover:bg-white/5 rounded-full">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}

        <div className="w-full h-full flex items-center justify-center animate-in fade-in zoom-in duration-300">
          {isVideo ? (
            <video src={currentItem.url} controls autoPlay className="max-w-full max-h-full rounded-xl shadow-2xl" />
          ) : (
            <img src={currentItem.url} alt="Preview" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto p-2 max-w-full scrollbar-none">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`relative flex-none w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === currentIndex ? 'border-orange-500 scale-110 shadow-lg shadow-orange-500/20' : 'border-transparent opacity-50 hover:opacity-100'}`}
          >
            {item.type === 'video' ? (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            ) : (
              <img src={item.url} className="w-full h-full object-cover" alt="thumb" />
            )}
          </button>
        ))}
      </div>

      <p className="mt-4 text-white/40 text-sm font-medium">
        {currentIndex + 1} / {items.length}
      </p>
    </div>
  );
}

function VideoPlayer({ url }) {
  if (!url) return null;

  // Si es youtube, convertir a embed
  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYoutubeId(url);

  if (youtubeId) {
    return (
      <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 mt-4">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  // Si es cloudinary u otro link directo de video
  return (
    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 mt-4 bg-black">
      <video
        controls
        className="w-full h-full object-contain"
        src={url}
      >
        Tu navegador no soporta el elemento de video.
      </video>
    </div>
  );
}

function CommentsSection({ listingId }) {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [listingId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false });

    if (!error) setComments(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setLoading(true);
    const { error } = await supabase.from("comments").insert([
      {
        listing_id: listingId,
        user_id: user.id,
        content: newComment.trim(),
      },
    ]);

    if (!error) {
      setNewComment("");
      fetchComments();
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-50 p-8 mt-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
        Comentarios y Preguntas
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            className="w-full border-gray-100 bg-gray-50 rounded-2xl p-4 text-sm focus:ring-orange-500 focus:border-orange-500 min-h-[100px] transition-all resize-none"
            placeholder="¿Tienes alguna duda sobre este lote? Pregúntale a la comunidad..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <div className="flex justify-end mt-2">
            <button
              disabled={loading || !newComment.trim()}
              className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-orange-100 hover:bg-orange-700 disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? "Publicando..." : "Publicar Comentario"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 text-center mb-8">
          <p className="text-gray-700 font-medium mb-3">Debes iniciar sesión para comentar</p>
          <Link to="/login" className="inline-block bg-orange-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-orange-700 transition-all">
            Ingresar / Registrarse
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-sm italic text-center py-4">Aún no hay preguntas. ¡Sé el primero!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
              <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-black shrink-0">
                {comment.profiles?.full_name?.charAt(0) || "U"}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-sm">{comment.profiles?.full_name || "Usuario"}</span>
                  <span className="text-[10px] text-gray-400 uppercase font-black">Hace poco</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function TerrenoDetalle() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const allMedia = [
    ...(listing?.images || []).map(url => ({ type: 'image', url })),
    ...(listing?.video_url ? [{ type: 'video', url: listing.video_url }] : [])
  ];

  useEffect(() => {
    const fetchListing = async () => {
      try {
        let finalData = null;

        // Primero intentamos con el join a profiles
        const { data, error } = await supabase
          .from('listings')
          .select('*, profiles:user_id(*)')
          .eq('id', id)
          .single();

        if (error) {
          console.error("Error con profiles, intentando sin join:", error);
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('listings')
            .select('*')
            .eq('id', id)
            .single();

          if (fallbackError) throw fallbackError;
          finalData = fallbackData;
        } else {
          finalData = data;
        }

        setListing(finalData);

        // Incrementar vistas
        if (finalData) {
          await supabase
            .from('listings')
            .update({ views: (finalData.views || 0) + 1 })
            .eq('id', id);
        }

      } catch (err) {
        console.error("Error fetching listing:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-orange-200 rounded-full mb-4"></div>
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  if (error || !listing) return (
    <div className="text-center py-20 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md border border-gray-100">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <p className="text-gray-900 mb-6 font-bold text-2xl">Vaya, no lo encontramos</p>
        <p className="text-gray-500 mb-8">{error || "Esta propiedad ya no está disponible o el enlace es incorrecto."}</p>
        <Link to="/" className="inline-block bg-orange-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all">
          Volver al Marketplace
        </Link>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* HEADER DETALLE - STICKY EN MOBILE? */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-orange-600">Marketplace</Link></li>
            <li><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
            <li className="text-gray-600 font-medium truncate max-w-[200px]">{listing.title}</li>
          </ol>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* COLUMNA IZQUIERDA: IMÁGENES Y DESCRIPCIÓN */}
        <div className="lg:col-span-2 space-y-8">

          {/* GALERÍA PRINCIPAL */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-2">
            <div
              className="aspect-video bg-gray-100 rounded-2xl overflow-hidden relative group cursor-zoom-in"
              onClick={() => setIsPreviewOpen(true)}
            >
              {listing.images && listing.images[activeImage] ? (
                <>
                  <img
                    src={listing.images[activeImage]}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-300 italic">
                  <svg className="w-20 h-20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Sin imágenes de galería
                </div>
              )}
            </div>
            {listing.images?.length > 1 && (
              <div className="flex gap-3 p-2 mt-2 overflow-x-auto scrollbar-none">
                {listing.images.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Preview ${i}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImage(i);
                    }}
                    className={`w-24 h-24 flex-none rounded-xl object-cover border-2 transition-all shadow-sm ${activeImage === i ? 'border-orange-500 scale-95 shadow-inner' : 'border-transparent hover:border-orange-200'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* CUERPO DE LA PUBLICACIÓN */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-black uppercase tracking-widest mb-3 inline-block">
                  {listing.type}
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 capitalize">
                  {listing.title}
                </h1>
                <p className="text-gray-500 mt-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {listing.location}
                </p>
              </div>
              <div className="text-left md:text-right">
                <span className="text-sm text-gray-400 font-bold uppercase block">Precio total</span>
                <p className="text-4xl font-black text-orange-600">
                  ${listing.price?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sobre esta propiedad</h2>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line mb-8">
                {listing.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                {listing.area && (
                  <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Medidas / Área</p>
                    <p className="text-2xl font-black text-orange-950">{listing.area}</p>
                  </div>
                )}

                {listing.video_url && (
                  <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="bg-red-50 p-6 rounded-t-2xl border-x border-t border-red-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Recorrido Virtual</p>
                        <p className="text-2xl font-black text-red-950">Mira los detalles del lote</p>
                      </div>
                      <div className="bg-red-600 text-white p-3 rounded-full shadow-lg">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                    <div className="p-0 border-x border-b border-gray-100 rounded-b-2xl overflow-hidden bg-white shadow-sm">
                      <VideoPlayer url={listing.video_url} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* UBICACIÓN EXACTA (MAPA) */}
            {(listing.latitude && listing.longitude) && (
              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ubicación exacta</h2>
                <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm z-0">
                  <MapContainer
                    center={[listing.latitude, listing.longitude]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker position={[listing.latitude, listing.longitude]} />
                  </MapContainer>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: CONTACTO Y STATS */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-50 p-8">
            <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-2xl">
              <div className="h-12 w-12 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                {listing.profiles?.full_name?.charAt(0) || 'H'}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Vendedor experto</p>
                <p className="text-lg font-bold text-gray-900">{listing.profiles?.full_name || "Asesor Habitech"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <a
                href={`https://wa.me/573000000000`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-95"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.022-.047-.078-.133-.232-.211-.154-.078-.912-.451-1.054-.502-.142-.05-.245-.078-.348.078-.103.156-.399.502-.489.605-.09.103-.18.115-.334.037-.155-.078-.652-.241-1.241-.767-.459-.41-1.037-.916-1.127-1.071-.09-.155-.01-.239.068-.317.071-.071.156-.18.234-.27.08-.09.105-.153.159-.255.053-.102.026-.192-.013-.27-.04-.078-.35-.845-.48-1.156-.126-.305-.255-.264-.348-.269-.09-.004-.192-.005-.294-.005-.102 0-.27.038-.41.192-.141.156-.54.528-.54 1.288 0 .76.552 1.494.629 1.6.078.106 1.087 1.66 2.632 2.33.368.159.654.254.877.325.37.118.706.101.972.062.297-.044.912-.372 1.04-.733.128-.36.128-.67.09-.734-.04-.064-.105-.102-.231-.18zm-5.472 7.618c-2.484 0-4.832-.969-6.606-2.74-1.748-1.748-2.711-4.068-2.711-6.53 0-2.484.969-4.832 2.74-6.606 1.748-1.748 4.068-2.711 6.53-2.711 2.484 0 4.832.969 6.606 2.74C20.309 6.901 21.272 9.221 21.272 11.703c0 2.484-.969 4.832-2.74 6.606-1.748 1.748-4.068 2.711-6.53 2.711zM12 0C5.383 0 0 5.383 0 12c0 6.617 5.383 12 12 12s12-5.383 12-12c0-6.617-5.383-12-12-12z" /></svg>
                Contactar por WhatsApp
              </a>
              <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all">
                Solicitar Llamada
              </button>
            </div>

            <div className="mt-10 pt-10 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-black text-gray-900">{listing.views || 0}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Vistas</p>
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{listing.clicks || 0}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Interesados</p>
              </div>
            </div>
          </div>

          {/* CAJA DE COMENTARIOS DEBAJO DEL VENDEDOR */}
          <CommentsSection listingId={listing.id} />
        </div>

        {/* CONTENEDOR DE PREVIEW (CARRUSEL) */}
        <FullscreenPreview
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          items={allMedia}
          initialIndex={activeImage}
        />
      </div>
    </div >
  );
}
