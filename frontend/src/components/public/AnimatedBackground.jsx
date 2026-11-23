// Clean campus background with subtle neutral gradient
export default function AnimatedBackground({ variant = 'public' }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      {/* Base Neutral Light Surface */}
      <div className="absolute inset-0 bg-slate-50" />

      {/* Soft Ambient Header Glow (POLINELA Purple tint) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-100/40 via-indigo-50/20 to-transparent blur-3xl opacity-60" />

      {/* Subtle Static Dot Pattern */}
      <div className="absolute inset-0 dot-pattern opacity-15" />
    </div>
  );
}
