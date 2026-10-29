import React from 'react'
import { Link } from 'react-router'

const Footer = () => {
  return (
    <footer className='bg-black text-white border-t border-white/10'>
      <div className='max-w-7xl mx-auto px-8 py-16'>

        {/* Top row — brand + nav columns */}
        <div className='flex flex-col md:flex-row justify-between gap-12'>

          {/* Brand */}
          <div className='max-w-xs'>
            <p className='text-2xl elsie-black tracking-tight'>CraftCV</p>
            <p className='mt-3 text-white/50 text-sm leading-relaxed'>
              Build professional, ATS-friendly resumes in minutes. Designed for every career path.
            </p>
          </div>

          {/* Nav columns */}
          <div className='flex gap-16 flex-wrap'>
            <div>
              <p className='text-xs uppercase tracking-widest text-white/30 mb-4'>Product</p>
              <ul className='space-y-3 text-sm text-white/60'>
                <li><Link to='/' className='hover:text-white transition-colors'>Home</Link></li>
                <li><Link to='/templates' className='hover:text-white transition-colors'>Templates</Link></li>
                <li><Link to='/interview' className='hover:text-white transition-colors'>Interview Prep</Link></li>
                <li><Link to='/builder' className='hover:text-white transition-colors'>Resume Builder</Link></li>
              </ul>
            </div>

            <div>
              <p className='text-xs uppercase tracking-widest text-white/30 mb-4'>Templates</p>
              <ul className='space-y-3 text-sm text-white/60'>
                <li><Link to='/builder?template=apex' className='hover:text-white transition-colors'>Apex</Link></li>
                <li><Link to='/builder?template=nova' className='hover:text-white transition-colors'>Nova</Link></li>
                <li><Link to='/builder?template=slate' className='hover:text-white transition-colors'>Slate</Link></li>
                <li><Link to='/builder?template=minimal' className='hover:text-white transition-colors'>Minimal</Link></li>
              </ul>
            </div>

            <div>
              <p className='text-xs uppercase tracking-widest text-white/30 mb-4'>Account</p>
              <ul className='space-y-3 text-sm text-white/60'>
                <li><Link to='/login' className='hover:text-white transition-colors'>Login</Link></li>
                <li><Link to='/signup' className='hover:text-white transition-colors'>Sign Up</Link></li>
                <li><Link to='/dashboard' className='hover:text-white transition-colors'>Dashboard</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom row — copyright */}
        <div className='mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-white/30 text-sm'>© {new Date().getFullYear()} CraftCV. All rights reserved.</p>
          <div className='flex gap-6 text-sm text-white/30'>
            <span>Crafted for job seekers & students</span>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
