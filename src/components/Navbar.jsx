import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

const Navbar = () => {
    const location = useLocation();

    const getLinkClass = (path) => {
        const isActive = location.pathname === path;
        return classNames(
            "px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer",
            {
                "bg-[#111418] text-white hover:shadow-lg": isActive,
                "text-[#617589] hover:text-[#111418] hover:bg-gray-100": !isActive
            }
        );
    };

    return (
        <div className="fixed top-6 z-50 w-full max-w-fit mx-auto px-4 left-0 right-0">
            <nav className="flex items-center gap-1 bg-white/80 backdrop-blur-md px-2 py-2 rounded-full shadow-soft border border-white/40">
                <Link to="/" className={getLinkClass('/')}>Dashboard</Link>
                <Link to="/projects" className={getLinkClass('/projects')}>Projects</Link>
                <Link to="/project/new" className={getLinkClass('/project/new')}>New Project</Link>
                <Link to="/database" className={getLinkClass('/database')}>Materials</Link>
                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                {/* Search & Settings Placeholders */}
                <button className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-[#111418]">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                </button>
                <button className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-[#111418]">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                </button>

                {/* User Avatar */}
                <div className="ml-1 size-10 rounded-full bg-gray-200 overflow-hidden cursor-pointer ring-2 ring-white shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDEvDZHzIOcIYqXz_wvw9Q1kLH0fco4WyunLyaCTLNGWlEkerfC8FCZDYQCfTF0MgbgNME4ZYzUCu499tAPQ8oc62ZfFC_ofZf1ZoSpO35tGIwHbVMAugBGnX-6MkMnnGY4Og0F21VucfmJRCSDZn1U3-wIgXJq43JqupHMe4jYesbsvk9WcGG13wbhgE6rPekW-zer8xpGTOc4XjmolQ-Keyw4zXFDsdpUSFL_kKNn3ZUOCuhXYkW7IeZ5icyXQ-rLTAtyumOuu4E")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            </nav>
        </div>
    );
};

export default Navbar;
