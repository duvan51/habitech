import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { Link } from 'react-router-dom';

export default function Marketplace() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        setLoading(true);
        // Intentamos traer los lotes con los perfiles
        const { data, error } = await supabase
            .from('listings')
            .select('*, profiles(full_name)')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error cargando marketplace con perfiles:", error);
            // Plan B: traerlos sin perfiles para que no quede vació
            const { data: fallbackData } = await supabase
                .from('listings')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });
            setListings(fallbackData || []);
        } else {
            setListings(data || []);
        }
        setLoading(false);
    };

    const handleListingClick = async (id, currentClicks) => {
        // Incrementamos los clicks en segundo plano
        await supabase
            .from('listings')
            .update({ clicks: (currentClicks || 0) + 1 })
            .eq('id', id);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* HEROU SECTION */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold text-white sm:text-6xl mb-4">
                        Marketplace Habitech
                    </h1>
                    <p className="text-xl text-orange-50 max-w-2xl mx-auto">
                        Inversiones con respaldo real. Lotes, casas y proyectos seleccionados por expertos.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Propiedades Destacadas</h2>
                        <span className="text-gray-500">{listings.length} resultados encontrados</span>
                    </div>

                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                        <span className="mt-4 text-gray-500 font-medium">Cargando el mercado...</span>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="mx-auto w-24 h-24 text-gray-200 mb-6">
                            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <p className="text-gray-500 text-lg font-medium">Aún no hay publicaciones activas.</p>

                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {listings.map((listing) => (
                            <div key={listing.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                                <div className="relative aspect-video overflow-hidden">
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-orange-600 uppercase tracking-wider shadow-sm">
                                            {listing.type}
                                        </span>
                                    </div>
                                    {listing.images && listing.images[0] ? (
                                        <img
                                            src={listing.images[0]}
                                            alt={listing.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-orange-50 text-orange-200">
                                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 capitalize mb-1 group-hover:text-orange-600 transition-colors">
                                            {listing.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {listing.location}
                                        </p>
                                    </div>
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-1">
                                        {listing.description}
                                    </p>
                                    <div className="flex items-end justify-between mt-auto">
                                        <div>
                                            <span className="text-xs text-gray-400 font-medium block mb-1">Precio</span>
                                            <p className="text-2xl font-black text-orange-600">
                                                ${listing.price?.toLocaleString()}
                                            </p>
                                        </div>
                                        <Link
                                            to={`/terrenoVentas/${listing.id}`}
                                            onClick={() => handleListingClick(listing.id, listing.clicks)}
                                            className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-gray-200"
                                        >
                                            Ver Detalles
                                        </Link>
                                    </div>
                                </div>
                                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-mono">
                                        Por: {listing.profiles?.full_name || 'Vendedor VIP'}
                                    </span>
                                    <div className="flex gap-3">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            {listing.views || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

