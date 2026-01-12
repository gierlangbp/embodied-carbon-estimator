import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#efede8] p-4">
            <div className="bg-white rounded-[2rem] shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-16 bg-black text-white rounded-2xl mb-4">
                        <span className="material-symbols-outlined text-3xl">eco</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 text-sm mt-2">Sign in to access your projects</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                        <input type="email" value="user@example.com" readOnly className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-gray-50" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
                        <input type="password" value="password" readOnly className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-gray-50" />
                    </div>

                    <button type="submit" className="w-full bg-[#111418] text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-black transition-all transform hover:scale-[1.02] active:scale-95">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
