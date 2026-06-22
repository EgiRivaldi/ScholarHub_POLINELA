import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CursorFollower from '@/components/public/CursorFollower';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      <CursorFollower />
      <Navbar />
      <main className="flex-1 pt-16 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

