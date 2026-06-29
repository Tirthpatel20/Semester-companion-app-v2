'use client'

import { Menu, LogOut } from 'lucide-react'
import { useState } from 'react'

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <span className="text-lg font-semibold text-foreground hidden sm:inline">Semester</span>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full" />
              <span className="text-sm text-muted-foreground hidden sm:inline">Alex Student</span>
            </div>
            <Menu className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 glass-card rounded-lg py-2 z-10">
              <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-white/5 transition-colors flex items-center gap-2">
                <span>Profile</span>
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-white/5 transition-colors flex items-center gap-2">
                <span>Settings</span>
              </button>
              <div className="h-px bg-border my-1" />
              <button className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-white/5 transition-colors flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
