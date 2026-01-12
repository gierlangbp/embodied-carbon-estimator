import React, { createContext, useContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [materialIntensityDb, setMaterialIntensityDb] = useState({});
    const [carbonFactors, setCarbonFactors] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load Projects from Electron Store
                if (window.electronAPI) {
                    const savedProjects = await window.electronAPI.getProjects();
                    if (savedProjects) {
                        setProjects(savedProjects);
                    }
                }

                // Load Material Intensity
                const intensityResponse = await fetch('data/material-intensity.csv');
                const intensityText = await intensityResponse.text();

                Papa.parse(intensityText, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const db = {};
                        results.data.forEach(row => {
                            // Structure: db[function][structure][material] = { p0, p25, p50, p75, p100 }
                            // CSV headers: material,function,structure,...,p_0,p_25,p_50,p_75,p_100

                            const func = row.function; // e.g. "residential multi-family"
                            const struct = row.structure; // e.g. "reinforced concrete structure"
                            const mat = row.material; // e.g. "concrete"

                            if (!db[func]) db[func] = {};
                            if (!db[func][struct]) db[func][struct] = {};

                            db[func][struct][mat] = {
                                p0: row.p_0,
                                p25: row.p_25,
                                p50: row.p_50,
                                p75: row.p_75,
                                p100: row.p_100
                            };
                        });
                        setMaterialIntensityDb(db);
                    }
                });

                // Load Embodied Carbon
                const carbonResponse = await fetch('data/embodied carbon.csv');
                const carbonText = await carbonResponse.text();

                Papa.parse(carbonText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const factors = {};
                        results.data.forEach(row => {
                            const material = row['Material'];
                            const range = row['Embodied Carbon (kg CO₂e / kg)'];
                            if (material && range) {
                                // Parse range "0.1 - 0.2" or single value
                                let value = 0;
                                const parts = range.toString().split('–').map(s => parseFloat(s.trim()));
                                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                                    value = (parts[0] + parts[1]) / 2;
                                } else if (!isNaN(parseFloat(range))) {
                                    value = parseFloat(range);
                                }
                                const key = material.toLowerCase();
                                factors[key] = value;

                                // Map "brick (red)" to generic "brick" key used in intensity DB
                                if (key.includes('brick (red)')) {
                                    factors['brick'] = value;
                                }
                            }
                        });
                        setCarbonFactors(factors);
                    }
                });

                setLoading(false);
            } catch (error) {
                console.error("Error loading data:", error);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const addProject = async (project) => {
        const updatedProjects = [project, ...projects];
        setProjects(updatedProjects);
        if (window.electronAPI) {
            await window.electronAPI.saveProjects(updatedProjects);
        }
    };

    const updateProject = async (updatedProject) => {
        const updatedList = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
        setProjects(updatedList);
        if (window.electronAPI) {
            await window.electronAPI.saveProjects(updatedList);
        }
    };

    const deleteProject = async (id) => {
        const updatedList = projects.filter(p => p.id !== id);
        setProjects(updatedList);
        if (window.electronAPI) {
            await window.electronAPI.saveProjects(updatedList);
        }
    };

    return (
        <DataContext.Provider value={{ projects, materialIntensityDb, carbonFactors, loading, addProject, updateProject, deleteProject }}>
            {children}
        </DataContext.Provider>
    );
};
