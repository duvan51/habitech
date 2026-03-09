import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, ZoomControl, LayersControl, Rectangle, Tooltip } from 'react-leaflet';
const { BaseLayer } = LayersControl;
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet + React
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
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[210] p-2 hover:bg-white/10 rounded-full"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="relative w-full max-w-5xl aspect-video flex items-center justify-center">
                {items.length > 1 && (
                    <>
                        <button onClick={prev} className="absolute left-0 lg:-left-20 z-[210] p-4 text-white/50 hover:text-white transition-all hover:bg-white/5 rounded-full">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={next} className="absolute right-0 lg:-right-20 z-[210] p-4 text-white/50 hover:text-white transition-all hover:bg-white/5 rounded-full">
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

function LocationMarker({ position, setPosition, setLocationName }) {
    const map = useMap();

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            reverseGeocode(lat, lng);
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    const reverseGeocode = async (lat, lng) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data.address) {
                const city = data.address.city || data.address.town || data.address.village || '';
                const state = data.address.state || '';
                const formatted = city && state ? `${city}, ${state}` : data.display_name;
                setLocationName(formatted);
            }
        } catch (err) {
            setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
    };

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

function LotDemarcation({ position, areaString }) {
    if (!position || !areaString) return null;

    // Intentar extraer dimensiones tipo 10x20, 10*20, etc.
    const dimensions = areaString.match(/(\d+(?:\.\d+)?)\s*[xX*]\s*(\d+(?:\.\d+)?)/);

    let widthMeters, lengthMeters;

    if (dimensions) {
        widthMeters = parseFloat(dimensions[1]);
        lengthMeters = parseFloat(dimensions[2]);
    } else {
        // Si solo hay un número (ej: 2500m2), simulamos un cuadrado
        const singleNumber = areaString.match(/(\d+(?:\.\d+)?)/);
        if (singleNumber) {
            const side = Math.sqrt(parseFloat(singleNumber[1]));
            widthMeters = side;
            lengthMeters = side;
        } else {
            return null;
        }
    }

    // Conversión aproximada de metros a grados
    const latOffset = (lengthMeters / 2) / 111111;
    const lngOffset = (widthMeters / 2) / (111111 * Math.cos(position[0] * Math.PI / 180));

    const bounds = [
        [position[0] - latOffset, position[1] - lngOffset],
        [position[0] + latOffset, position[1] + lngOffset]
    ];

    return (
        <Rectangle
            bounds={bounds}
            pathOptions={{
                color: '#ea580c',
                weight: 2,
                fillColor: '#ea580c',
                fillOpacity: 0.2,
                dashArray: '5, 5'
            }}
        >
            <Tooltip permanent direction="center" className="lot-tooltip">
                <div className="flex flex-col items-center bg-orange-600 text-white px-2 py-0.5 rounded shadow-lg border border-orange-400">
                    <span className="text-[9px] font-black tracking-tighter uppercase whitespace-nowrap">EN VENTA</span>
                    <span className="text-[8px] font-bold opacity-90">{areaString}</span>
                </div>
            </Tooltip>
        </Rectangle>
    );
}

function MapSearch({ onLocationSelected }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const map = useMap();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.length > 3) {
                handleSearch();
            } else {
                setResults([]);
            }
        }, 600);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
            const data = await res.json();
            setResults(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const selectLocation = (res) => {
        const pos = [parseFloat(res.lat), parseFloat(res.lon)];
        map.flyTo(pos, 16);
        onLocationSelected(pos, res.display_name);
        setResults([]);
        setQuery('');
    };

    return (
        <div className="absolute top-4 left-4 z-[1000] w-64 md:w-80 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="relative flex gap-1 group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearch();
                        }
                    }}
                    placeholder="Buscar dirección, ciudad o barrio..."
                    className="w-full bg-white/95 backdrop-blur-md border border-white shadow-xl rounded-2xl py-2.5 px-4 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-400"
                />
                <button
                    type="button"
                    onClick={handleSearch}
                    className="bg-orange-600 text-white p-2.5 rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all active:scale-95 flex items-center justify-center shrink-0"
                >
                    {loading ? (
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    )}
                </button>
            </div>

            {results.length > 0 && (
                <div className="mt-2 bg-white/95 backdrop-blur-lg border border-white rounded-2xl shadow-2xl max-h-56 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="overflow-y-auto max-h-56 scrollbar-none">
                        {results.map((res, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => selectLocation(res)}
                                className="w-full text-left p-3.5 text-[10px] hover:bg-orange-50 border-b border-gray-100 last:border-0 transition-colors flex items-start gap-3 group/item text-gray-700"
                            >
                                <span className="bg-orange-100 p-1.5 rounded-lg text-orange-600 group-hover/item:bg-orange-600 group-hover/item:text-white transition-colors">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </span>
                                <span className="font-bold leading-tight group-hover/item:text-orange-700 truncate-2-lines">{res.display_name}</span>
                            </button>
                        ))}
                    </div>
                    <div className="bg-gray-50/50 p-2 text-[8px] text-center text-gray-400 font-bold uppercase tracking-widest border-t border-gray-100">
                        Resultados encontrados
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ListingModal({ isOpen, onClose, user, onSaved, supabase, listing = null }) {
    const initialState = {
        title: '',
        description: '',
        price: '',
        type: 'lote',
        location: '',
        status: 'active',
        area: '',
        video_url: '',
        images: []
    };

    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapCenter, setMapCenter] = useState([4.6243, -74.0636]); // Bogotá center
    const [markerPos, setMarkerPos] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [previewScale, setPreviewScale] = useState({ open: false, index: 0 });

    const isEditMode = !!listing;

    const allMedia = [
        ...(formData.images || []).map(url => ({ type: 'image', url })),
        ...(formData.video_url ? [{ type: 'video', url: formData.video_url }] : [])
    ];

    useEffect(() => {
        if (isOpen) {
            setError(null);
            setShowMap(false);

            if (listing) {
                setFormData({
                    title: listing.title || '',
                    description: listing.description || '',
                    price: listing.price || '',
                    type: listing.type || 'lote',
                    location: listing.location || '',
                    status: listing.status || 'active',
                    area: listing.area || '',
                    video_url: listing.video_url || '',
                    images: listing.images || []
                });

                if (listing.latitude && listing.longitude) {
                    const coords = [listing.latitude, listing.longitude];
                    setMarkerPos(coords);
                    setMapCenter(coords);
                } else {
                    setMarkerPos(null);
                }
            } else {
                setFormData(initialState);
                setMarkerPos(null);
                setMapCenter([4.6243, -74.0636]);
            }
        }
    }, [isOpen, listing]);

    if (!isOpen) return null;

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización.");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const newPos = [latitude, longitude];
            setMarkerPos(newPos);
            setMapCenter(newPos);
            setShowMap(true);

            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                const data = await res.json();
                if (data.address) {
                    const city = data.address.city || data.address.town || data.address.village || '';
                    const state = data.address.state || '';
                    const formatted = city && state ? `${city}, ${state}` : data.display_name;
                    setFormData({ ...formData, location: formatted });
                } else {
                    setFormData({ ...formData, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
                }
            } catch (err) {
                setFormData({ ...formData, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
            }
        });
    };

    const handleUpload = () => {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            alert("⚠️ Configuración de Cloudinary incompleta.\nPor favor, añade VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET a tu archivo .env");
            return;
        }

        if (!window.cloudinary) {
            alert("Cloudinary script no cargado. Revisa tu conexión.");
            return;
        }

        window.cloudinary.openUploadWidget(
            {
                cloudName: cloudName,
                uploadPreset: uploadPreset,
                sources: ["local", "url", "camera"],
                multiple: true,
                folder: "habitech_listings",
                clientAllowedFormats: ["image", "video"],
                resourceType: "auto",
                maxFiles: 10,
                language: "es",
                text: {
                    es: {
                        menu: {
                            files: "Mis archivos",
                            web: "Dirección web",
                            camera: "Cámara"
                        },
                        local: {
                            browse: "Buscar",
                            dd_title_single: "Arrastra tu imagen aquí",
                            dd_title_multi: "Arrastra tus imágenes aquí",
                            drop_title_single: "Suelta el archivo para subirlo",
                            drop_title_multi: "Suelta los archivos para subirlos"
                        }
                    }
                }
            },
            (error, result) => {
                if (!error && result && result.event === "success") {
                    const url = result.info.secure_url;
                    if (result.info.resource_type === 'video') {
                        setFormData(prev => ({ ...prev, video_url: url }));
                    } else {
                        setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
                    }
                }
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const dataToSave = {
            ...formData,
            price: parseFloat(formData.price),
            user_id: user.id,
            latitude: markerPos ? markerPos[0] : null,
            longitude: markerPos ? markerPos[1] : null
        };

        let result;
        if (isEditMode) {
            result = await supabase
                .from('listings')
                .update(dataToSave)
                .eq('id', listing.id);
        } else {
            result = await supabase
                .from('listings')
                .insert([dataToSave]);
        }

        const { error: saveError } = result;

        if (saveError) {
            setError(saveError.message);
            setLoading(false);
        } else {
            onSaved();
            onClose();
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen p-4 text-center">
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true"></div>

                <div className="relative bg-white rounded-2xl p-6 text-left overflow-hidden shadow-2xl transform transition-all sm:max-w-[90vw] w-full h-[85vh] flex flex-col border border-gray-100 z-10">
                    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-2xl font-black text-gray-900" id="modal-title">
                                {isEditMode ? 'Editar Publicación' : 'Nueva Publicación'}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto lg:overflow-hidden min-h-0">
                            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                                {/* Form Column (1/3) */}
                                <div className="lg:col-span-1 space-y-5 overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-thumb-gray-200">
                                    <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 space-y-4 shadow-sm">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-bold text-orange-800 uppercase tracking-wider">Ubicación</label>
                                                <button
                                                    type="button"
                                                    onClick={handleUseCurrentLocation}
                                                    className="text-[10px] bg-white hover:bg-gray-50 text-gray-700 px-3 py-1 rounded-full border border-gray-200 transition-all flex items-center gap-1 shadow-sm font-bold"
                                                >
                                                    📍 Usar GPS
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                readOnly
                                                className="block w-full border-gray-200 bg-white rounded-lg py-2.5 px-3 text-sm cursor-default font-medium text-gray-700"
                                                value={formData.location}
                                                placeholder="Selecciona un punto en el mapa..."
                                            />
                                            <p className="mt-1.5 text-[10px] text-orange-600 italic font-medium">El nombre se genera al tocar el mapa o buscar.</p>
                                        </div>

                                        <div className="border-t border-orange-100 pt-4">
                                            <label className="block text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">Título de la propiedad</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Ej: Lote campestre en el Retiro"
                                                className="block w-full border-gray-200 rounded-lg shadow-sm py-2.5 px-3 focus:ring-orange-500 focus:border-orange-500 text-sm transition-all"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">Tipo</label>
                                                <select
                                                    className="block w-full border-gray-200 rounded-lg shadow-sm py-2.5 px-3 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                    value={formData.type}
                                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                >
                                                    <option value="lote">Lote</option>
                                                    <option value="casa">Casa</option>
                                                    <option value="proyecto">Proyecto</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">Precio (COP)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    placeholder="0"
                                                    className="block w-full border-gray-200 rounded-lg shadow-sm py-2.5 px-3 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">Medidas / Área (Ej: 1500m2 o 20x50m)</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: 2500 m2"
                                                    className="block w-full border-gray-200 rounded-lg shadow-sm py-2.5 px-3 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                    value={formData.area}
                                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 px-1 mt-5">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Imágenes</label>
                                                <button
                                                    type="button"
                                                    onClick={handleUpload}
                                                    className="text-[10px] bg-orange-50 text-orange-600 px-3 py-1 rounded-full border border-orange-100 font-bold hover:bg-orange-100 transition-all flex items-center gap-1"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                    Subir Fotos
                                                </button>
                                            </div>
                                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                                {formData.images?.map((url, i) => (
                                                    <div key={i} className="relative flex-none group">
                                                        <img
                                                            src={url}
                                                            alt="Listing"
                                                            className="w-16 h-16 rounded-lg object-cover border cursor-pointer hover:brightness-75 transition-all"
                                                            onClick={() => setPreviewScale({ open: true, index: i })}
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                                        </div>
                                                        <button
                                                            onClick={() => setFormData({ ...formData, images: formData.images.filter((_, idx) => idx !== i) })}
                                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center shadow-md active:scale-90 z-20"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                                {formData.images?.length === 0 && (
                                                    <p className="text-[10px] text-gray-400 italic py-2">No hay imágenes. Usa el botón para subir.</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Video</label>
                                                {!formData.video_url && (
                                                    <button
                                                        type="button"
                                                        onClick={handleUpload}
                                                        className="text-[10px] bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100 font-bold hover:bg-red-100 transition-all flex items-center gap-1"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                        Subir Video
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex gap-2 items-center">
                                                {formData.video_url ? (
                                                    <div className="relative flex-none group">
                                                        <div
                                                            className="w-16 h-16 rounded-lg bg-gray-900 flex items-center justify-center border border-gray-200 overflow-hidden cursor-pointer hover:bg-gray-800 transition-colors"
                                                            onClick={() => setPreviewScale({ open: true, index: formData.images?.length || 0 })}
                                                        >
                                                            <svg className="w-8 h-8 text-white/50" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                        </div>
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                        </div>
                                                        <button
                                                            onClick={() => setFormData({ ...formData, video_url: '' })}
                                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center shadow-md active:scale-90 z-20"
                                                        >
                                                            ×
                                                        </button>
                                                        <p className="mt-1 text-[8px] text-green-600 font-bold truncate w-16 text-center">Preview</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-[10px] text-gray-400 italic py-2">No hay video. Usa el botón para subir.</p>
                                                )}
                                            </div>

                                            {/* Campo oculto o secundario para edición manual si es necesario */}
                                            {formData.video_url && (
                                                <input
                                                    type="url"
                                                    className="mt-2 block w-full border-gray-100 bg-gray-50 rounded-lg py-1.5 px-3 text-[10px] text-gray-400 truncate"
                                                    value={formData.video_url}
                                                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                                />
                                            )}
                                        </div>



                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Descripción detallada</label>
                                            <textarea
                                                className="block w-full border-gray-200 rounded-lg shadow-sm py-2.5 px-3 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                rows="5"
                                                placeholder="Describe las características, servicios y ventajas..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Map Column (2/3) */}
                                <div className="lg:col-span-2 h-[300px] lg:h-full flex flex-col">
                                    <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 relative shadow-inner">
                                        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                                            <ZoomControl position="bottomright" />
                                            <LayersControl position="topright">
                                                <BaseLayer checked name="Mapa Estándar">
                                                    <TileLayer
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        attribution='&copy; OpenStreetMap contributors'
                                                    />
                                                </BaseLayer>
                                                <BaseLayer name="Vista Satelital (3D)">
                                                    <TileLayer
                                                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                                        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                                                    />
                                                </BaseLayer>
                                            </LayersControl>
                                            <MapSearch
                                                onLocationSelected={(pos, name) => {
                                                    setMarkerPos(pos);
                                                    setFormData(prev => ({ ...prev, location: name }));
                                                }}
                                            />
                                            <LocationMarker
                                                position={markerPos}
                                                setPosition={setMarkerPos}
                                                setLocationName={(name) => setFormData({ ...formData, location: name })}
                                            />
                                            <LotDemarcation
                                                position={markerPos}
                                                areaString={formData.area}
                                            />
                                        </MapContainer>

                                        <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-white flex items-center gap-2">
                                            <div className="w-2 h-2 bg-orange-500 animate-pulse rounded-full"></div>
                                            <span className="text-[11px] font-bold text-gray-700">Toca el mapa para precisión exacta</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t pt-4 bg-white shrink-0 mt-auto">
                                {error && <p className="text-red-500 text-sm self-center mr-auto font-medium">{error}</p>}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-12 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black hover:from-orange-700 hover:to-orange-600 transition-all shadow-lg shadow-orange-200 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Procesando...
                                        </>
                                    ) : (
                                        isEditMode ? 'GUARDAR CAMBIOS' : 'PUBLICAR AHORA'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <FullscreenPreview
                isOpen={previewScale.open}
                onClose={() => setPreviewScale({ ...previewScale, open: false })}
                items={allMedia}
                initialIndex={previewScale.index}
            />
        </div>
    );
}
