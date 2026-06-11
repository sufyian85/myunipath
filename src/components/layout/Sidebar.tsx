import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Target, Compass, Info, User, Award, LogOut, LogIn, ExternalLink, Menu, X } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Sidebar({ isOpen, setIsOpen, isDesktopCollapsed, setIsDesktopCollapsed }: { isOpen: boolean; setIsOpen: (val: boolean) => void; isDesktopCollapsed: boolean; setIsDesktopCollapsed: (val: boolean) => void; }) {
  const { isLoggedIn, logout } = useStudent();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate('/');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
      isActive 
        ? 'bg-white/10 text-white shadow-sm' 
        : 'text-white/70 hover:bg-white/5 hover:text-white'
    }`;

  const sidebarContent = (
    <div className={`flex flex-col h-full bg-[#0F3361] text-white border-r border-white/10 shadow-2xl transition-all duration-300 ${isDesktopCollapsed ? 'w-[80px]' : 'w-[280px]'}`}>
      <div className={`p-6 flex items-center ${isDesktopCollapsed ? 'justify-center' : 'justify-between'} border-b border-white/10 h-[80px]`}>
        <div className="flex items-center gap-2 overflow-hidden">
          <img src="/myunipath-emblem.svg" alt="MyUniPath" className="w-8 h-8 min-w-[32px] object-contain brightness-0 invert" />
          {!isDesktopCollapsed && <span className="text-xl font-extrabold tracking-tight whitespace-nowrap">MyUniPath</span>}
        </div>
        {!isDesktopCollapsed ? (
          <>
            <button className="md:hidden p-1 text-white/70 hover:text-white transition-colors" onClick={closeSidebar}>
              <X className="w-6 h-6" />
            </button>
            <button className="hidden md:block p-1 text-white/70 hover:text-white transition-colors" onClick={() => setIsDesktopCollapsed(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </>
        ) : (
          <button className="hidden md:block p-1 text-white/70 hover:text-white transition-colors absolute" onClick={() => setIsDesktopCollapsed(false)}>
            <Menu className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2 overflow-x-hidden">
        {!isDesktopCollapsed && <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 px-3 whitespace-nowrap">Main Navigation</div>}
        <NavLink to="/" onClick={closeSidebar} className={navItemClass}>
          <Home className="w-5 h-5 min-w-[20px]" />
          {!isDesktopCollapsed && <span>Home</span>}
        </NavLink>
        <NavLink to="/quiz" onClick={closeSidebar} className={navItemClass}>
          <Target className="w-5 h-5 min-w-[20px]" />
          {!isDesktopCollapsed && <span>{isLoggedIn ? 'Retake Quiz' : 'Take Quiz'}</span>}
        </NavLink>
        <NavLink to="/programs" onClick={closeSidebar} className={navItemClass}>
          <Compass className="w-5 h-5 min-w-[20px]" />
          {!isDesktopCollapsed && <span>Browse Programs</span>}
        </NavLink>
        <NavLink to="/about" onClick={closeSidebar} className={navItemClass}>
          <Info className="w-5 h-5 min-w-[20px]" />
          {!isDesktopCollapsed && <span>About MyUniPath</span>}
        </NavLink>

        {!isDesktopCollapsed && <div className="mt-8 mb-2 px-3 text-xs font-bold text-white/40 uppercase tracking-widest whitespace-nowrap">Account</div>}
        
        {isLoggedIn ? (
          <>
            <NavLink to="/profile" onClick={closeSidebar} className={navItemClass}>
              <User className="w-5 h-5 min-w-[20px]" />
              {!isDesktopCollapsed && <span>View Profile</span>}
            </NavLink>
            <NavLink to="/results" onClick={closeSidebar} className={navItemClass}>
              <Award className="w-5 h-5 min-w-[20px]" />
              {!isDesktopCollapsed && <span>View Last Result</span>}
            </NavLink>
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-white/70 hover:bg-destructive/20 hover:text-destructive-foreground transition-all text-left w-full mt-2 overflow-hidden">
              <LogOut className="w-5 h-5 min-w-[20px]" />
              {!isDesktopCollapsed && <span>Log Out</span>}
            </button>
          </>
        ) : (
          <NavLink to="/login" onClick={closeSidebar} className={`flex items-center ${isDesktopCollapsed ? 'justify-center' : 'justify-start'} gap-2 px-3 py-3 mt-2 rounded-xl font-bold bg-[#e34628] hover:bg-[#e34628]/90 text-white transition-all shadow-md overflow-hidden`}>
            <LogIn className="w-5 h-5 min-w-[20px]" />
            {!isDesktopCollapsed && <span className="whitespace-nowrap">Sign In</span>}
          </NavLink>
        )}
      </div>

      {/* Institutional logos — bottom of sidebar */}
      <div className="p-4 border-t border-white/10 bg-black/20 overflow-hidden">
        {!isDesktopCollapsed ? (
          <div className="flex flex-col gap-3">
            {/* Logo row */}
            <div className="flex items-center justify-center gap-4 py-1">
              <img
                src="/cci-logo.png"
                alt="CCI"
                className="h-8 object-contain opacity-90 brightness-0 invert"
              />
              <div className="w-px h-6 bg-white/20" />
              <img
                src="/uniten-logo.png"
                alt="UNITEN"
                className="h-8 object-contain opacity-90 brightness-0 invert"
              />
            </div>
            {/* Visit UNITEN link */}
            <a
              href="https://www.uniten.edu.my/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium text-white/50 hover:bg-white/5 hover:text-white/80 transition-all text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Visit UNITEN</span>
            </a>
          </div>
        ) : (
          <a
            href="https://www.uniten.edu.my/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-2 py-3 rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-all"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Toggle (Fixed Bottom Left) */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed bottom-6 left-6 z-[60] bg-[#0F3361] p-3.5 rounded-full text-white shadow-xl hover:scale-105 active:scale-95 transition-all border border-white/20"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop + Mobile Sidebar panel */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {sidebarContent}
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={toggleSidebar} />
      )}
    </>
  );
}
