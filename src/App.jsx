import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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