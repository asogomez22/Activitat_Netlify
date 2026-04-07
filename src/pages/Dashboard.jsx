import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard({ user }) {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    setErrorMsg('')

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    setTasks(data || [])
    setLoading(false)
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSaving(true)

    if (!title.trim()) {
      setErrorMsg('El título es obligatorio')
      setSaving(false)
      return
    }

    if (editingId) {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: title.trim(),
          description: description.trim()
        })
        .eq('id', editingId)

      if (error) {
        setErrorMsg(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('tasks')
        .insert([
          {
            user_id: user.id,
            title: title.trim(),
            description: description.trim(),
            is_completed: false
          }
        ])

      if (error) {
        setErrorMsg(error.message)
        setSaving(false)
        return
      }
    }

    resetForm()
    await fetchTasks()
    setSaving(false)
  }

  const handleEdit = (task) => {
    setEditingId(task.id)
    setTitle(task.title)
    setDescription(task.description || '')
  }

  const handleToggle = async (task) => {
    setErrorMsg('')

    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: !task.is_completed })
      .eq('id', task.id)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    await fetchTasks()
  }

  const handleDelete = async (taskId) => {
    setErrorMsg('')

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    if (editingId === taskId) {
      resetForm()
    }

    await fetchTasks()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>Mis tareas</h1>
          <p className="muted">Sesión iniciada como {user.email}</p>
        </div>

        <button className="secondary-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <div className="dashboard-grid">
        <section className="card">
          <h2>{editingId ? 'Editar tarea' : 'Nueva tarea'}</h2>

          <form onSubmit={handleSubmit} className="form">
            <div>
              <label>Título</label>
              <input
                type="text"
                placeholder="Ej. Entregar práctica"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Descripción</label>
              <textarea
                rows="4"
                placeholder="Detalles opcionales"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {errorMsg && <p className="error">{errorMsg}</p>}

            <div className="actions">
              <button type="submit" disabled={saving}>
                {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear tarea'}
              </button>

              {editingId && (
                <button type="button" className="secondary-btn" onClick={resetForm}>
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card">
          <h2>Listado</h2>

          {loading ? (
            <p>Cargando tareas...</p>
          ) : tasks.length === 0 ? (
            <p className="muted">Todavía no tienes tareas.</p>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <article
                  key={task.id}
                  className={`task-item ${task.is_completed ? 'completed' : ''}`}
                >
                  <div className="task-content">
                    <h3>{task.title}</h3>
                    <p>{task.description || 'Sin descripción'}</p>
                  </div>

                  <div className="task-actions">
                    <button onClick={() => handleToggle(task)}>
                      {task.is_completed ? 'Desmarcar' : 'Completar'}
                    </button>
                    <button className="secondary-btn" onClick={() => handleEdit(task)}>
                      Editar
                    </button>
                    <button className="danger-btn" onClick={() => handleDelete(task.id)}>
                      Borrar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}