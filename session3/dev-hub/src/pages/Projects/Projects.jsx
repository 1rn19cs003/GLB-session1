import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import ProjectCard from '../../components/ProjectCard';
import { useAuth } from '../../context/AuthContext';
import '../Developers/Developers.css';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects')
      .then(r => setProjects(r.data))
      .finally(() => setLoading(false));
  }, []);

  async function handleLike(projectId) {
    if (!user) return;
    const res = await api.post(`/projects/${projectId}/like`);
    setProjects(prev => prev.map(p => p._id === projectId ? res.data : p));
  }

  const filtered = projects.filter(p =>
    !search ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.techStack.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Projects</h1>
          <p className="page-sub">Explore projects built by the community</p>
        </div>

        <div className="search-bar mb-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, description or tech..."
          />
        </div>

        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No projects found</h3>
            <p>Try a different search term</p>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map(p => (
              <ProjectCard key={p._id} project={p} onLike={handleLike} currentUserId={user?._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}