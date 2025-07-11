import { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request';
import TaskList from './components/TaskList';
import './App.css';

const endpoint = 'http://localhost:5000/graphql';

const GET_TASKS = gql`
  query {
    tasks {
      id
      title
      description
      completed
      dueDate
      priority
      createdAt
    }
    taskStats {
      total
      completed
      active
    }
  }
`;

const ADD_TASK = gql`
  mutation($title: String!, $description: String, $dueDate: String, $priority: String) {
    addTask(title: $title, description: $description, dueDate: $dueDate, priority: $priority) {
      id title description completed dueDate priority createdAt
    }
  }
`;

const UPDATE_TASK = gql`
  mutation($id: ID!, $title: String, $description: String, $dueDate: String, $priority: String) {
    updateTask(id: $id, title: $title, description: $description, dueDate: $dueDate, priority: $priority) {
      id title description completed dueDate priority createdAt
    }
  }
`;

const DELETE_TASK = gql`
  mutation($id: ID!) {
    deleteTask(id: $id) { id }
  }
`;

const TOGGLE_TASK = gql`
  mutation($id: ID!) {
    toggleTaskComplete(id: $id) { id completed }
  }
`;

const CLEAR_COMPLETED = gql`
  mutation { clearCompleted }
`;

const priorities = ['Low', 'Medium', 'High'];

function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0 });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchTasks = () => {
    setLoading(true);
    request(endpoint, GET_TASKS)
      .then(data => {
        setTasks(data.tasks);
        setStats(data.taskStats);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch tasks.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = () => {
    if (!title.trim()) return;
    setLoading(true);
    request(endpoint, ADD_TASK, { title, description, dueDate: dueDate || null, priority })
      .then(data => {
        setTasks(prev => [data.addTask, ...prev]);
        setTitle(''); setDescription(''); setDueDate(''); setPriority('Low');
        setLoading(false);
        fetchTasks();
      }).catch(() => setError('Add failed.'));
  };

  const handleDelete = (id) => {
    setShowConfirm(false);
    setLoading(true);
    request(endpoint, DELETE_TASK, { id }).then(() => {
      setTasks(prev => prev.filter(task => task.id !== id));
      setLoading(false);
      fetchTasks();
    }).catch(() => setError('Delete failed.'));
  };

  const startEdit = (task) => {
    setEditingTask(task.id);
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(task.dueDate ? task.dueDate.substring(0, 10) : '');
    setPriority(task.priority || 'Low');
  };

  const handleUpdate = () => {
    setLoading(true);
    request(endpoint, UPDATE_TASK, { id: editingTask, title, description, dueDate: dueDate || null, priority })
      .then(data => {
        setTasks(prev => prev.map(task => (task.id === data.updateTask.id ? data.updateTask : task)));
        setEditingTask(null); setTitle(''); setDescription(''); setDueDate(''); setPriority('Low');
        setLoading(false);
        fetchTasks();
      }).catch(() => setError('Update failed.'));
  };

  const cancelEdit = () => {
    setEditingTask(null); setTitle(''); setDescription(''); setDueDate(''); setPriority('Low');
  };

  const handleToggle = (id) => {
    setLoading(true);
    request(endpoint, TOGGLE_TASK, { id })
      .then(() => {
        fetchTasks();
      }).catch(() => setError('Toggle failed.'));
  };

  const handleClearCompleted = () => {
    setLoading(true);
    request(endpoint, CLEAR_COMPLETED)
      .then(() => fetchTasks())
      .catch(() => setError('Failed to clear completed.'));
  };

  // Filtering
  const filteredTasks = tasks.filter(task =>
    filter === 'all' ? true
      : filter === 'active' ? !task.completed
      : task.completed
  );

  return (
    <div className="main-bg">
      <div className="container-card">
        <h1>Task Manager</h1>
        {/* Statistics */}
        <div className="task-stats">
          <span>Total: <strong>{stats.total}</strong></span>
          <span>Active: <strong>{stats.active}</strong></span>
          <span>Completed: <strong>{stats.completed}</strong></span>
        </div>

        {/* Add/Edit Form */}
        <div className="form-row">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="form-row">
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            style={{ maxWidth: 140 }}
          />
          <select value={priority} onChange={e => setPriority(e.target.value)} style={{ maxWidth: 120 }}>
            {priorities.map(p => <option key={p}>{p}</option>)}
          </select>
          {editingTask ? (
            <>
              <button className="btn-primary" onClick={handleUpdate}>Update</button>
              <button className="btn-cancel" onClick={cancelEdit}>Cancel</button>
            </>
          ) : (
            <button className="btn-primary" onClick={handleAdd}>Add</button>
          )}
        </div>
        {/* Filters */}
        <div className="filters">
          <button className={filter === 'all' ? "active" : ""} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'active' ? "active" : ""} onClick={() => setFilter('active')}>Active</button>
          <button className={filter === 'completed' ? "active" : ""} onClick={() => setFilter('completed')}>Completed</button>
          <button className="btn-secondary" onClick={handleClearCompleted} style={{ marginLeft: 'auto' }}>Clear Completed</button>
        </div>

        {/* Loading/Error/Empty State */}
        {loading && <div className="loading">Loading…</div>}
        {error && <div className="error">{error}</div>}
        {!filteredTasks.length && !loading && (
          <div className="no-tasks">🎉 No tasks yet. Add your first one!</div>
        )}

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onDelete={(id) => { setShowConfirm(true); setDeleteId(id); }}
          onEdit={startEdit}
          onToggle={handleToggle}
        />

        {/* Confirm Delete Modal */}
        {showConfirm &&
          <div className="modal-bg">
            <div className="modal">
              <div>Are you sure you want to delete this task?</div>
              <div style={{ marginTop: 14, textAlign: "right" }}>
                <button className="btn-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
                <button className="btn-danger" onClick={() => { handleDelete(deleteId); }}>Delete</button>
              </div>
            </div>
          </div>
        }

        {/* Footer */}
        <footer className="footer">
          Built by <a href="https://github.com/" target="_blank" rel="noopener noreferrer">Swastik Pathak</a> &middot; React, MongoDB, GraphQL
        </footer>
      </div>
    </div>
  );
}

export default App;
