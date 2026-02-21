import React, { useState} from 'react';
import { Mail, Lock, Users, X, Sparkles} from 'lucide-react';
import { motion, AnimatePresence} from 'framer-motion';
import { useSelector, useDispatch} from 'react-redux';
import { setAuthModal} from '../store/uiSlice';
import axios from 'axios';

export default function AuthModal() {
 const dispatch = useDispatch();
 const authModal = useSelector((state) => state.ui.authModal);
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [name, setName] = useState('');
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError('');
 setLoading(true);

 try {
 const endpoint = authModal.type === 'login' ? '/login' : '/register';
 const payload = authModal.type === 'login'
 ? { email, password}
 : { name, email, password};

 const response = await axios.post(
 `http://localhost:5001/api/auth${endpoint}`,
 payload,
 { timeout: 10000} // 10 second timeout — fail fast instead of hanging
 );

 // Save token and user info persistently
 localStorage.setItem('token', response.data.token);
 localStorage.setItem('user', JSON.stringify(response.data.user));

 // Close modal — no page reload needed
 dispatch(setAuthModal({ isOpen: false, type: 'login'}));

 // Trigger a soft event so App.jsx re-reads the user from localStorage
 window.dispatchEvent(new Event('auth-updated'));

} catch (err) {
 if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
 setError('Server is taking too long. Please try again.');
} else {
 setError(err.response?.data?.message || 'Authentication failed. Please check your details.');
}
} finally {
 setLoading(false);
}
};

 if (!authModal.isOpen) return null;

 return (
 <AnimatePresence>
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 {/* Backdrop */}
 <motion.div
 initial={{ opacity: 0}}
 animate={{ opacity: 1}}
 exit={{ opacity: 0}}
 onClick={() => dispatch(setAuthModal({ isOpen: false, type: 'login'}))}
 className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
 />

 {/* Modal Content */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 10}}
 animate={{ opacity: 1, scale: 1, y: 0}}
 exit={{ opacity: 0, scale: 0.95, y: 10}}
 className="relative w-full max-w-md bg-brand-card backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-brand-border overflow-hidden"
 >
 <button
 onClick={() => dispatch(setAuthModal({ isOpen: false, type: 'login'}))}
 className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
 >
 <X className="w-5 h-5" />
 </button>

 <div className="p-8">
 <div className="flex items-center justify-center gap-2 mb-8">
 <div className="bg-gradient-to-br from-brand-primary to-purple-600 p-2 rounded-xl shadow-sm">
 <Sparkles className="w-5 h-5 text-white" />
 </div>
 <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-800">
 StoryStudio
 </span>
 </div>

 <div className="text-center mb-8">
 <h2 className="text-2xl font-bold text-brand-text mb-2">
 {authModal.type === 'login' ? 'Welcome back' : 'Create an account'}
 </h2>
 <p className="text-slate-500 text-sm">
 {authModal.type === 'login'
 ? 'Enter your credentials to access your studio.'
 : 'Join us and start weaving your imagination.'}
 </p>
 </div>

 {error && (
 <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
 {error}
 </div>
 )}

 <form className="space-y-4" onSubmit={handleSubmit}>
 {authModal.type === 'signup' && (
 <div className="space-y-1">
 <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Full Name</label>
 <div className="relative">
 <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="John Doe"
 className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-border bg-brand-card backdrop-blur-md focus:bg-brand-card focus:border-brand-primary focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
 />
 </div>
 </div>
 )}

 <div className="space-y-1">
 <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email Address</label>
 <div className="relative">
 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="you@example.com"
 className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-border bg-brand-card backdrop-blur-md focus:bg-brand-card focus:border-brand-primary focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
 />
 </div>
 </div>

 <div className="space-y-1">
 <div className="flex items-center justify-between">
 <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</label>
 </div>
 <div className="relative">
 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
 <input
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="••••••••"
 className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-border bg-brand-card backdrop-blur-md focus:bg-brand-card focus:border-brand-primary focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
 />
 </div>
 </div>

 <button
 disabled={loading}
 type="submit"
 className="w-full bg-gradient-to-r from-brand-primary to-purple-600 hover:from-brand-primary hover:to-purple-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-indigo-500/25 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
 >
 {loading ? 'Processing...' : (authModal.type === 'login' ? 'Sign In' : 'Sign Up')}
 </button>
 </form>

 <div className="mt-8 text-center text-sm text-slate-500">
 {authModal.type === 'login' ? (
 <>
 Don't have an account?{' '}
 <button
 onClick={() => dispatch(setAuthModal({ isOpen: true, type: 'signup'}))}
 className="font-semibold text-brand-primary hover:text-brand-primary"
 >
 Sign up
 </button>
 </>
 ) : (
 <>
 Already have an account?{' '}
 <button
 onClick={() => dispatch(setAuthModal({ isOpen: true, type: 'login'}))}
 className="font-semibold text-brand-primary hover:text-brand-primary"
 >
 Sign in
 </button>
 </>
 )}
 </div>
 </div>
 </motion.div>
 </div>
 </AnimatePresence>
 );
}
