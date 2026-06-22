import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchBar({ value, onChange, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="py-6 bg-transparent"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-cyan-500/15 rounded-[22px] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center">
              <Search className="absolute left-4.5 h-4.5 w-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search scholarship by name, description, or provider..."
                className="w-full h-12.5 pl-12 pr-5 rounded-[20px] bg-white/5 border border-white/10 text-xs sm:text-sm text-text placeholder:text-text-secondary shadow-[0_4px_24px_rgba(0,0,0,0.01)] backdrop-blur-[8px] focus:shadow-[0_12px_32px_rgba(79,70,229,0.06)] focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all duration-300"
              />
            </div>
          </div>
        </form>
      </div>
    </motion.section>
  );
}
