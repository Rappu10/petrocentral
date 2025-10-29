import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { FaCalculator, FaStore, FaUsersCog } from 'react-icons/fa'

type AppItem = {
  id: string
  name: string
  description: string
  icon: ReactNode
  url: string
}

type Particle = {
  id: number
  x: number
  y: number
  size: number
  delay: number
  speed: number
}

const apps: AppItem[] = [
  {
    id: 'estimador',
    name: 'Estimador',
    description: 'Calcula costos y metros cuadrados con precisión Synapse.',
    icon: <FaCalculator className="text-4xl text-[#DC143C]" />,
    url: 'https://area-estimator-web.vercel.app',
  },
  {
    id: 'nominas',
    name: 'Nóminas',
    description: 'Administra préstamos, pagos y personal fácilmente.',
    icon: <FaUsersCog className="text-4xl text-[#DC143C]" />,
    url: 'https://nominas-petroarte.vercel.app',
  },
  {
    id: 'tienda',
    name: 'PetroShop',
    description:
      'Explora y vende productos de PetroArte.',
    icon: <FaStore className="text-4xl text-[#DC143C]" />,
    url: 'https://petroshop-six.vercel.app',
  },
]

export default function App() {
  const [selected, setSelected] = useState<AppItem | null>(null)
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const temp: Particle[] = Array.from({ length: 45 }, (_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1.5 + Math.random() * 3,
      delay: Math.random() * 5,
      speed: 8 + Math.random() * 5,
    }))
    setParticles(temp)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center overflow-hidden">
      {/* Fondo carmesí */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4A0B15] via-black to-[#A10F2D] opacity-30 blur-3xl"></div>

      {/* ✨ Partículas */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size * 2,
              height: particle.size * 2,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              background:
                'radial-gradient(circle, rgba(220,20,60,0.55) 0%, rgba(220,20,60,0.08) 80%)',
              boxShadow: '0 0 14px rgba(220,20,60,0.45)',
              filter: 'blur(0.5px)',
            }}
            animate={{
              y: ['0%', '-20%', '0%'],
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: particle.speed,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold z-10 mb-10 text-[#DC143C] drop-shadow-[0_0_18px_rgba(220,20,60,0.45)]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: [1, 0.35, 1], scale: [1, 1.08, 1], y: 0 }}
        transition={{
          opacity: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 0.6 },
        }}
      >
        PetroArte Central
      </motion.h1>

      {/* Contenido dinámico */}
      {selected ? (
        <motion.div
          className="relative w-[95%] h-[80vh] bg-black/70 rounded-2xl overflow-hidden backdrop-blur-md border border-[#A10F2D] shadow-[0_0_25px_rgba(220,20,60,0.3)] z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <iframe
            src={selected.url}
            title={selected.name}
            className="w-full h-full border-none"
          />
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 bg-[#DC143C] hover:bg-[#A10F2D] text-white px-4 py-2 rounded-xl shadow-md transition-all"
          >
            Volver
          </button>
        </motion.div>
      ) : (
        <>
          {/* Tarjetas de apps */}
          <motion.div
            className="flex flex-wrap gap-10 justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {apps.map((app) => (
              <motion.div
                key={app.id}
                whileHover={{ scale: 1.06, rotate: 0.5 }}
                className="bg-white/5 border border-[#A10F2D] rounded-2xl p-8 w-72 cursor-pointer backdrop-blur-md shadow-lg hover:shadow-[0_0_18px_rgba(220,20,60,0.4)] transition-all hover:bg-[#2A0A11]/60"
                onClick={() => setSelected(app)}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  {app.icon}
                  <h2 className="text-2xl font-semibold text-[#DC143C]">
                    {app.name}
                  </h2>
                  <p className="text-gray-300 text-sm">{app.description}</p>
                  <span className="mt-3 px-4 py-2 bg-[#DC143C]/80 rounded-lg text-sm font-medium hover:bg-[#A10F2D] transition-colors">
                    Acceder
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

      <footer className="absolute bottom-4 text-gray-500 text-xs z-10">
        © 2025 Synapse Dev — PetróArte Central v1.2
      </footer>
    </div>
  )
}
