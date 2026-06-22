import { motion } from 'framer-motion';
import {
  Target,
  Eye,
  Users,
  School,
  Sparkles,
  GraduationCap,
  Search,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import AnimatedBackground from '@/components/public/AnimatedBackground';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.4 },
};

export default function AboutPage() {
  return (
    <div className="relative py-12 sm:py-16 min-h-screen">
      <AnimatedBackground />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary text-xs font-bold uppercase tracking-wider mb-6 shadow-sm border border-primary-100">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            Tentang Kami
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-6">
            Apa itu{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">ScholarHub</span>{' '}
            POLINELA?
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            ScholarHub POLINELA adalah platform basis data beasiswa terpusat yang dirancang untuk membantu mahasiswa di Politeknik Negeri Lampung menjelajahi, membandingkan, dan memeriksa matriks persyaratan beasiswa dalam satu wadah.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div {...fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {[
            { icon: Search, title: 'Pencarian Mudah', desc: 'Temukan beasiswa dengan cepat menggunakan pencarian dan filter yang canggih.' },
            { icon: GraduationCap, title: 'Informasi Lengkap', desc: 'Dapatkan persyaratan lengkap dan kriteria kelayakan yang mendetail.' },
            { icon: Globe, title: 'Akses Langsung', desc: 'Tautan langsung ke situs web resmi penyelenggara beasiswa.' },
            { icon: Users, title: 'Fokus Mahasiswa', desc: 'Dibangun secara khusus untuk seluruh mahasiswa POLINELA.' },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl glass-ios hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 mb-4 shadow-sm">
                <feature.icon className="h-5.5 w-5.5 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <motion.div
            {...fadeUp}
            className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 mb-5 shadow-inner">
              <Target className="h-6 w-6 text-primary-light" />
            </div>
            <h2 className="text-xl font-bold mb-3 tracking-tight">Misi Kami</h2>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Menyediakan platform informasi beasiswa yang terpusat, mudah diakses, dan mutakhir yang memberdayakan mahasiswa Politeknik Negeri Lampung untuk menemukan, membandingkan, dan mendaftar program beasiswa dengan efisien.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-primary to-primary-light text-white shadow-xl border border-primary/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/25 mb-5 shadow-inner">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-3 tracking-tight">Visi Kami</h2>
            <p className="text-sm text-white/90 leading-relaxed font-medium">
              Menjadi pusat informasi beasiswa terdepan bagi mahasiswa politeknik di Indonesia, menjembatani kesenjangan antara mahasiswa dan penyedia beasiswa melalui teknologi dan inovasi.
            </p>
          </motion.div>
        </div>

        {/* Benefits */}
        <motion.div {...fadeUp} className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10 tracking-tight">
            Manfaat Utama
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Students */}
            <div className="p-6 sm:p-8 rounded-3xl glass-ios border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.01)] hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-text tracking-tight">Untuk Mahasiswa</h3>
              </div>
              <ul className="space-y-3.5">
                {[
                  'Mengakses seluruh informasi beasiswa dalam satu tempat',
                  'Menyaring beasiswa berdasarkan kategori dan penyedia',
                  'Melihat persyaratan detail dan batas waktu',
                  'Tautan langsung ke halaman pendaftaran resmi',
                  'Tetap mendapatkan info mutakhir peluang beasiswa baru',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* For University */}
            <div className="p-6 sm:p-8 rounded-3xl glass-ios border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.01)] hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-50">
                  <School className="h-5 w-5 text-secondary-dark" />
                </div>
                <h3 className="text-lg font-bold text-text tracking-tight">Untuk Universitas</h3>
              </div>
              <ul className="space-y-3.5">
                {[
                  'Pengelolaan data beasiswa secara terpusat',
                  'Distribusi informasi yang efisien kepada mahasiswa',
                  'Meningkatnya partisipasi mahasiswa dalam program beasiswa',
                  'Pelacakan peluang beasiswa yang tersedia dengan lebih baik',
                  'Citra universitas yang profesional dan modern',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
