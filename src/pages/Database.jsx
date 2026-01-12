import React from 'react';
import { useData } from '../context/DataContext';

const DatabasePage = () => {
    const { materialIntensityDb, loading } = useData();

    if (loading) return <div className="p-10">Loading...</div>;

    // Flatten data for table view
    // Function | Structure | Material | P0 | ... | P100
    const rows = [];
    Object.keys(materialIntensityDb).forEach(func => {
        Object.keys(materialIntensityDb[func]).forEach(struct => {
            Object.keys(materialIntensityDb[func][struct]).forEach(mat => {
                rows.push({
                    func,
                    struct,
                    mat,
                    ...materialIntensityDb[func][struct][mat]
                });
            });
        });
    });

    return (
        <main className="w-full max-w-[1600px] px-6 pt-28 pb-10 mx-auto">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-main mb-6">Material Database</h1>

            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-xs uppercase text-gray-500 font-semibold">
                                <th className="px-6 py-4">Function</th>
                                <th className="px-6 py-4">Structure</th>
                                <th className="px-6 py-4">Material</th>
                                <th className="px-6 py-4 text-right">P0</th>
                                <th className="px-6 py-4 text-right">P50</th>
                                <th className="px-6 py-4 text-right">P100</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rows.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-3 text-sm font-medium">{row.func}</td>
                                    <td className="px-6 py-3 text-sm text-gray-500">{row.struct}</td>
                                    <td className="px-6 py-3 text-sm text-gray-500 capitalize">{row.mat}</td>
                                    <td className="px-6 py-3 text-sm text-right font-mono">{row.p0?.toFixed(2)}</td>
                                    <td className="px-6 py-3 text-sm text-right font-mono font-bold text-blue-600">{row.p50?.toFixed(2)}</td>
                                    <td className="px-6 py-3 text-sm text-right font-mono">{row.p100?.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 text-gray-400 text-xs text-center">
                * Database is read-only in this demo version (loaded from CSV).
            </div>
        </main>
    );
};

export default DatabasePage;
