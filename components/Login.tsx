import React, { useState } from 'react';
import { User } from '../types';
import { KeyRound, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin({ id: 'u1', username: 'admin', role: 'admin' });
    } else if (username === 'cashier' && password === '1234') {
      onLogin({ id: 'u2', username: 'cashier', role: 'cashier' });
    } else {
      setError('帳號或密碼錯誤 (試試 admin/admin)');
    }
  };

  return (
    <div className="min-h-screen bg-nook-green flex items-center justify-center p-4 bg-leaf-pattern">
      <div className="bg-nook-cream w-full max-w-md rounded-3xl p-8 shadow-[8px_8px_0px_rgba(124,93,64,0.2)] border-4 border-white">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-nook-yellow rounded-full flex items-center justify-center text-white shadow-md">
            <KeyRound size={40} />
          </div>
        </div>
        
        <h2 className="text-3xl font-extrabold text-center text-nook-brown mb-2">歡迎回來!</h2>
        <p className="text-center text-nook-text/70 mb-8">請登入您的 NookPhone POS 系統</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-nook-brown font-bold mb-1 ml-2">帳號</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white border-2 border-nook-brown/20 rounded-2xl px-4 py-3 text-lg focus:outline-none focus:border-nook-green focus:ring-2 focus:ring-nook-green/20 transition-all text-nook-text"
              placeholder="請輸入帳號"
            />
          </div>
          
          <div>
            <label className="block text-nook-brown font-bold mb-1 ml-2">密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-2 border-nook-brown/20 rounded-2xl px-4 py-3 text-lg focus:outline-none focus:border-nook-green focus:ring-2 focus:ring-nook-green/20 transition-all text-nook-text"
              placeholder="請輸入密碼"
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-xl text-center text-sm font-bold animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-nook-blue hover:bg-nook-blue/90 text-white font-extrabold text-xl py-4 rounded-2xl shadow-[0_4px_0_rgb(86,177,196)] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2 mt-4"
          >
            登入 <ArrowRight size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;