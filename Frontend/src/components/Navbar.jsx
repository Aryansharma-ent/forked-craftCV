import React, { useState } from 'react'
import { Link, useLocation } from "react-router"
import { cn } from "@/lib/utils"
import { Menu, X } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav className='flex justify-between items-center bg-black text-white h-15 px-8 border-b border-white/10 relative z-50'>
        <div className='flex items-center'>
          <Link to='/' className='text-xl elsie-black tracking-tight hover:text-white/80 transition-colors'>
            CraftCV
          </Link>
        </div>

        <div className='hidden md:flex gap-2'>
          <NavigationMenu>
            <NavigationMenuList>

              <NavigationMenuItem>
                <NavigationMenuTrigger className='bg-transparent text-white hover:bg-white/5 data-[state=open]:bg-white/5'>
                  Templates
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className='flex flex-col gap-2 p-4 w-52 bg-black text-white text-sm border border-white/10 rounded-xl'>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to='/templates?cat=engineering' className='block px-3 py-2 rounded-lg hover:bg-white/5 transition-colors'>
                          Engineering
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to='/templates?cat=design' className='block px-3 py-2 rounded-lg hover:bg-white/5 transition-colors'>
                          Design &amp; Creative
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to='/templates?cat=business' className='block px-3 py-2 rounded-lg hover:bg-white/5 transition-colors'>
                          Business &amp; Finance
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to='/templates?cat=graduate' className='block px-3 py-2 rounded-lg hover:bg-white/5 transition-colors'>
                          Fresh Graduate
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to='/pricing'
                    className={cn(
                      'px-4 py-2 text-sm transition-colors rounded-md',
                      isActive('/pricing') ? 'text-white' : 'text-white/70 hover:text-white'
                    )}
                  >
                    Pricing
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className='hidden md:flex gap-4 items-center'>
          <Link to='/login' className='text-sm text-white/70 hover:text-white transition-colors cursor-pointer'>
            Login
          </Link>
          <Link
            to='/signup'
            className='text-sm text-black bg-white px-5 py-2.5 rounded-3xl cursor-pointer hover:bg-white/90 transition-colors font-medium'
          >
            Sign Up
          </Link>
        </div>

        <button
          id='mobile-menu-toggle'
          className='md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors'
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label='Toggle mobile menu'
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className='md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm' onClick={() => setMobileOpen(false)}>
          <div
            className='absolute top-15 left-0 right-0 bg-black border-b border-white/10 px-6 py-6 flex flex-col gap-4'
            onClick={(e) => e.stopPropagation()}
          >
            <p className='text-xs uppercase tracking-widest text-white/30 mb-1'>Templates</p>
            {['Engineering', 'Design & Creative', 'Business & Finance', 'Fresh Graduate'].map((cat) => (
              <Link
                key={cat}
                to={`/templates?cat=${cat.toLowerCase().replace(/ & | /g, '-')}`}
                className='text-sm text-white/60 hover:text-white transition-colors pl-2'
                onClick={() => setMobileOpen(false)}
              >
                {cat}
              </Link>
            ))}
            <div className='border-t border-white/10 my-1' />
            <Link
              to='/pricing'
              className='text-sm text-white/70 hover:text-white transition-colors'
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>
            <div className='border-t border-white/10 my-1' />
            <Link
              to='/login'
              className='text-sm text-white/70 hover:text-white transition-colors'
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
            <Link
              to='/signup'
              className='text-sm text-black bg-white px-5 py-3 rounded-3xl text-center font-medium hover:bg-white/90 transition-colors'
              onClick={() => setMobileOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
