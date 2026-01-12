import React from 'react';
import { useData } from '../context/DataContext';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure CSS is imported if bundler handles it, though we added CDN link just in case
import L from 'leaflet';

// Fix Leaflet's default icon path issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom Icon Generator
const createCustomIcon = (type) => {
    let iconName = 'location_on';
    let color = '#6b7280'; // gray default

    if (type) {
        const t = type.toLowerCase();

        if (t === 'residential single family' || t.includes('single')) {
            iconName = 'home';
            color = '#10b981'; // emerald green
        } else if (t === 'residential multi-family' || t.includes('multi')) {
            iconName = 'apartment';
            color = '#0ea5e9'; // sky blue
        } else if (t === 'non-residential' || t.includes('non')) {
            iconName = 'domain'; // Generic building
            color = '#f59e0b'; // amber/orange to distinguish from residential
        }
    }

    return L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  <span class="material-symbols-outlined" style="color: white; font-size: 20px;">${iconName}</span>
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
};

const MapResizer = () => {
    const map = useMap();
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        return () => clearTimeout(timeout);
    }, [map]);
    return null;
};

const Dashboard = () => {
    const { projects } = useData();
    const navigate = useNavigate();

    // Calculate aggregated stats
    const totalArea = projects.reduce((sum, p) => sum + (parseFloat(p.area) || 0), 0);
    const activeProjectsCount = projects.length;

    // Default center (Jakarta) if no projects, else center on first project
    const defaultCenter = [-6.2088, 106.8456];
    const mapCenter = projects.length > 0 && projects[0].lat ? [projects[0].lat, projects[0].lng] : defaultCenter;

    return (
        <main className="w-full max-w-[1600px] px-6 pt-28 pb-10 grid grid-cols-12 gap-6 h-full mx-auto">
            {/* Header */}
            <div className="col-span-12 lg:col-span-12 flex flex-col md:flex-row justify-between items-end mb-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[#111418] text-[32px] font-bold leading-tight tracking-[-0.015em]">Embodied Carbon Estimator</h1>
                    <p className="text-[#617589] text-base font-normal leading-normal">RASMI Framework</p>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                    <button className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all text-[#111418]">
                        <span className="material-symbols-outlined text-[18px]">filter_list</span>
                        Filter
                    </button>
                    <Link to="/project/new" className="flex items-center gap-2 bg-[#111418] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-black transition-all">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        New Project
                    </Link>
                </div>
            </div>

            {/* Stat Cards... (Keep same) */}
            <div className="col-span-12 md:col-span-6 lg:col-span-6">
                {/* Reusing existing stat card structure */}
                <div className="bg-white rounded-3xl p-6 h-full shadow-card flex flex-col justify-between min-h-[160px]">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-green-50 rounded-2xl">
                            <span className="material-symbols-outlined text-green-600">forest</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">more_horiz</span></button>
                    </div>
                    <div>
                        <p className="text-3xl font-bold mt-4">{activeProjectsCount}</p>
                        <p className="text-sm text-gray-500 font-medium">Active Projects</p>
                    </div>
                </div>
            </div>

            <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <div className="bg-white rounded-3xl p-6 h-full shadow-card flex flex-col justify-between min-h-[160px]">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-blue-50 rounded-2xl">
                            <span className="material-symbols-outlined text-blue-600">architecture</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">more_horiz</span></button>
                    </div>
                    <div>
                        <p className="text-3xl font-bold mt-4">{totalArea.toLocaleString()} <span className="text-base font-normal text-gray-400">m²</span></p>
                        <p className="text-sm text-gray-500 font-medium">Total Area Tracked</p>
                    </div>
                </div>
            </div>

            {/* Map Section - Increased emphasis as requested implicitly by 'dashboard details' */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                <div className="bg-white rounded-[2rem] p-6 h-full min-h-[500px] shadow-card relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="text-xl font-bold">Location Map</h3>
                    </div>
                    <div className="absolute inset-0 top-16 rounded-[2rem] overflow-hidden" style={{ zIndex: 0 }}>
                        <MapContainer center={mapCenter} zoom={11} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                            <MapResizer />
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {projects.map((proj, idx) => (
                                proj.lat && proj.lng ? (
                                    <Marker
                                        key={idx}
                                        position={[proj.lat, proj.lng]}
                                        icon={createCustomIcon(proj.type)}
                                    >
                                        <Popup>
                                            <div className="font-sans text-sm cursor-pointer" onClick={() => navigate(`/project/${proj.id}`)}>
                                                <strong className="text-blue-600 hover:underline">{proj.buildingId}</strong><br />
                                                {proj.type}<br />
                                                {(proj.calculatedCarbon / 1000).toFixed(1)} tCO2e
                                            </div>
                                        </Popup>
                                    </Marker>
                                ) : null
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>

            {/* Detailed Project List in Dashboard */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white rounded-[2rem] p-6 shadow-card flex flex-col h-full min-h-[500px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Recent Activity</h3>
                        <Link to="/projects" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-auto pr-2 flex-grow max-h-[600px]">
                        {projects.length === 0 ? (
                            <p className="text-gray-400 text-center mt-10">No projects yet. Add one!</p>
                        ) : (
                            projects.slice(0, 5).map((proj, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => navigate(`/project/${proj.id}`)}
                                    className="p-4 rounded-2xl bg-[#f8f9fa] hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-soft transition-all group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                                            {proj.type ? proj.type.substring(0, 3).toUpperCase() : 'BLD'}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm text-[#111418] truncate">{proj.buildingId}</h4>
                                            <p className="text-xs text-gray-500 truncate">{proj.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end border-t border-gray-100 pt-3">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Carbon</p>
                                            <p className="text-lg font-bold leading-none">
                                                {(proj.calculatedCarbon / 1000).toFixed(1)} <span className="text-xs font-normal text-gray-400">tCO2e</span>
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined text-gray-300 group-hover:text-blue-600 transition-colors text-xl">arrow_forward</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
