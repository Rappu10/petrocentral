import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { FaCalculator, FaDatabase, FaStore, FaUsersCog } from 'react-icons/fa'

type UserRole = 'admin' | 'user' | 'demo'

type StoredUser = {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
  lastLoginAt?: string
  role: UserRole
}

type AppItem = {
  id: string
  name: string
  description: string
  icon: ReactNode
  url: string
  requiredRole?: UserRole
}

type Particle = {
  id: number
  x: number
  y: number
  size: number
  delay: number
  speed: number
}

type FeedbackState = {
  type: 'error' | 'success'
  message: string
}

const USERS_KEY = 'petro.users'
const SESSION_KEY = 'petro.session'
const DEMO_EMAIL = 'demo@petroart.com'
const DEMO_PASSWORD = 'petro1234'
const ADMIN_EMAILS = new Set<string>(['admin@petroart.com'])
const ADMIN_PASSWORD = 'admin1234'


type PersistedUser = Omit<StoredUser, 'role'> & { role?: UserRole }

const normalizeStoredUser = (user: PersistedUser): StoredUser => {
  const email = user.email.toLowerCase()
  let role: UserRole
  if (user.role) {
    role = user.role
  } else if (email === DEMO_EMAIL) {
    role = 'demo'
  } else if (ADMIN_EMAILS.has(email)) {
    role = 'admin'
  } else {
    role = 'user'
  }

  return {
    ...user,
    role,
  }
}

function useParticles(count: number) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const generated = Array.from({ length: count }, (_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1.5 + Math.random() * 3.5,
      delay: Math.random() * 5,
      speed: 8 + Math.random() * 5,
    }))
    setParticles(generated)
  }, [count])

  return particles
}

const APP_ITEMS: AppItem[] = [
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
    description: 'Explora y vende productos de PetroArte.',
    icon: <FaStore className="text-4xl text-[#DC143C]" />,
    url: 'https://petroshop-six.vercel.app',
  },
  {
    id: 'mongo-admin',
    name: 'Mongo BD',
    description: 'Gestiona la base de datos de PetroArte (solo administradores).',
    icon: <FaDatabase className="text-4xl text-[#DC143C]" />,
    url: 'https://cloud.mongodb.com/',
    requiredRole: 'admin',
  },
]

const safeNow = () => new Date().toISOString()

export default function App() {
  const [users, setUsers] = useState<StoredUser[]>([])
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const loginParticles = useParticles(36)

  const readUsers = () => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(USERS_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw) as PersistedUser[]
      if (!Array.isArray(parsed)) return []
      return parsed.map((user) => normalizeStoredUser(user))
    } catch (error) {
      console.warn('No se pudieron leer usuarios:', error)
      return []
    }
  }

  const writeUsers = (updated: StoredUser[]) => {
    if (typeof window === 'undefined') return true
    try {
      window.localStorage.setItem(USERS_KEY, JSON.stringify(updated))
      return true
    } catch (error) {
      console.warn('No se pudieron guardar usuarios:', error)
      return false
    }
  }

  const persistSession = (userId: string | null) => {
    if (typeof window === 'undefined') return true
    try {
      if (userId) {
        window.localStorage.setItem(SESSION_KEY, userId)
      } else {
        window.localStorage.removeItem(SESSION_KEY)
      }
      return true
    } catch (error) {
      console.warn('No se pudo guardar la sesión', error)
      return false
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    let loaded = readUsers()

    const demoUserIndex = loaded.findIndex(
      (user) => user.email.toLowerCase() === DEMO_EMAIL,
    )

    if (demoUserIndex === -1) {
      const demoUser: StoredUser = {
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `seed-${Date.now()}`,
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        name: 'Cuenta demo',
        createdAt: safeNow(),
        lastLoginAt: safeNow(),
        role: 'demo',
      }
      loaded = [...loaded, demoUser]
      writeUsers(loaded)
    } else if (loaded[demoUserIndex].password !== DEMO_PASSWORD) {
      loaded[demoUserIndex] = {
        ...loaded[demoUserIndex],
        password: DEMO_PASSWORD,
        role: 'demo',
      }
      loaded = loaded.map((user) => normalizeStoredUser(user))
      writeUsers(loaded)
    }

    ADMIN_EMAILS.forEach((adminEmail) => {
      const adminIndex = loaded.findIndex(
        (user) => user.email.toLowerCase() === adminEmail,
      )
      if (adminIndex === -1) {
        const adminUser: StoredUser = {
          id:
            typeof crypto !== 'undefined' && 'randomUUID' in crypto
              ? crypto.randomUUID()
              : `admin-${Date.now()}`,
          email: adminEmail,
          password: ADMIN_PASSWORD,
          name: 'Administrador',
          createdAt: safeNow(),
          lastLoginAt: safeNow(),
          role: 'admin',
        }
        loaded = [...loaded, adminUser]
      } else {
        const current = loaded[adminIndex]
        loaded[adminIndex] = {
          ...current,
          password: ADMIN_PASSWORD,
          role: 'admin',
          name: current.name || 'Administrador',
        }
      }
    })

    loaded = loaded.map((user) => normalizeStoredUser(user))
    writeUsers(loaded)

    setUsers(loaded)

    const storedSession = window.localStorage.getItem(SESSION_KEY)
    if (storedSession) {
      const sessionUser = loaded.find((user) => user.id === storedSession)
      if (sessionUser) {
        setCurrentUser(sessionUser)
      } else {
        persistSession(null)
      }
    }
  }, [])

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setRemember(true)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback(null)

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedPassword = password.trim()
    const trimmedName = name.trim()

    if (!normalizedEmail || !normalizedPassword) {
      setFeedback({
        type: 'error',
        message: 'Completa correo y contraseña para continuar.',
      })
      return
    }

    const allUsers = readUsers()

    if (mode === 'login') {
      const existingUser = allUsers.find(
        (user) => user.email.toLowerCase() === normalizedEmail,
      )
      if (!existingUser || existingUser.password !== normalizedPassword) {
        setFeedback({
          type: 'error',
          message: 'Credenciales incorrectas. Intenta nuevamente.',
        })
        return
      }

      const updatedUser: StoredUser = {
        ...existingUser,
        lastLoginAt: safeNow(),
      }
      const updatedUsers = allUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user,
      )
      writeUsers(updatedUsers)
      persistSession(remember ? updatedUser.id : null)
      setUsers(updatedUsers)
      setCurrentUser(updatedUser)
      resetForm()
      return
    }

    if (!trimmedName) {
      setFeedback({
        type: 'error',
        message: 'Agrega un nombre para crear tu cuenta.',
      })
      return
    }

    if (normalizedPassword.length < 6) {
      setFeedback({
        type: 'error',
        message: 'Tu contraseña debe tener al menos 6 caracteres.',
      })
      return
    }

    const alreadyExists = allUsers.some(
      (user) => user.email.toLowerCase() === normalizedEmail,
    )
    if (alreadyExists) {
      setFeedback({
        type: 'error',
        message: 'Ya existe una cuenta con este correo.',
      })
      return
    }

    const assignedRole = ADMIN_EMAILS.has(normalizedEmail) ? 'admin' : 'user'
    const assignedPassword =
      assignedRole === 'admin' ? ADMIN_PASSWORD : normalizedPassword

    if (assignedPassword.length < 6) {
      setFeedback({
        type: 'error',
        message: 'Tu contraseña debe tener al menos 6 caracteres.',
      })
      return
    }

    const newUser: StoredUser = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `user-${Date.now()}`,
      email: normalizedEmail,
      password: assignedPassword,
      name: trimmedName,
      createdAt: safeNow(),
      lastLoginAt: safeNow(),
      role: assignedRole,
    }

    const updatedUsers = [...allUsers, newUser]
    writeUsers(updatedUsers)
    persistSession(newUser.id)
    setUsers(updatedUsers)
    setCurrentUser(newUser)
    resetForm()
  }

  const handleLogout = () => {
    persistSession(null)
    setCurrentUser(null)
    setMode('login')
    setFeedback(null)
    resetForm()
  }

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'))
    setFeedback(null)
    resetForm()
  }

  const feedbackStyles =
    feedback?.type === 'error'
      ? 'bg-[#E50914]/20 border border-[#E50914]/40 text-[#ffb3b6]'
      : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-200'

  if (currentUser) {
    return (
      <PetroArteCentral user={currentUser} users={users} onLogout={handleLogout} />
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F0F0F] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4A0B15] via-[#070102] to-[#16030B] opacity-95" />
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
      <div className="absolute inset-0 z-0 overflow-hidden">
        {loginParticles.map((particle) => (
          <motion.div
            key={`login-${particle.id}`}
            className="absolute rounded-full"
            style={{
              width: particle.size * 2,
              height: particle.size * 2,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              background:
                'radial-gradient(circle, rgba(220,20,60,0.55) 0%, rgba(220,20,60,0.08) 80%)',
              boxShadow: '0 0 14px rgba(220,20,60,0.45)',
              filter: 'blur(0.6px)',
            }}
            animate={{
              y: ['0%', '-18%', '0%'],
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.18, 1],
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

      <div className="absolute top-6 left-6 z-20 hidden text-xs uppercase tracking-[0.45em] text-[#DC143C]/70 sm:block">
        PetroArte
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <motion.h1
          className="text-4xl font-bold text-[#DC143C] drop-shadow-[0_0_25px_rgba(220,20,60,0.5)] md:text-5xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: [1, 0.45, 1], scale: [1, 1.06, 1], y: 0 }}
          transition={{
            opacity: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 0.6 },
          }}
        >
          PetroArte Central
        </motion.h1>
        <p className="max-w-xl text-sm text-gray-200 md:text-base">
          Accede a tu centro de aplicaciones Petroarte.
        </p>

        <motion.div
          className="w-full max-w-md space-y-6 rounded-3xl border border-[#A10F2D]/50 bg-black/65 px-10 py-14 text-left shadow-[0_30px_60px_rgba(220,20,60,0.18)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-2xl font-semibold text-white">
            {mode === 'login' ? 'Inicia sesión' : 'Crear cuenta'}
          </h2>

          {feedback && (
            <div className={`${feedbackStyles} rounded-2xl px-4 py-3 text-sm`}>
              {feedback.message}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-[0.2em] text-[#FF7A8F]/80">
                  Nombre
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="¿Cómo te llamas?"
                  className="rounded-2xl border border-white/10 bg-[#1A050B]/80 px-5 py-3 text-sm text-white shadow-inner shadow-black/40 transition-all placeholder:text-gray-500 focus:border-[#DC143C] focus:bg-[#2B0A13]/80 focus:ring-2 focus:ring-[#DC143C]"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-[0.2em] text-[#FF7A8F]/80">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@correo.com"
                className="rounded-2xl border border-white/10 bg-[#1A050B]/80 px-5 py-3 text-sm text-white shadow-inner shadow-black/40 transition-all placeholder:text-gray-500 focus:border-[#DC143C] focus:bg-[#2B0A13]/80 focus:ring-2 focus:ring-[#DC143C]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-[0.2em] text-[#FF7A8F]/80">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="rounded-2xl border border-white/10 bg-[#1A050B]/80 px-5 py-3 text-sm text-white shadow-inner shadow-black/40 transition-all placeholder:text-gray-500 focus:border-[#DC143C] focus:bg-[#2B0A13]/80 focus:ring-2 focus:ring-[#DC143C]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-[#DC143C] to-[#A10F2D] py-3 text-base font-semibold shadow-[0_18px_35px_rgba(220,20,60,0.35)] transition-transform duration-200 hover:scale-[1.02] hover:from-[#FF1F55] hover:to-[#C7163B]"
            >
              {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>

            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs text-gray-400">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="h-4 w-4 rounded border border-[#DC143C]/60 bg-[#1A050B] text-[#DC143C] focus:ring-[#DC143C]"
                  />
                  <span>Recuérdame</span>
                </label>
                <span className="cursor-pointer text-[#FF7A8F] hover:underline">
                  ¿Necesitas ayuda?
                </span>
              </div>
            )}
          </form>

          <div className="h-[1px] bg-white/10" />

          <div className="space-y-2 text-sm text-gray-400">
            {mode === 'login' ? (
              <p>
                ¿Primera vez?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-white hover:underline"
                >
                  Crea una cuenta ahora
                </button>
              </p>
            ) : (
              <p>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-white hover:underline"
                >
                  Inicia sesión
                </button>
              </p>
            )}
            
          </div>
        </motion.div>
      </div>

      <footer className="absolute bottom-4 z-10 w-full px-6 text-center text-xs text-gray-500">
        © 2025 Synapse Dev — PetróArte Central v1.2
      </footer>
    </div>
  )
}

type PetroArteCentralProps = {
  user: StoredUser
  users: StoredUser[]
  onLogout: () => void
}

function PetroArteCentral({ user, users, onLogout }: PetroArteCentralProps) {
  const [selected, setSelected] = useState<AppItem | null>(null)
  const particles = useParticles(45)
  const accessibleItems = APP_ITEMS.filter(
    (item) => !item.requiredRole || item.requiredRole === user.role,
  )
  const activeSelection =
    selected && accessibleItems.some((item) => item.id === selected.id)
      ? selected
      : null

  return (
    <div className="relative min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4A0B15] via-black to-[#A10F2D] opacity-30 blur-3xl"></div>

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

      <div className="absolute top-6 right-6 z-20 flex items-center gap-4 text-xs text-gray-300 sm:text-sm">
        <div className="hidden text-right sm:block">
          <p className="font-medium text-white">{user.name}</p>
          <p>{user.email}</p>
        </div>
        <button
          onClick={onLogout}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
        >
          Cerrar sesión
        </button>
      </div>

      <motion.h1
        className="text-4xl md:text-5xl font-bold z-10 mb-6 text-[#DC143C] drop-shadow-[0_0_18px_rgba(220,20,60,0.45)] text-center px-4"
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
      <p className="z-10 mb-10 max-w-2xl text-center text-sm text-gray-300 md:text-base px-6">
        Explora las herramientas de PetroArte desde un solo lugar. Selecciona una
        aplicación para comenzar o vuelve cuando quieras: tus datos viven únicamente
        en este dispositivo.
      </p>

      {activeSelection ? (
        <motion.div
          className="relative w-[97%] max-w-6xl h-[82vh] bg-black/70 rounded-2xl overflow-hidden backdrop-blur-md border border-[#A10F2D] shadow-[0_0_25px_rgba(220,20,60,0.3)] z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <iframe
            src={activeSelection.url}
            title={activeSelection.name}
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
        <motion.div
          className="flex flex-wrap gap-10 justify-center z-10 px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {accessibleItems.map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ scale: 1.06, rotate: 0.5 }}
              className="bg-white/5 border border-[#A10F2D] rounded-2xl p-8 w-72 cursor-pointer backdrop-blur-md shadow-lg hover:shadow-[0_0_18px_rgba(220,20,60,0.4)] transition-all hover:bg-[#2A0A11]/60 flex flex-col items-center text-center gap-4"
              onClick={() => setSelected(app)}
            >
              {app.icon}
              <h3 className="text-2xl font-semibold text-[#DC143C]">
                {app.name}
              </h3>
              <p className="text-gray-300 text-sm">{app.description}</p>
              <span className="mt-3 px-4 py-2 bg-[#DC143C]/80 rounded-lg text-sm font-medium hover:bg-[#A10F2D] transition-colors">
                Acceder
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="mt-10 text-xs text-gray-500 z-10">
        Cuentas locales guardadas en este navegador: {users.length}
      </div>

      <footer className="absolute bottom-4 text-gray-500 text-xs z-10 text-center px-4">
        © 2025 Synapse Dev — PetróArte Central v1.2
      </footer>
    </div>
  )
}
