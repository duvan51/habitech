import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPropiedades } from "../api/user";

const MOCK_CHARACTERSITICS = [
    { id: 'water', label: 'Agua', icon: '💧' },
    { id: 'power', label: 'Luz', icon: '⚡' },
    { id: 'sewer', label: 'Alcantarillado', icon: '🚿' },
    { id: 'gas', label: 'Gas Natural', icon: '🔥' },
    { id: 'view', label: 'Vista Panorámica', icon: '⛰️' },
    { id: 'paved', label: 'Vía Pavimentada', icon: '🛣️' },
];

export default function VentaTerrenos() {
  const [filters, setFilters] = useState({
    search: "",
    city: "todos",
    type: "todos",
    priceRange: "todos",
    features: [],
    certifiedOnly: false
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Example data extended with features
  const allProperties = [
    {
      id: 1,
      titulo: "Lote Premium Medellín",
      ciudad: "Medellín",
      tipo: "urbano",
      tamano: "7x15",
      precio: 125000000,
      credito: true,
      features: ['water', 'power', 'sewer', 'paved'],
      imagenes: ["https://images.unsplash.com/photo-1560184897-67f1b1c93a94"],
      desc: "Terreno urbano AAA ideal para construcción inmediata con todos los servicios públicos.",
      contacto: "3001234567",
    },
    {
      id: 2,
      titulo: "EcoFinca Rionegro",
      ciudad: "Rionegro",
      tipo: "finca",
      tamano: "1000m²",
      precio: 380000000,
      credito: false,
      features: ['water', 'power', 'view'],
      imagenes: ["https://images.unsplash.com/photo-1501183007986-d0d080b147f9"],
      desc: "Oasis natural con vista a las montañas. Perfecto para retiro o inversión turística.",
      contacto: "3129876543",
    },
    {
      id: 3,
      titulo: "Lote Campestre Cali",
      ciudad: "Cali",
      tipo: "campestre",
      tamano: "500m²",
      precio: 210000000,
      credito: true,
      features: ['water', 'power', 'gas', 'view'],
      imagenes: ["https://images.unsplash.com/photo-1472157592780-9d0f18272306"],
      desc: "Ubicación privilegiada en zona de alto desarrollo. Clima fresco y seguridad.",
      contacto: "3015558899",
    }
  ];

  useEffect(() => {
    getPropiedades()
      .then((res) => {
        // Combinar mock con API si existe
        setData(res?.length > 0 ? res : allProperties);
        setLoading(false);
      })
      .catch(() => {
        setData(allProperties);
        setLoading(false);
      });
  }, []);

  const handleFeatureToggle = (featureId) => {
    setFilters(prev => ({
        ...prev,
        features: prev.features.includes(featureId)
            ? prev.features.filter(f => f !== featureId)
            : [...prev.features, featureId]
    }));
  };

  const filteredData = data.filter(item => {
    const titulo = item?.titulo || "";
    const desc = item?.desc || "";
    const matchesSearch = titulo.toLowerCase().includes(filters.search.toLowerCase()) || 
                         desc.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCity = filters.city === "todos" || item?.ciudad === filters.city;
    const matchesType = filters.type === "todos" || item?.tipo === filters.type;
    const matchesFeatures = filters.features.length === 0 || 
                           filters.features.every(f => item?.features?.includes(f));
    
    let matchesPrice = true;
    const price = item?.precio || item?.price || 0;
    if (filters.priceRange === "low") matchesPrice = price < 150000000;
    if (filters.priceRange === "mid") matchesPrice = price >= 150000000 && price <= 300000000;
    if (filters.priceRange === "high") matchesPrice = price > 300000000;

    const matchesCertified = !filters.certifiedOnly || item?.is_certified === true;

    return matchesSearch && matchesCity && matchesType && matchesFeatures && matchesPrice && matchesCertified;
  });

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-0">
      {/* Header Search Section - Ultra thin minimal footprint */}
      <div className="bg-[#172c34] text-white pt-[60px] pb-3 md:pt-[80px] md:pb-4 px-4 shadow-inner flex items-center w-full">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-6">
            <h1 className="text-sm md:text-2xl font-black tracking-tight whitespace-nowrap hidden md:block">Encuentra tu lugar ideal</h1>
            <div className="flex-1 w-full max-w-3xl relative">
                {/* Escritorio: Input real */}
                <input 
                    type="text" 
                    placeholder="Buscar zonas, lotes, fincas..."
                    className="hidden md:block w-full bg-white p-3 pl-12 rounded-xl text-gray-900 placeholder-gray-500 font-bold focus:ring-4 focus:ring-orange-600/20 outline-none transition-all text-sm shadow-sm"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
                
                {/* Móvil: Botón que simula input y abre drawer */}
                <button 
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="md:hidden w-full bg-white p-3 pl-10 rounded-xl text-gray-500 font-bold text-left text-[11px] shadow-sm flex items-center"
                >
                    <span className="truncate">{filters.search ? filters.search : "Toca aquí para buscar o filtrar..."}</span>
                </button>

                <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600 font-bold pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>
      </div>

      {/* Action Bar (Mobile & Desktop) */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 items-center overflow-x-auto scrollbar-none">
            {/* Filter Toggle */}
            <button 
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex items-center gap-2 bg-[#172c34] px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-white hover:bg-orange-600 transition-all shadow-lg shadow-gray-200"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtros
            </button>

            {/* City Dropdown Button */}
            <button 
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-600 hover:bg-gray-100 transition-all"
            >
                {filters.city === "todos" ? "Todas las ciudades" : filters.city}
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Habitech Certified Action Button */}
            <button 
                onClick={() => setFilters({...filters, certifiedOnly: !filters.certifiedOnly})}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex-shrink-0 ${
                    filters.certifiedOnly 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 border border-blue-600' 
                    : 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100'
                }`}
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                Certificados
            </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 md:p-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters (Desktop Only) */}
        <aside className="hidden md:block w-72 flex-none space-y-8">
            <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 sticky top-20">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Filtros Avanzados</h2>
                
                <div className="space-y-6">
                    {/* Tipo de Propiedad */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 mb-2">Tipo de Inmueble</label>
                        <select 
                            className="w-full p-3 bg-gray-50 rounded-xl font-bold text-gray-700 outline-none border border-transparent focus:border-orange-600 transition-all text-xs"
                            value={filters.type}
                            onChange={(e) => setFilters({...filters, type: e.target.value})}
                        >
                            <option value="todos">Todos los tipos</option>
                            <option value="lote">Lote / Terreno</option>
                            <option value="finca">Finca</option>
                            <option value="casa">Casa</option>
                            <option value="prefabricada">Casa Prefabricada</option>
                            <option value="urbano">Lote Urbano</option>
                            <option value="campestre">Lote Campestre</option>
                        </select>
                    </div>

                    {/* Ciudad */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 mb-2">Ciudad</label>
                        <select 
                            className="w-full p-3 bg-gray-50 rounded-xl font-bold text-gray-700 outline-none border border-transparent focus:border-orange-600 transition-all text-xs"
                            value={filters.city}
                            onChange={(e) => setFilters({...filters, city: e.target.value})}
                        >
                            <option value="todos">Todas las ciudades</option>
                            <option value="Medellín">Medellín</option>
                            <option value="Rionegro">Rionegro</option>
                            <option value="Cali">Cali</option>
                            <option value="Bogotá">Bogotá</option>
                            <option value="Barranquilla">Barranquilla</option>
                        </select>
                    </div>

                    {/* Precio */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 mb-2">Presupuesto</label>
                        <select 
                            className="w-full p-3 bg-gray-50 rounded-xl font-bold text-gray-700 outline-none border border-transparent focus:border-orange-600 transition-all"
                            value={filters.priceRange}
                            onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                        >
                            <option value="todos">Cualquier precio</option>
                            <option value="low">Menos de $150M</option>
                            <option value="mid">$150M - $300M</option>
                            <option value="high">Más de $300M</option>
                        </select>
                    </div>

                    {/* Características */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 mb-3">Características</label>
                        <div className="grid grid-cols-1 gap-2">
                            {MOCK_CHARACTERSITICS.map(feat => (
                                <button
                                    key={feat.id}
                                    onClick={() => handleFeatureToggle(feat.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all ${
                                        filters.features.includes(feat.id)
                                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-100'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <span>{feat.icon}</span>
                                    {feat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Certificación Habitech */}
                    <div>
                        <div 
                            onClick={() => setFilters({...filters, certifiedOnly: !filters.certifiedOnly})}
                            className="flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-orange-50 hover:border-orange-200"
                            style={{ borderColor: filters.certifiedOnly ? '#ea580c' : '#f3f4f6', backgroundColor: filters.certifiedOnly ? '#fff7ed' : 'transparent' }}
                        >
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-gray-900 tracking-wider">Habitech Certified</span>
                                <span className="text-[8px] text-gray-500 font-bold uppercase mt-1">Garantía Inmobiliaria</span>
                            </div>
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${filters.certifiedOnly ? 'bg-orange-600' : 'bg-gray-200'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${filters.certifiedOnly ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setFilters({search: "", city: "todos", type: "todos", priceRange: "todos", features: []})}
                    className="w-full mt-8 p-3 text-[10px] font-black text-orange-600 uppercase tracking-widest border-2 border-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all"
                >
                    Limpiar Filtros
                </button>
            </div>
        </aside>

        {/* Mobile Filter Drawer (Overlay) */}
        {isFilterDrawerOpen && (
            <div className="fixed inset-0 z-[1100] md:hidden">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterDrawerOpen(false)}></div>
                <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-[3rem] p-8 animate-in slide-in-from-bottom duration-300">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>
                    <h2 className="text-xl font-black text-gray-900 mb-8 tracking-tight">Filtros de Búsqueda</h2>
                    
                    <div className="space-y-8 max-h-[60vh] overflow-y-auto pb-10 scrollbar-none px-1">
                         {/* Búsqueda de Texto (Solo Móvil) */}
                         <div className="md:hidden">
                            <label className="block text-[10px] font-black uppercase text-gray-500 mb-3">Palabras Clave</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Ej: Lote con vista, o un código..."
                                    className="w-full p-4 pl-12 bg-gray-50 rounded-2xl font-bold text-gray-900 outline-none border border-transparent focus:border-orange-600 transition-all shadow-sm"
                                    value={filters.search}
                                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                                />
                                <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-orange-600 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                         </div>

                         {/* Tipo de Propiedad */}
                         <div>
                            <label className="block text-[10px] font-black uppercase text-gray-500 mb-3">Tipo de Inmueble</label>
                            <select 
                                className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none border border-transparent focus:border-orange-600 transition-all shadow-sm"
                                value={filters.type}
                                onChange={(e) => setFilters({...filters, type: e.target.value})}
                            >
                                <option value="todos">Todos los tipos</option>
                                <option value="lote">Lote / Terreno</option>
                                <option value="finca">Finca</option>
                                <option value="casa">Casa</option>
                                <option value="prefabricada">Casa Prefabricada</option>
                                <option value="urbano">Lote Urbano</option>
                                <option value="campestre">Lote Campestre</option>
                            </select>
                         </div>

                         {/* Ciudad */}
                         <div>
                            <label className="block text-[10px] font-black uppercase text-gray-500 mb-3">Ciudad</label>
                            <select 
                                className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none border border-transparent focus:border-orange-600 transition-all shadow-sm"
                                value={filters.city}
                                onChange={(e) => setFilters({...filters, city: e.target.value})}
                            >
                                <option value="todos">Todas las ciudades</option>
                                <option value="Medellín">Medellín</option>
                                <option value="Rionegro">Rionegro</option>
                                <option value="Cali">Cali</option>
                                <option value="Bogotá">Bogotá</option>
                                <option value="Barranquilla">Barranquilla</option>
                            </select>
                         </div>

                         {/* Precio */}
                         <div>
                            <label className="block text-[10px] font-black uppercase text-gray-500 mb-3">Presupuesto</label>
                            <div className="grid grid-cols-1 gap-2">
                                {['todos', 'low', 'mid', 'high'].map(range => (
                                    <button 
                                        key={range}
                                        onClick={() => setFilters({...filters, priceRange: range})}
                                        className={`p-4 rounded-2xl text-sm font-bold transition-all ${
                                            filters.priceRange === range ? 'bg-[#172c34] text-white shadow-xl' : 'bg-gray-50 text-gray-600'
                                        }`}
                                    >
                                        {range === 'todos' ? 'Cualquier precio' : range === 'low' ? 'Menos de $150M' : range === 'mid' ? '$150M - $300M' : 'Más de $300M'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Certificación Habitech (Mobile) */}
                        <div>
                            <div 
                                onClick={() => setFilters({...filters, certifiedOnly: !filters.certifiedOnly})}
                                className="flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.98]"
                                style={{ borderColor: filters.certifiedOnly ? '#ea580c' : '#f3f4f6', backgroundColor: filters.certifiedOnly ? '#fff7ed' : '#f9fafb' }}
                            >
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-black uppercase text-gray-900 tracking-wider">Habitech Certified</span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase mt-1">Propiedades Verificadas</span>
                                </div>
                                <div className={`w-12 h-7 rounded-full p-1 transition-colors ${filters.certifiedOnly ? 'bg-orange-600' : 'bg-gray-300'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${filters.certifiedOnly ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                            </div>
                        </div>

                        {/* Características */}
                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-500 mb-3">Características del Lote</label>
                            <div className="grid grid-cols-2 gap-3">
                                {MOCK_CHARACTERSITICS.map(feat => (
                                    <button
                                        key={feat.id}
                                        onClick={() => handleFeatureToggle(feat.id)}
                                        className={`flex items-center gap-3 p-4 rounded-2xl text-xs font-bold transition-all ${
                                            filters.features.includes(feat.id)
                                                ? 'bg-orange-600 text-white shadow-lg'
                                                : 'bg-gray-50 text-gray-600'
                                        }`}
                                    >
                                        <span>{feat.icon}</span>
                                        {feat.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setFilters({search: "", city: "todos", type: "todos", priceRange: "todos", features: [], certifiedOnly: false})}
                        className="w-full mt-4 p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-orange-600 transition-all text-center"
                    >
                        Restablecer Filtros
                    </button>

                    <button 
                        onClick={() => setIsFilterDrawerOpen(false)}
                        className="w-full bg-[#172c34] text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all mt-2"
                    >
                        Ver {filteredData.length} Resultados
                    </button>
                </div>
            </div>
        )}

        {/* Results Grid */}
        <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400 text-sm font-medium">Mostrando <span className="text-gray-900 font-black">{filteredData.length}</span> resultados</span>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent mb-4"></div>
                    <p className="font-black uppercase tracking-widest text-xs">Cargando Oportunidades...</p>
                </div>
            ) : filteredData.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] text-center shadow-sm border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold">No encontramos lotes con esos filtros. <br/>Prueba quitando algunas características.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {filteredData.map((item) => {
                        const title = item?.title || item?.titulo || "Propiedad sin título";
                        const type = item?.type || item?.tipo || "Inmueble";
                        const price = item?.price || item?.precio || 0;
                        const location = item?.location || item?.ciudad || "Ubicación no especificada";
                        const description = item?.description || item?.desc || "Sin descripción";
                        const isCertified = item?.is_certified || false;
                        const authorName = item?.profiles?.full_name || 'VIP SELLER';

                        return (
                            <Link 
                                key={item.id} 
                                to={`/terrenoVentas/${item.id}`}
                                className="group bg-white rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col transform hover:-translate-y-2 h-full"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 flex flex-col gap-1 md:gap-2">
                                        <span className="px-2 py-1 md:px-3 md:py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-[8px] md:text-[10px] font-black text-orange-600 uppercase tracking-widest shadow-lg">
                                            {type}
                                        </span>
                                        {isCertified && (
                                            <div className="bg-blue-600 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1 md:gap-1.5 shadow-lg animate-in zoom-in duration-500">
                                                <svg className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                                                <span className="text-[6px] md:text-[8px] font-black uppercase tracking-widest hidden md:inline">CERTIFIED</span>
                                            </div>
                                        )}
                                    </div>
                                    {item?.imagenes?.[0] || item?.images?.[0] ? (
                                        <img
                                            src={item?.imagenes?.[0] || item?.images?.[0]}
                                            alt={title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-orange-50 text-orange-200">
                                            <svg className="w-8 h-8 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 md:p-6">
                                        <p className="text-sm md:text-2xl font-black text-white tracking-tight">
                                            ${price.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-3 md:p-8 flex-1 flex flex-col">
                                    <div className="mb-2 md:mb-4">
                                        <h3 className="text-[12px] md:text-xl font-black text-gray-900 capitalize leading-tight group-hover:text-orange-600 transition-colors line-clamp-2 md:truncate mb-1">
                                            {title}
                                        </h3>
                                        <p className="text-[9px] md:text-[11px] text-gray-400 flex items-center gap-1 font-bold uppercase tracking-wider">
                                            <svg className="w-3 h-3 md:w-4 md:h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            <span className="truncate">{location}</span>
                                        </p>
                                    </div>
                                    <p className="text-gray-500 text-[10px] md:text-sm line-clamp-2 mb-4 md:mb-8 flex-1 font-medium leading-relaxed hidden md:block">
                                        {description}
                                    </p>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mt-auto pt-3 md:pt-6 border-t border-gray-50 gap-2">
                                        <span className="text-[7px] md:text-[9px] text-gray-400 uppercase tracking-widest font-black truncate">
                                            Cód: {item.id}
                                        </span>
                                        <span className="bg-gray-900 text-white text-center px-2 py-1.5 md:px-7 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black group-hover:bg-orange-600 transition-all shadow-md md:shadow-xl shadow-gray-200 uppercase tracking-widest w-full md:w-auto">
                                            VER
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
      {/* Bottom padding for mobile bar */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
}
