import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    navigate('/')
    setLoading(false)
  }

  return (
    <div className="screen-center">
      <div className="card auth-card">
        <h1>Iniciar sesión</h1>
        <p className="muted">Accede para gestionar tus tareas</p>

        <form onSubmit={handleSubmit} className="form">
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="tuemail@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className="error">{errorMsg}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="switch-auth">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}