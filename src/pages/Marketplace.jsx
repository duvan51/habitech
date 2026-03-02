import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { Link } from 'react-router-dom';

export default function Marketplace() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            const { data, error } = await supabase
                .from('listings')
                .select('*, profiles(full_name)')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (!error) {
                setListings(data);
            }
            setLoading(false);
        };

        fetchListings();
    }, []);

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Marketplace de Proyectos y Lotes
                    </h1>
                    <p className="mt-4 text-xl text-gray-500">
                        Encuentra la oportunidad perfecta para tu próxima inversión.
                    </p>
                    <div className="mt-6">
                        <Link to="/constructora" className="text-orange-600 font-semibold hover:underline">
                            Conoce nuestra constructora Habitech &rarr;
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center italic text-gray-500">Cargando publicaciones...</div>
                ) : listings.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl">
                        <p className="text-gray-500">No hay publicaciones activas en este momento.</p>
                        <Link to="/register" className="mt-4 inline-block bg-orange-600 text-white px-6 py-2 rounded-lg font-medium">
                            ¡Sé el primero en publicar!
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                        {listings.map((listing) => (
                            <div key={listing.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-64">
                                    {listing.images && listing.images[0] ? (
                                        <img
                                            src={listing.images[0]}
                                            alt={listing.title}
                                            className="w-full h-full object-center object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                                            Sin imagen
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-bold text-gray-900 capitalize">
                                            {listing.title}
                                        </h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 uppercase">
                                            {listing.type}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{listing.description}</p>
                                    <p className="mt-4 text-2xl font-extrabold text-orange-600">
                                        ${listing.price?.toLocaleString()}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">Por: {listing.profiles?.full_name || 'Usuario'}</span>
                                        <Link
                                            to={`/terrenoVentas/${listing.id}`}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                        >
                                            Ver detalles
                                        </Link>
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
