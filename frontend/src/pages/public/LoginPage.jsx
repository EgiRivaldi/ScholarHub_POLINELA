import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import AnimatedBackground from '@/components/public/AnimatedBackground';

import { loginAdmin } from '@/services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginAdmin(formData.username, formData.password);
      if (response.success) {
        localStorage.setItem('admin_logged_in', 'true');
        if (response.data) {
          localStorage.setItem('admin', JSON.stringify(response.data));
        }
        toast.success('Masuk berhasil!');
        navigate('/admin');
      } else {
        toast.error(response.message || 'Respon dari server tidak valid.');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Username atau kata sandi salah.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12 overflow-hidden">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        <div className="glass-ios rounded-[32px] border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 sm:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200/50 shadow-sm mb-4 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <svg className="h-12 w-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6200EE" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                  <linearGradient id="limeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#84CC16" />
                    <stop offset="100%" stopColor="#A3E635" />
                  </linearGradient>
                </defs>
                <path d="M50 15 L82 32 L50 49 L18 32 Z" fill="url(#purpleGrad)" />
                <path d="M32 38 V48 C32 58 68 58 68 48 V38" fill="url(#purpleGrad)" opacity="0.9" />
                <path d="M50 32 C50 32 74 34 74 46 C74 58 46 55 46 67 C46 78 74 78 74 78" stroke="url(#limeGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 text-glow">Selamat Datang Kembali</h1>
            <p className="text-[10px] font-black text-slate-400 mt-1.5 uppercase tracking-wider">Masuk ke Panel Admin</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-username" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                id="login-username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white/5 text-sm text-text placeholder:text-text-secondary focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-11 px-3.5 pr-11 rounded-xl border border-slate-200 bg-white/5 text-sm text-text placeholder:text-text-secondary focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200"
                  placeholder="Masukkan kata sandi"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-bold text-sm shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.01] cursor-pointer"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Masuk
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-wider mt-8">
          © {new Date().getFullYear()} ScholarHub POLINELA
        </p>
      </motion.div>
    </div>
  );
}
