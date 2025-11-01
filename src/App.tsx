import { motion } from 'framer-motion'

export default function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1527269523583-7d8f1dc0828a?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1.5px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-6 md:px-16">
          <span className="text-3xl font-semibold tracking-widest text-[#E50914]">
            PetroArte Central
          </span>
          <div className="flex items-center gap-4 text-sm font-medium">
            <button className="hidden items-center gap-2 rounded border border-white/30 bg-black/40 px-4 py-2 text-sm hover:border-white/70 transition-colors sm:inline-flex">
              Español
            </button>
            <button className="rounded bg-[#E50914] px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#F6121D]">
              Suscríbete
            </button>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 pb-24 md:px-0">
          <motion.div
            className="w-full max-w-md space-y-6 rounded-md bg-black/75 px-10 py-14 shadow-[0_0_70px_rgba(0,0,0,0.35)] backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Inicia sesión
            </h1>

            <form className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400" htmlFor="email">
                  Email o número de teléfono
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  className="rounded bg-[#333] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-500 focus:bg-[#454545] focus:ring-2 focus:ring-[#E50914]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="rounded bg-[#333] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-500 focus:bg-[#454545] focus:ring-2 focus:ring-[#E50914]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded bg-[#E50914] py-3 text-base font-semibold transition-colors hover:bg-[#F6121D]"
              >
                Entrar
              </button>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border border-transparent bg-[#333] text-[#E50914] focus:ring-[#E50914]"
                  />
                  <span>Recuérdame</span>
                </label>
                <a className="hover:underline" href="#">
                  ¿Necesitas ayuda?
                </a>
              </div>
            </form>

            <div className="h-[1px] bg-white/10" />

            
          </motion.div>
        </main>

        <footer className="bg-black/80 px-6 py-10 text-sm text-gray-500 md:px-24">
          <div className="mb-6">
            ¿Preguntas? Llama al 800-800-888
          </div>
          <div className="grid gap-y-3 text-sm md:grid-cols-4">
            <a className="hover:underline" href="#">
              Preguntas frecuentes
            </a>
            <a className="hover:underline" href="#">
              Centro de ayuda
            </a>
            <a className="hover:underline" href="#">
              Cuenta
            </a>
            <a className="hover:underline" href="#">
              Prensa
            </a>
            <a className="hover:underline" href="#">
              Inversionistas
            </a>
            <a className="hover:underline" href="#">
              Canjear tarjetas de regalo
            </a>
            <a className="hover:underline" href="#">
              Empleo
            </a>
            <a className="hover:underline" href="#">
              Términos de uso
            </a>
            <a className="hover:underline" href="#">
              Privacidad
            </a>
            <a className="hover:underline" href="#">
              Preferencias de cookies
            </a>
            <a className="hover:underline" href="#">
              Información corporativa
            </a>
            <a className="hover:underline" href="#">
              Avisos legales
            </a>
          </div>
          <button className="mt-8 inline-flex items-center gap-2 rounded border border-white/30 bg-black/40 px-4 py-2 text-sm font-medium text-gray-300 hover:border-white/60 transition-colors">
            Español
          </button>
        </footer>
      </div>
    </div>
  )
}
