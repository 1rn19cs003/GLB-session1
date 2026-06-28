import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ProjectCard from '../../components/ProjectCard'
import './Profile.css';

export default function Profile() {
  const { id } = useParams();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/users/${id}`),
      api.get('/projects'),
    ]).then(([uRes, pRes]) => {
      setProfile(uRes.data);
      setProjects(pRes.data.filter(p => p.ownerId === id));
    }).finally(() => setLoading(false));
  }, [id]);

  async function handleLike(projectId) {
    if (!me) return;
    const res = await api.post(`/projects/${projectId}/like`);
    setProjects(prev => prev.map(p => p._id === projectId ? res.data : p));
  }

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profile) return <div className="loading">User not found</div>;

  return (
    <div className="page">
      <div className="container">
        <div className="profile-layout">
          <div className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-avatar">{profile.name[0].toUpperCase()}</div>
              <h2 className="profile-name">{profile.name}</h2>
              <span className={`badge ${profile.role === 'admin' ? 'badge-primary' : 'badge-green'}`}>{profile.role}</span>

              {profile.bio && <p className="profile-bio">{profile.bio}</p>}

              <div className="profile-links">
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                )}
              </div>

              {profile.skills.length > 0 && (
                <div className="profile-skills">
                  <h4>Skills</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.skills.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
                  </div>
                </div>
              )}

              <p className="profile-joined">
                Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="profile-main">
            <h3 className="profile-section-title">Projects ({projects.length})</h3>
            {projects.length === 0 ? (
              <div className="empty-state">
                <h3>No projects yet</h3>
              </div>
            ) : (
              <div className="grid-2">
                {projects.map(p => (
                  <ProjectCard key={p._id} project={p} onLike={handleLike} currentUserId={me?._id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}