import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';
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

// Mover MapBoundariesHandler FUERA para evitar bucles infinitos (Maximum update depth exceeded)
function MapBoundariesHandler({ listings, setVisibleListings }) {
    const map = useMapEvents({
        moveend: () => {
            const bounds = map.getBounds();
            const visible = listings.filter(l =>
                l.latitude && l.longitude &&
                bounds.contains([l.latitude, l.longitude])
            );
            setVisibleListings(visible);
        },
        zoomend: () => {
            const bounds = map.getBounds();
            const visible = listings.filter(l =>
                l.latitude && l.longitude &&
                bounds.contains([l.latitude, l.longitude])
            );
            setVisibleListings(visible);
        },
    });

    useEffect(() => {
        if (listings.length > 0) {
            const bounds = map.getBounds();
            const visible = listings.filter(l =>
                l.latitude && l.longitude &&
                bounds.contains([l.latitude, l.longitude])
            );
            setVisibleListings(visible);
        }
    }, [listings, map]);

    return null;
}

export default function Marketplace() {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [visibleListings, setVisibleListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState(null);



    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('listings')
            .select('*, profiles(full_name)')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error cargando marketplace:", error);
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
        await supabase
            .from('listings')
            .update({ clicks: (currentClicks || 0) + 1 })
            .eq('id', id);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* HERO SECTION */}
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

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pb-32">
                {/* LISTINGS SECTION (Propiedades Destacadas) */}
                <div className="mb-20">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6 px-4">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900">Propiedades Destacadas</h2>
                            <span className="text-gray-500 font-medium">{listings.length} resultados encontrados</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                            <span className="mt-4 text-gray-500 font-medium tracking-widest uppercase text-[10px]">Cargando el mercado...</span>
                        </div>
                    ) : listings.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 mx-4">
                            <div className="mx-auto w-24 h-24 text-gray-200 mb-6">
                                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <p className="text-gray-500 text-lg font-medium tracking-wide">Aún no hay publicaciones activas.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 px-4">
                            {listings.map((listing) => (
                                <div key={listing.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col transform hover:-translate-y-2">
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-[10px] font-black text-orange-600 uppercase tracking-widest shadow-lg">
                                                {listing.type}
                                            </span>
                                            {listing.is_certified && (
                                                <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg animate-in zoom-in duration-500">
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                                                    <span className="text-[8px] font-black uppercase tracking-widest">HABITECH CERTIFIED</span>
                                                </div>
                                            )}
                                        </div>
                                        {listing.images && listing.images[0] ? (
                                            <img
                                                src={listing.images[0]}
                                                alt={listing.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full bg-orange-50 text-orange-200">
                                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                            <p className="text-2xl font-black text-white tracking-tight">
                                                ${listing.price?.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <h3 className="text-xl font-black text-gray-900 capitalize mb-2 group-hover:text-orange-600 transition-colors truncate">
                                                {listing.title}
                                            </h3>
                                            <p className="text-[11px] text-gray-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                                                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                {listing.location}
                                            </p>
                                        </div>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-8 flex-1 font-medium leading-relaxed">
                                            {listing.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-black">
                                                By: {listing.profiles?.full_name || 'VIP SELLER'}
                                            </span>
                                            <Link
                                                to={`/terrenoVentas/${listing.id}`}
                                                onClick={() => handleListingClick(listing.id, listing.clicks)}
                                                className="bg-gray-900 text-white px-7 py-3 rounded-2xl text-[10px] font-black hover:bg-orange-600 transition-all shadow-xl shadow-gray-200 uppercase tracking-widest active:scale-95"
                                            >
                                                Detalles
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* PROMOCIONAL BANNERS */}
                <div className="mx-0 md:mx-4 mb-24">
                    <div className="bg-gray-900 rounded-none md:rounded-[3.5rem] p-10 md:p-20 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-12">
                        <div className="absolute -top-32 -right-32 w-80 h-80 bg-orange-600/20 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-orange-500/20 rounded-full blur-[100px] animate-pulse"></div>

                        <div className="relative z-10 flex-1">
                            <h3 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
                                Las inversiones en inmuebles <span className="text-orange-500 underline decoration-gray-700 underline-offset-[12px]">es el mejor negocio</span>.
                            </h3>
                            <div className="h-2 w-32 bg-orange-600 mb-8 rounded-full"></div>
                            <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed max-w-2xl">
                                Con <span className="text-white font-black italic">Habitech</span> inviertes seguro, multiplicas tu capital y aseguras el futuro de tu familia.
                            </p>
                        </div>

                        <div className="relative z-10 flex-none bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-xl transition-transform hover:scale-105 duration-500 shadow-2xl">
                            <div className="flex flex-col items-center text-center gap-6">
                                <div className="w-24 h-24 bg-orange-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-orange-600/40 rotate-12 transition-transform hover:rotate-0 duration-700 cursor-pointer">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <span className="text-white font-black text-xl tracking-[0.2em] uppercase">Seguridad Real</span>
                                <div className="flex gap-2 text-orange-500">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAPA EXPLORADOR DE INVERSIONES CON SIDEBAR DINÁMICO */}
                <div className="mx-0 md:mx-4 mt-12 bg-white rounded-none md:rounded-[3.5rem] p-0 md:p-10 shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-8 md:p-0 mb-4 md:mb-10 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Mapa de Oportunidades</h2>
                            <p className="text-[12px] text-gray-400 font-black italic uppercase tracking-[0.3em] mt-2">Explora terrenos y casas geolocalizados</p>
                        </div>
                        <div className="flex items-center gap-4 bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100 self-start md:self-center shadow-sm">
                            <span className="w-3 h-3 bg-orange-600 rounded-full animate-pulse shadow-lg shadow-orange-500"></span>
                            <span className="text-[12px] font-black text-orange-900 uppercase tracking-widest">Vista En Vivo</span>
                        </div>
                    </div>

                    <div className="h-[500px] md:h-[700px] rounded-none md:rounded-[3rem] overflow-hidden border-none md:border-4 border-gray-50 relative group shadow-inner">
                        {/* Sidebar Izquierda dentro del mapa (DINÁMICA - OCULTA EN MOBILE) */}
                        <div className="hidden md:flex absolute top-8 left-8 bottom-8 w-72 z-[1001] bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 shadow-2xl flex-col overflow-hidden transition-all duration-700 hover:w-80 translate-x-0 group-hover:translate-x-2">
                            <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-4 0-8 3-8 7 0 3 4 10 8 13.5 4-3.5 8-10.5 8-13.5 0-4-4-7-8-7z" /></svg>
                                </div>
                                <h3 className="font-black text-[11px] uppercase tracking-[0.25em] flex items-center gap-2 relative z-10">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                                    Propiedades aquí
                                </h3>
                                <p className="text-[20px] font-black mt-2 relative z-10">{visibleListings.length} <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Activas en el área</span></p>
                            </div>

                            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-100 p-5 space-y-4">
                                {visibleListings.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2c-4 0-8 3-8 7 0 3 4 10 8 13.5 4-3.5 8-10.5 8-13.5 0-4-4-7-8-7z" /></svg>
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                                            Desplázate por el mapa para ver lotes disponibles
                                        </p>
                                    </div>
                                ) : (
                                    visibleListings.map(l => (
                                        <Link
                                            to={`/terrenoVentas/${l.id}`}
                                            key={l.id}
                                            onMouseEnter={() => setHoveredId(l.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                            className={`p-4 rounded-3xl border transition-all duration-500 cursor-pointer block group/card ${hoveredId === l.id ? 'bg-orange-50 border-orange-200 ring-4 ring-orange-500/5 -translate-y-1' : 'bg-white border-gray-50 hover:border-gray-100 hover:bg-gray-50'}`}
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-none shadow-md">
                                                    <img src={l.images?.[0] || '/placeholder.jpg'} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-[11px] font-black text-gray-900 truncate uppercase tracking-tight">{l.title}</h4>
                                                    <p className="text-[14px] font-black text-orange-600 mt-1">${l.price?.toLocaleString()}</p>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        <span className="text-[8px] bg-gray-900 text-white px-2 py-0.5 rounded-lg font-black uppercase tracking-tighter">{l.type}</span>
                                                        <span className="text-[8px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-lg font-black tracking-tighter">{l.area || 'N/A'}</span>
                                                        {l.is_certified && (
                                                            <span className="text-[8px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg font-black tracking-tighter flex items-center gap-1">
                                                                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                                                                CERT
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>

                        <MapContainer
                            center={[4.35, -74.35]}
                            zoom={6}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={true}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            <MapBoundariesHandler listings={listings} setVisibleListings={setVisibleListings} />
                            {listings
                                .filter(l => l.latitude && l.longitude)
                                .map((l) => (
                                    <Marker
                                        key={l.id}
                                        position={[l.latitude, l.longitude]}
                                        zIndexOffset={hoveredId === l.id ? 2000 : 0}
                                        eventHandlers={{
                                            mouseover: (e) => {
                                                setHoveredId(l.id);
                                                e.target.openPopup();
                                            },
                                            mouseout: (e) => {
                                                setHoveredId(null);
                                            }
                                        }}
                                    >
                                        <Tooltip
                                            permanent
                                            direction="top"
                                            offset={[0, -15]}
                                            className="marker-tooltip-premium"
                                        >
                                            <div className={`bg-orange-600 text-white px-3 py-1 rounded-full shadow-lg border border-orange-400 font-black text-[9px] uppercase tracking-widest whitespace-nowrap flex items-center gap-2 transition-all duration-300 ${hoveredId === l.id ? 'scale-110 bg-orange-700 shadow-orange-500/50 ring-2 ring-white/50' : 'scale-100'}`}>
                                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                                EN VENTA
                                            </div>
                                        </Tooltip>
                                        <Popup className="listing-popup-simplified" offset={[0, -10]}>
                                            <div className="w-64 bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100">
                                                <div className="h-40 relative group/pop">
                                                    <img src={l.images?.[0] || '/placeholder.jpg'} className="w-full h-full object-cover transition-transform duration-500 group-hover/pop:scale-105" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                                </div>
                                                <div className="p-5">
                                                    <div className="flex justify-between items-end mb-4 gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5 mb-1">
                                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Inversión</span>
                                                                {l.is_certified && (
                                                                    <div className="text-emerald-600 flex items-center gap-0.5" title="Listado Certificado">
                                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <p className="text-orange-600 font-extrabold text-xl truncate tracking-tight">${l.price?.toLocaleString()}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Area</span>
                                                            <p className="text-gray-900 font-bold text-xs">{l.area || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        to={`/terrenoVentas/${l.id}`}
                                                        className="w-full h-12 bg-gray-900 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-gray-200 active:scale-95"
                                                    >
                                                        Ir a detalles
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                        </MapContainer>

                        {/* Overlay Decorativo */}
                        <div className="hidden md:flex absolute top-8 right-8 z-[1000] bg-white/90 backdrop-blur-xl p-5 rounded-[2.5rem] shadow-2xl border border-white flex flex-col gap-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                            <div className="flex items-center gap-4">
                                <div className="w-5 h-5 bg-orange-600 rounded-xl shadow-lg ring-4 ring-orange-500/20"></div>
                                <span className="text-[11px] font-black text-gray-800 tracking-widest uppercase">Pines Activos</span>
                            </div>
                            <div className="h-[2px] w-full bg-gray-100 rounded-full"></div>
                            <p className="text-[11px] font-bold text-gray-400 max-w-[170px] leading-relaxed italic">Haz clic para descubrir los tesoros de inversión en esta zona.</p>
                        </div>
                    </div>

                    {/* LISTA MÓVIL (VISIBLE SOLO EN MÓVIL ABAJO DEL MAPA) */}
                    <div className="md:hidden p-8 space-y-4 bg-gray-50/30">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Oportunidades en el área</h4>
                            <span className="text-[10px] font-black px-2 py-0.5 bg-orange-600 text-white rounded-md">{visibleListings.length}</span>
                        </div>
                        {visibleListings.length === 0 ? (
                            <p className="text-center py-10 text-[10px] font-black text-gray-300 uppercase italic">Mueve el mapa para encontrar lotes</p>
                        ) : (
                            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-none snap-x">
                                {visibleListings.map(l => (
                                    <Link
                                        key={l.id}
                                        to={`/terrenoVentas/${l.id}`}
                                        className="w-[280px] flex-none bg-white p-4 rounded-3xl shadow-lg border border-gray-100 snap-center"
                                    >
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-none">
                                                <img src={l.images?.[0]} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[11px] font-black text-gray-900 truncate uppercase">{l.title}</h4>
                                                <p className="text-[14px] font-black text-orange-600 mt-1">${l.price?.toLocaleString()}</p>
                                                <span className="inline-block mt-2 text-[8px] bg-gray-900 text-white px-2 py-0.5 rounded-lg font-black uppercase tracking-tighter">{l.type}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
