import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../api/supabaseClient";

export default function TerrenoDetalle() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*, profiles(*)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setListing(data);

        // Incrementar vistas
        await supabase
          .from('listings')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id);

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
            <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden">
              {listing.images && listing.images[0] ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-300 italic">
                  <svg className="w-20 h-20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Sin imágenes de galería
                </div>
              )}
            </div>
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
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {listing.description}
              </p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: CONTACTO Y STATS */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-50 p-8 sticky top-8">
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
        </div>
      </div>
    </div>
  );
}

