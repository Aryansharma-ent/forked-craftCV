import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Mail, Lock } from 'lucide-react'

export default function Login() {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center relative">
      <Link
        to="/"
        className="elsie-black text-2xl text-white absolute top-6 left-8 hover:text-white/80 transition-colors"
      >
        CraftCV
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 md:p-10 w-full max-w-md mx-4"
      >
        <h1 className="elsie-black text-4xl text-white leading-tight">Welcome back.</h1>
        <p className="text-white/50 text-sm mt-2">Sign in to continue building your career.</p>

        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 mt-8">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-xs font-medium tracking-wide">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={15} />
              <input
                type="email"
                placeholder="you@example.com"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 w-full text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-sm transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-xs font-medium tracking-wide">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={15} />
              <input
                type="password"
                placeholder="••••••••"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 w-full text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-sm transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end -mt-1">
            <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-2xl font-medium hover:bg-white/90 transition-colors mt-2 text-sm"
          >
            Sign In
          </button>
        </form>

        <p className="text-white/40 text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
