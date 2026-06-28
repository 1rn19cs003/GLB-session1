import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import './Dashboard.css';

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [myProjects, setMyProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', techStack: '', githubUrl: '', liveUrl: '' });
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', skills: user?.skills?.join(', ') || '', bio: user?.bio || '', github: user?.github || '' });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('projects');

  useEffect(() => {
    api.get('/projects').then(r => setMyProjects(r.data.filter(p => p.ownerId === user._id)));
  }, [user._id]);

  function handleFormChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function openCreate() {
    setEditingProject(null);
    setForm({ title: '', description: '', techStack: '', githubUrl: '', liveUrl: '' });
    setShowForm(true);
  }

  function openEdit(project) {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(', '),
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
    });
    setShowForm(true);
  }

  async function handleProjectSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean) };
    try {
      if (editingProject) {
        const res = await api.put(`/projects/${editingProject._id}`, payload);
        setMyProjects(prev => prev.map(p => p._id === editingProject._id ? res.data : p));
      } else {
        const res = await api.post('/projects', payload);
        setMyProjects(prev => [...prev, res.data]);
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    setMyProjects(prev => prev.filter(p => p._id !== id));
  }

  async function handleProfileSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/profile', {
        ...profileForm,
        skills: profileForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      setUser(res.data);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user.name}</h1>
            <p className="page-sub">Manage your projects and profile</p>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button className={`tab ${tab === 'projects' ? 'active' : ''}`} onClick={() => setTab('projects')}>
            My Projects ({myProjects.length})
          </button>
          <button className={`tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
            Edit Profile
          </button>
        </div>

        {tab === 'projects' && (
          <div>
            <div className="flex-between mb-3">
              <h2 className="section-title">Projects</h2>
              <Button onClick={openCreate}>+ New Project</Button>
            </div>

            {showForm && (
              <div className="project-form-card mb-3">
                <h3>{editingProject ? 'Edit Project' : 'Create Project'}</h3>
                <form onSubmit={handleProjectSubmit} className="project-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Title *</label>
                      <input name="title" value={form.title} onChange={handleFormChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea name="description" value={form.description} onChange={handleFormChange} rows={3} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Tech Stack (comma separated)</label>
                      <input name="techStack" value={form.techStack} onChange={handleFormChange} placeholder="React, Node.js" />
                    </div>
                  </div>
                  <div className="form-row form-2col">
                    <div className="form-group">
                      <label>GitHub URL</label>
                      <input name="githubUrl" value={form.githubUrl} onChange={handleFormChange} />
                    </div>
                    <div className="form-group">
                      <label>Live URL</label>
                      <input name="liveUrl" value={form.liveUrl} onChange={handleFormChange} />
                    </div>
                  </div>
                  <div className="form-actions">
                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                    <Button type="submit" loading={saving}>{editingProject ? 'Update' : 'Create'}</Button>
                  </div>
                </form>
              </div>
            )}

            {myProjects.length === 0 ? (
              <div className="empty-state">
                <h3>No projects yet</h3>
                <p>Create your first project to showcase your work</p>
              </div>
            ) : (
              <div className="project-list">
                {myProjects.map(p => (
                  <div key={p._id} className="project-row">
                    <div className="project-row-info">
                      <h4><Link to={`/projects/${p._id}`}>{p.title}</Link></h4>
                      <p>{p.description}</p>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {p.techStack.map(t => <span key={t} className="badge">{t}</span>)}
                      </div>
                    </div>
                    <div className="project-row-actions">
                      <Button variant="secondary" size="sm" onClick={() => openEdit(p)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(p._id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'profile' && (
          <div className="profile-edit-card">
            <h2 className="section-title mb-3">Edit Profile</h2>
            <form onSubmit={handleProfileSave} className="project-form">
              <div className="form-group">
                <label>Full Name</label>
                <input value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input value={profileForm.skills} onChange={e => setProfileForm(f => ({ ...f, skills: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))} rows={3} />
              </div>
              <div className="form-group">
                <label>GitHub URL</label>
                <input value={profileForm.github} onChange={e => setProfileForm(f => ({ ...f, github: e.target.value }))} />
              </div>
              <div className="form-actions">
                <Button type="submit" loading={saving}>Save Changes</Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}