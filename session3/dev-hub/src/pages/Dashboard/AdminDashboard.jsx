import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/Button/Button';
import './Dashboard.css';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/users'), api.get('/projects')])
      .then(([uRes, pRes]) => {
        setUsers(uRes.data);
        setProjects(pRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleBlock(userId, isBlocked) {
    const endpoint = isBlocked ? `/users/${userId}/unblock` : `/users/${userId}/block`;
    await api.put(endpoint);
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: !isBlocked } : u));
  }

  async function handleDeleteUser(userId) {
    if (!window.confirm('Delete this user and all their projects?')) return;
    await api.delete(`/users/${userId}`);
    setUsers(prev => prev.filter(u => u._id !== userId));
    setProjects(prev => prev.filter(p => p.ownerId !== userId));
  }

  async function handleDeleteProject(projectId) {
    if (!window.confirm('Delete this project?')) return;
    await api.delete(`/projects/${projectId}`);
    setProjects(prev => prev.filter(p => p._id !== projectId));
  }

  const stats = {
    total: users.length,
    developers: users.filter(u => u.role === 'developer').length,
    blocked: users.filter(u => u.isBlocked).length,
    projects: projects.length,
  };

  if (loading) return <div className="loading">Loading admin panel...</div>;

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="page-sub">Manage users and content</p>
          </div>
        </div>

        <div className="stats-grid mb-3">
          <div className="stat-card"><div className="stat-num">{stats.total}</div><div className="stat-label">Total Users</div></div>
          <div className="stat-card"><div className="stat-num">{stats.developers}</div><div className="stat-label">Developers</div></div>
          <div className="stat-card"><div className="stat-num">{stats.blocked}</div><div className="stat-label">Blocked</div></div>
          <div className="stat-card"><div className="stat-num">{stats.projects}</div><div className="stat-label">Projects</div></div>
        </div>

        <div className="dashboard-tabs">
          <button className={`tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
            Users ({users.length})
          </button>
          <button className={`tab ${tab === 'projects' ? 'active' : ''}`} onClick={() => setTab('projects')}>
            Projects ({projects.length})
          </button>
        </div>

        {tab === 'users' && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-green'}`}>{u.role}</span></td>
                    <td>
                      {u.isBlocked
                        ? <span className="badge badge-red">Blocked</span>
                        : <span className="badge badge-green">Active</span>}
                    </td>
                    <td>
                      {u.role !== 'admin' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant={u.isBlocked ? 'success' : 'secondary'}
                            onClick={() => handleBlock(u._id, u.isBlocked)}
                          >
                            {u.isBlocked ? 'Unblock' : 'Block'}
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleDeleteUser(u._id)}>Delete</Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'projects' && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Owner</th>
                  <th>Tech</th>
                  <th>Likes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p._id}>
                    <td>{p.title}</td>
                    <td>{p.ownerName}</td>
                    <td>{p.techStack.slice(0, 2).join(', ')}</td>
                    <td>{p.likes.length}</td>
                    <td>
                      <Button size="sm" variant="danger" onClick={() => handleDeleteProject(p._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
