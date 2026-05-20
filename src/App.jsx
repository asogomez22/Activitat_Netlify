import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase, supabaseConfigError } from './lib/supabase'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />
  return children
}

function GuestRoute({ user, children }) {
  if (user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!supabaseConfigError)

  useEffect(() => {
    if (!supabase) {
      return undefined
    }

    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (!error) {
        setUser(data.user ?? null)
      }

      setLoading(false)
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (supabaseConfigError) {
    return (
      <div className="screen-center">
        <div className="card auth-card">
          <h1>Configuracion incompleta</h1>
          <p className="error">{supabaseConfigError}</p>
          <p className="muted">
            Corrige el archivo <code>.env</code> y reinicia la aplicacion.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="screen-center">
        <div className="card">
          <h2>Cargando...</h2>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute user={user}>
            <Login />
          </GuestRoute>
        }
      />

      <Route
        path="/register"
        element={
          <GuestRoute user={user}>
            <Register />
          </GuestRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute user={user}>
            <Dashboard user={user} />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  )
}
