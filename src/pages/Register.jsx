import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setMessage('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    setMessage('Cuenta creada correctamente.')
    setEmail('')
    setPassword('')
    setLoading(false)
  }

  return (
    <div className="screen-center">
      <div className="card auth-card">
        <h1>Crear cuenta</h1>
        <p className="muted">Registrate para guardar tus tareas</p>

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
            <label>Contrasena</label>
            <input
              type="password"
              placeholder="Minimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
              required
            />
          </div>

          {errorMsg && <p className="error">{errorMsg}</p>}
          {message && <p className="success">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className="switch-auth">
          Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
        </p>
      </div>
    </div>
  )
}
