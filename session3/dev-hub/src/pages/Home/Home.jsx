import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ProjectCard from '../../components/ProjectCard';
import DeveloperCard from '../../components/DeveloperCard';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

export default function Home() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data.slice(0, 3)));
    api.get('/users').then(r => setDevelopers(r.data.filter(u => u.role === 'developer').slice(0, 3)));
  }, []);

  async function handleLike(projectId) {
    if (!user) return;
    const res = await api.post(`/projects/${projectId}/like`);
    setProjects(prev => prev.map(p => p._id === projectId ? res.data : p));
  }

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            Where Developers<br />
            <span className="hero-accent">Build & Showcase</span>
          </h1>
          <p className="hero-sub">
            Discover talented developers, explore open-source projects, and share your work with the community.
          </p>
          <div className="hero-actions">
            <Link to="/projects" className="btn btn-primary btn-lg">Explore Projects</Link>
            {!user && <Link to="/register" className="btn btn-ghost btn-lg">Join DevHub</Link>}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Recent Projects</h2>
            <Link to="/projects">View all →</Link>
          </div>
          <div className="grid-3">
            {projects.map(p => (
              <ProjectCard key={p._id} project={p} onLike={handleLike} currentUserId={user?._id} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Developers</h2>
            <Link to="/developers">View all →</Link>
          </div>
          <div className="grid-3">
            {developers.map(d => (
              <DeveloperCard key={d._id} developer={d} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}