import { useState, useEffect, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const shouldShowSidebar = isSidebarOpen || windowWidth >= 768;

  const handleSidebarNavigate = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex max-h-screen sm:min-h-[100dvh]">
      {/* Botão de menu mobile */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-zinc-800 rounded-lg text-white shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      <Transition
        as={Fragment}
        show={shouldShowSidebar}
        enter="transform transition duration-300 ease-in-out"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transform transition duration-300 ease-in-out"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <div className="fixed md:static z-40 w-[300px] h-screen">
          <Sidebar onNavigate={handleSidebarNavigate} />
        </div>
      </Transition>

      <Transition
        as={Fragment}
        show={isSidebarOpen}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      </Transition>

      <main className="flex-1 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}