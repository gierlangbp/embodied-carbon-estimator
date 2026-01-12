import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate, useParams } from 'react-router-dom';

const ProjectPage = () => {
    const { materialIntensityDb, carbonFactors, addProject, updateProject, deleteProject, projects, loading } = useData();
    const navigate = useNavigate();
    const { id } = useParams();

    // Form State
    const [buildingId, setBuildingId] = useState('');
    const [area, setArea] = useState(1000);
    const [funcType, setFuncType] = useState('residential multi-family');
    const [structType, setStructType] = useState('reinforced concrete structure');
    const [location, setLocation] = useState('Jakarta, Indonesia');
    const [lat, setLat] = useState(-6.2088);
    const [lng, setLng] = useState(106.8456);

    // Calculation State
    // selections: { [material]: percentileValue }
    const [materialSelections, setMaterialSelections] = useState({});

    // Custom Carbon Factors: { [material]: customValue }
    const [customCarbonFactors, setCustomCarbonFactors] = useState({});

    // Available Options
    const funcOptions = Object.keys(materialIntensityDb || {}).sort();
    const structOptions = funcOptions.length > 0 && materialIntensityDb[funcType]
        ? Object.keys(materialIntensityDb[funcType]).sort()
        : [];

    // Load existing project if editing
    useEffect(() => {
        if (id && projects.length > 0) {
            const project = projects.find(p => p.id === parseInt(id));
            if (project) {
                setBuildingId(project.buildingId);
                setArea(project.area);
                setFuncType(project.type);
                setStructType(project.structuralType);
                setLocation(project.location);
                setLat(project.lat || -6.2088);
                setLng(project.lng || 106.8456);
                setMaterialSelections(project.materialSelections || {});
                setCustomCarbonFactors(project.customCarbonFactors || {});
            }
        }
    }, [id, projects]);

    // Reset/Init selections when Type changes ONLY if not editing existing project
    // Reset/Init selections when Type changes ONLY if not editing existing project initially
    // AND if the user actually changes the type while on the page
    useEffect(() => {
        // We only want to set initial selections if we have data AND (it's a new project OR the user changed type)
        // To avoid overwriting loaded data, check if we have selections for this type
        if (!loading && materialIntensityDb[funcType] && materialIntensityDb[funcType][structType]) {
            const materials = materialIntensityDb[funcType][structType];
            // Simple check: if current selections don't match material keys, likely need reset
            const currentKeys = Object.keys(materialSelections);
            const newKeys = Object.keys(materials);

            // If we have selections and they match (roughly), don't reset. 
            // Logic: If user specifically changed type, we want to reset. 
            // We can track "lastType" to detect change, but simpler:
            // If selections are empty, fill default.
            if (currentKeys.length === 0) {
                const initialSelections = {};
                Object.keys(materials).forEach(mat => {
                    initialSelections[mat] = materials[mat].p50;
                });
                setMaterialSelections(initialSelections);
            }
        }
    }, [funcType, structType, loading, materialIntensityDb]); // Removed 'id' to prevent reset on load

    if (loading) return <div className="p-10">Loading Data...</div>;

    // Derived Calculations
    const materials = (materialIntensityDb[funcType] && materialIntensityDb[funcType][structType]) || {};
    let totalCarbon = 0;

    // Prepare Table Rows
    const tableRows = Object.keys(materials).map(mat => {
        const intensityData = materials[mat];
        const selectedIntensity = materialSelections[mat] || 0;
        const totalStock = selectedIntensity * area;

        // Use custom factor if set, otherwise default
        const defaultFactor = carbonFactors[mat] || 0;
        const currentFactor = customCarbonFactors[mat] !== undefined ? customCarbonFactors[mat] : defaultFactor;

        const embodiedCarbon = totalStock * currentFactor;

        totalCarbon += embodiedCarbon;

        return {
            material: mat,
            intensityData,
            selectedIntensity,
            totalStock,
            defaultFactor,
            currentFactor,
            embodiedCarbon
        };
    });

    const handleSave = () => {
        const projectData = {
            id: id ? parseInt(id) : Date.now(),
            buildingId,
            area,
            type: funcType,
            structuralType: structType,
            location,
            lat,
            lng,
            calculatedCarbon: totalCarbon,
            timestamp: new Date().toISOString(),
            materialSelections,
            customCarbonFactors
        };

        if (id) {
            updateProject(projectData);
        } else {
            addProject(projectData);
        }
        navigate('/projects');
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            deleteProject(parseInt(id));
            navigate('/projects');
        }
    };

    return (
        <main className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 pt-28 px-6 max-w-[1600px] mx-auto">
            {/* Header / Input Section */}
            <div className="md:col-span-12 flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                <div>
                    <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
                        <span className="cursor-pointer hover:text-text-main" onClick={() => navigate('/projects')}>Projects</span>
                        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                        <span className="text-text-main font-semibold">{id ? 'Edit Project' : 'New Analysis'}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-text-main">
                            {id ? `Edit: ${buildingId}` : 'Project Definition'}
                        </h2>
                        {id && (
                            <button
                                onClick={handleDelete}
                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                                title="Delete Project"
                            >
                                <span className="material-symbols-outlined text-[24px]">delete</span>
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4 items-end bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Building ID</label>
                            <input
                                type="text"
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold w-48 focus:ring-2 focus:ring-black focus:border-transparent"
                                value={buildingId}
                                onChange={e => setBuildingId(e.target.value)}
                                placeholder="e.g. BLDG-001"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Latitude</label>
                            <input
                                type="number"
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold w-32 focus:ring-2 focus:ring-black focus:border-transparent"
                                value={lat}
                                onChange={e => setLat(parseFloat(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Longitude</label>
                            <input
                                type="number"
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold w-32 focus:ring-2 focus:ring-black focus:border-transparent"
                                value={lng}
                                onChange={e => setLng(parseFloat(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Area (m²)</label>
                            <input
                                type="number"
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold w-32 focus:ring-2 focus:ring-black focus:border-transparent"
                                value={area}
                                onChange={e => setArea(parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Function</label>
                            <select
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold w-48 focus:ring-2 focus:ring-black focus:border-transparent"
                                value={funcType}
                                onChange={e => {
                                    setFuncType(e.target.value);
                                    setMaterialSelections({}); // Force reset on change
                                }}
                            >
                                {funcOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Structure</label>
                            <select
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold w-56 focus:ring-2 focus:ring-black focus:border-transparent"
                                value={structType}
                                onChange={e => {
                                    setStructType(e.target.value);
                                    setMaterialSelections({}); // Force reset on change
                                }}
                            >
                                {structOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="md:col-span-4 bg-surface-light rounded-2xl p-6 shadow-soft border border-white/60 flex flex-col justify-between h-48 relative overflow-hidden group">
                <div>
                    <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Total Embodied Carbon</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-4xl font-bold text-text-main">{(totalCarbon / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}</h3>
                        <span className="text-lg text-text-muted font-medium">tons CO2e</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-auto">
                    <p className="text-text-muted text-xs">Based on selected intensities</p>
                </div>
            </div>

            {/* Table Section */}
            <div className="md:col-span-12 lg:col-span-12 bg-surface-light rounded-2xl shadow-soft border border-white/60 flex flex-col h-full overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                    <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                        <span className="material-symbols-outlined text-text-muted">table_chart</span>
                        Material Breakdown
                    </h3>
                </div>
                <div className="overflow-x-auto flex-1 bg-white/30 p-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-wider text-text-muted border-b border-gray-100 bg-gray-50/50">
                                <th className="px-6 py-4 font-bold">Material</th>
                                <th className="px-6 py-4 font-bold text-right">Material Intensity (kg/m²)</th>
                                <th className="px-6 py-4 font-bold text-right">Total Stock (kg)</th>
                                <th className="px-6 py-4 font-bold text-right w-40">Carbon Factor <span className="normal-case font-normal">(editable)</span></th>
                                <th className="px-6 py-4 font-bold text-right">Embodied Carbon (kgCO2e)</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-text-main">
                            {tableRows.map((row) => (
                                <tr key={row.material} className="group hover:bg-white/80 transition-colors border-b border-gray-50">
                                    <td className="px-6 py-4 font-medium capitalize">{row.material}</td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex items-center justify-end w-full">
                                            <div className="relative w-full max-w-[180px]">
                                                <select
                                                    className="w-full bg-white border border-gray-200 text-gray-700 py-1.5 px-3 rounded-lg text-xs shadow-sm cursor-pointer"
                                                    value={row.selectedIntensity}
                                                    onChange={(e) => setMaterialSelections(prev => ({ ...prev, [row.material]: parseFloat(e.target.value) }))}
                                                >
                                                    <option value={row.intensityData.p0}>P0 ({row.intensityData.p0.toFixed(1)})</option>
                                                    <option value={row.intensityData.p25}>P25 ({row.intensityData.p25.toFixed(1)})</option>
                                                    <option value={row.intensityData.p50}>P50 ({row.intensityData.p50.toFixed(1)})</option>
                                                    <option value={row.intensityData.p75}>P75 ({row.intensityData.p75.toFixed(1)})</option>
                                                    <option value={row.intensityData.p100}>P100 ({row.intensityData.p100.toFixed(1)})</option>
                                                </select>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold">{row.totalStock.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="px-6 py-3 text-right">
                                        <input
                                            type="number"
                                            step="0.001"
                                            className="border border-gray-200 rounded-lg px-2 py-1 text-xs font-medium w-24 text-right focus:ring-1 focus:ring-black focus:border-transparent"
                                            value={row.currentFactor}
                                            onChange={(e) => setCustomCarbonFactors(prev => ({
                                                ...prev,
                                                [row.material]: parseFloat(e.target.value)
                                            }))}
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-right font-black">{row.embodiedCarbon.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
                    <button className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-semibold" onClick={() => navigate('/projects')}>
                        Cancel
                    </button>
                    <button className="px-5 py-2.5 bg-text-main hover:bg-black text-white text-xs font-semibold rounded-lg shadow-lg flex items-center gap-2" onClick={handleSave}>
                        <span className="material-symbols-outlined text-[16px]">save</span>
                        {id ? 'Update Project' : 'Save Project'}
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ProjectPage;
