import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const ProjectsPage = () => {
    const { projects } = useData();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProjects = projects.filter(p =>
        p.buildingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="w-full max-w-[1600px] px-6 pt-28 pb-10 mx-auto">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-[#111418] text-[32px] font-bold leading-tight tracking-[-0.015em]">All Projects</h1>
                    <p className="text-[#617589] text-base font-normal leading-normal">Manage your carbon estimation projects</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111418] focus:border-transparent w-64"
                        />
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[20px]">search</span>
                    </div>
                    <button
                        onClick={() => navigate('/project/new')}
                        className="flex items-center gap-2 bg-[#111418] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        New Project
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project ID</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Area (m²)</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Carbon (tCO2e)</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map((project, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 font-medium text-[#111418]">{project.buildingId}</td>
                                        <td className="py-4 px-6 text-gray-600 capitalize">{project.type}</td>
                                        <td className="py-4 px-6 text-gray-600">{project.area?.toLocaleString()}</td>
                                        <td className="py-4 px-6 text-gray-600">{project.location}</td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {(project.calculatedCarbon / 1000).toFixed(1)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => navigate(`/project/${project.id}`)}
                                                className="text-[#111418] hover:text-blue-600 font-medium text-sm"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-gray-500">
                                        No projects found. Create one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default ProjectsPage;
