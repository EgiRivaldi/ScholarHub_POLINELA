import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import errorImage from '@/assets/images/error-404.png';

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <img
          src={errorImage}
          alt="Halaman tidak ditemukan"
          className="w-56 h-56 mx-auto object-contain mb-8"
        />
        <h1 className="text-7xl font-extrabold gradient-text mb-4">404</h1>
        <h2 className="text-xl font-semibold text-slate-800 mb-3">Halaman Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Halaman yang Anda cari tidak ada atau telah dipindahkan. Mari kembali ke jalur yang benar.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </motion.div>
    </div>
  );
}
