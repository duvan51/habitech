import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Projects({ config }) {
  const mockProjects = [
    {
      id: 1,
      title: "Edificio Residencial Altozano",
      type: "Vivienda Multifamiliar",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Desarrollo vertical de 15 niveles ubicado en una de las zonas de mayor valorización. Cuenta con amenidades premium (rooftop, gimnasio y co-working) enfocadas en el profesional moderno."
    },
    {
      id: 2,
      title: "Complejo Empresarial Habitech",
      type: "Corporativo",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Parque empresarial con certificación LEED Gold. Diseño enfocado en la iluminación natural y eficiencia energética, capaz de reducir hasta en un 35% el consumo eléctrico mensual."
    },
    {
      id: 3,
      title: "Reserva Campestre El Roble",
      type: "Vivienda Campestre",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Condominio de lujo rodeado de más de 40.000 m² de reservas forestales nativas. Incluye senderos ecológicos, club house y lotes amplios para respetar la intimidad de cada familia."
    }
  ];

  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section
      id="proyectos"
      className="w-full bg-[#f8f9fa] py-20 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-3 block">Portafolio</span>
          <h2 className="font-black text-3xl md:text-5xl text-[#172c34] tracking-tight mb-6">
            Conoce Nuestros Proyectos
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 font-medium text-lg leading-relaxed">
            Desde viviendas de lujo hasta complejos corporativos de alta eficiencia. Descubre nuestra calidad de diseño y construcción en cada uno de nuestros desarrollos finalizados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {mockProjects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => setSelectedProject(project)}
              className="group rounded-[2rem] overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-gray-100 relative"
            >
               <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               </div>
               <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <p className="text-orange-400 font-bold text-[10px] uppercase tracking-widest mb-2">{project.type}</p>
                  <h3 className="text-white font-black text-xl leading-tight">{project.title}</h3>
               </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
            <Link to="/portafolio" className="bg-[#172c34] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-600/30 active:scale-95 transition-all flex items-center gap-3 group">
                Ver Todo el Portafolio
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </Link>
        </div>
      </div>

      {/* Modal del Proyecto */}
      {selectedProject && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProject(null)}></div>
          <div className="relative bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 h-64 md:h-[500px]">
                <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest self-start mb-4">{selectedProject.type}</span>
                <h3 className="text-3xl font-black text-[#172c34] leading-tight mb-6">{selectedProject.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed mb-8">{selectedProject.description}</p>
                
                <div className="mt-auto">
                    <Link to="/contacto" className="w-full block text-center bg-orange-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-orange-500 transition-colors">
                        Consultar Inversión
                    </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
