import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Utensils } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <header className="absolute top-0 w-full p-6 z-10 flex justify-between items-center backdrop-blur-sm bg-black/10">
                <div className="flex items-center gap-2">
                    <Utensils className="w-8 h-8 text-white" />
                    <h1 className="text-xl font-bold tracking-tight text-white uppercase">The Bridge</h1>
                </div>
                <Link to="/menu" className="relative font-medium text-white px-6 py-2 rounded-full overflow-hidden group transition-all">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-400/20 via-pink-500/20 to-indigo-500/20 rounded-full blur-md group-hover:blur-lg transition-all"></span>
                    <span className="absolute inset-0 w-full h-full border border-white/20 rounded-full group-hover:border-white/50 transition-colors"></span>
                    <span className="relative flex items-center gap-2">View Menu <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                </Link>
            </header>

            <main className="flex-1 flex flex-col">
                {/* Hero Section */}
                <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
                    <img 
                        src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop" 
                        alt="Restaurant Ambience" 
                        className="absolute inset-0 w-full h-full object-cover scale-105 transform translate-z-0"
                    />
                    <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px] z-[1]"></div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-10 text-center px-4 max-w-4xl"
                    >
                        <h2 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 leading-tight text-balance">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-white to-orange-100 drop-shadow-lg">
                                Elevating 
                            </span>
                            <br />
                            <span className="text-white drop-shadow-2xl">Your Experience</span>
                        </h2>
                        <p className="text-lg md:text-2xl text-slate-100 mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
                            Discover exquisite local and continental delicacies crafted with passion at The Bridge Hotel.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link 
                                    to="/menu" 
                                    className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-white/10 backdrop-blur-lg border border-white/30 rounded-full hover:bg-white hover:text-slate-900 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
                                >
                                    {/* Animated background glow */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-white/20 to-orange-400/0 w-[200%] -translate-x-full animate-[shimmer_2.5s_infinite] group-hover:opacity-0 transition-opacity"></div>
                                    <span className="relative">Explore the Menu</span>
                                    <ArrowRight className="relative ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                        </div>
                    </motion.div>
                </section>
                
            </main>
        </div>
    );
}
