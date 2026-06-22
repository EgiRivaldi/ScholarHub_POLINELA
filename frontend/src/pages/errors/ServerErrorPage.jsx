import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function ServerErrorPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 rounded-full bg-danger/10">
          <span className="text-4xl">⚠️</span>
        </div>
        <h1 className="text-7xl font-extrabold text-danger mb-4">500</h1>
        <h2 className="text-xl font-semibold text-slate-800 mb-3">Kesalahan Server Internal</h2>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Terjadi kesalahan pada sistem kami. Silakan coba beberapa saat lagi.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 transition-all cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
