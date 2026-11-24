// Clean campus background with neutral white/slate surface
export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      <div className="absolute inset-0 bg-slate-50" />
    </div>
  );
}
