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
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen italic">Cargando detalles...</div>;
  if (error || !listing) return (
    <div className="text-center py-20">
      <p className="text-red-500 mb-4 font-bold text-xl">Error: {error || "Publicación no encontrada"}</p>
      <Link to="/" className="text-blue-600 hover:underline">Volver al Marketplace</Link>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* TÍTULO */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center capitalize">
        {listing.title}
      </h1>

      {/* PRECIO */}
      <p className="text-3xl text-green-600 font-extrabold text-center mb-10">
        ${listing.price?.toLocaleString()} COP
      </p>

      {/* GALERÍA DE IMÁGENES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
        {listing.images && listing.images.length > 0 ? (
          listing.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="foto terreno"
              className="w-full h-52 object-cover rounded-xl shadow transition-transform hover:scale-105"
            />
          ))
        ) : (
          <div className="col-span-3 bg-gray-100 h-64 flex items-center justify-center rounded-xl text-gray-400 font-medium italic">
            Sin imágenes disponibles
          </div>
        )}
      </div>

      {/* DESCRIPCIÓN */}
      <div className="mb-14 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800 border-b pb-2">
          Descripción detallada
        </h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
          {listing.description}
        </p>
      </div>

      {/* CARACTERÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div className="bg-gray-100 p-8 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Información General
          </h3>

          <ul className="text-gray-700 space-y-3 text-lg">
            <li className="flex justify-between border-b border-gray-200 pb-1">
              <span className="font-semibold text-gray-600">Ubicación:</span>
              <span>{listing.location}</span>
            </li>
            <li className="flex justify-between border-b border-gray-200 pb-1">
              <span className="font-semibold text-gray-600">Tipo:</span>
              <span className="capitalize">{listing.type}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-600">Estado:</span>
              <span className="capitalize px-2 bg-green-100 text-green-800 rounded-full text-sm font-bold flex items-center">
                {listing.status}
              </span>
            </li>
          </ul>
        </div>

        {/* VENDEDOR */}
        <div className="bg-white border-2 border-orange-50 p-8 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>

          <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Contacto del Vendedor
          </h3>

          <p className="text-gray-900 font-bold text-xl mb-6">
            {listing.profiles?.full_name || "Usuario verificado"}
          </p>

          <div className="space-y-4">
            <a
              href={`https://wa.me/573000000000`} // Aquí podrías añadir el teléfono al perfil de usuario en DB
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-green-200 shadow-lg hover:bg-green-700 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.022-.047-.078-.133-.232-.211-.154-.078-.912-.451-1.054-.502-.142-.05-.245-.078-.348.078-.103.156-.399.502-.489.605-.09.103-.18.115-.334.037-.155-.078-.652-.241-1.241-.767-.459-.41-1.037-.916-1.127-1.071-.09-.155-.01-.239.068-.317.071-.071.156-.18.234-.27.08-.09.105-.153.159-.255.053-.102.026-.192-.013-.27-.04-.078-.35-.845-.48-1.156-.126-.305-.255-.264-.348-.269-.09-.004-.192-.005-.294-.005-.102 0-.27.038-.41.192-.141.156-.54.528-.54 1.288 0 .76.552 1.494.629 1.6.078.106 1.087 1.66 2.632 2.33.368.159.654.254.877.325.37.118.706.101.972.062.297-.044.912-.372 1.04-.733.128-.36.128-.67.09-.734-.04-.064-.105-.102-.231-.18zm-5.472 7.618c-2.484 0-4.832-.969-6.606-2.74-1.748-1.748-2.711-4.068-2.711-6.53 0-2.484.969-4.832 2.74-6.606 1.748-1.748 4.068-2.711 6.53-2.711 2.484 0 4.832.969 6.606 2.74C20.309 6.901 21.272 9.221 21.272 11.703c0 2.484-.969 4.832-2.74 6.606-1.748 1.748-4.068 2.711-6.53 2.711zM12 0C5.383 0 0 5.383 0 12c0 6.617 5.383 12 12 12s12-5.383 12-12c0-6.617-5.383-12-12-12z" /></svg>
              WhatsApp del Vendedor
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
