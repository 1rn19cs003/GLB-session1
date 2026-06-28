import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/projects/${id}`),
      api.get(`/projects/${id}/comments`),
    ]).then(([pRes, cRes]) => {
      setProject(pRes.data);
      setComments(cRes.data);
    }).catch(() => navigate('/projects'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleLike() {
    if (!user) return;
    const res = await api.post(`/projects/${id}/like`);
    setProject(res.data);
  }

  async function handleComment(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setCommenting(true);
    try {
      const res = await api.post(`/projects/${id}/comments`, { message });
      setComments(c => [...c, res.data]);
      setMessage('');
    } finally {
      setCommenting(false);
    }
  }

  async function handleDeleteComment(commentId) {
    await api.delete(`/projects/${id}/comments/${commentId}`);
    setComments(c => c.filter(x => x._id !== commentId));
  }

  async function handleDeleteProject() {
    if (!window.confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    navigate('/projects');
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (!project) return null;

  const liked = user && project.likes.includes(user._id);
  const isOwner = user && project.ownerId === user._id;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="page">
      <div className="container">
        <div className="project-detail">
          <div className="project-main">
            <div className="project-header">
              <div>
                <h1 className="project-title">{project.title}</h1>
                <p className="project-owner">
                  by <Link to={`/profile/${project.ownerId}`}>{project.ownerName}</Link>
                </p>
              </div>
              <div className="project-header-actions">
                <button className={`like-btn-lg ${liked ? 'liked' : ''}`} onClick={handleLike}>
                  ♥ {project.likes.length} {liked ? 'Liked' : 'Like'}
                </button>
                {(isOwner || isAdmin) && (
                  <Button variant="danger" size="sm" onClick={handleDeleteProject}>Delete</Button>
                )}
              </div>
            </div>

            <p className="project-desc">{project.description}</p>

            <div className="project-tech mb-3">
              {project.techStack.map(t => (
                <span key={t} className="badge badge-primary">{t}</span>
              ))}
            </div>

            <div className="project-links">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-link-btn">
                  GitHub Repository
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="project-link-btn project-link-live">
                  Live Demo
                </a>
              )}
            </div>

            <div className="comments-section">
              <h3 className="comments-title">Comments ({comments.length})</h3>

              {user && (
                <form onSubmit={handleComment} className="comment-form">
                  <input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Write a comment..."
                  />
                  <Button type="submit" loading={commenting} size="sm">Post</Button>
                </form>
              )}

              <div className="comments-list">
                {comments.length === 0 && (
                  <p className="no-comments">No comments yet. Be the first!</p>
                )}
                {comments.map(c => (
                  <div key={c._id} className="comment">
                    <div className="comment-header">
                      <span className="comment-author">{c.userName}</span>
                      <span className="comment-date">{new Date(c.createdAt).toLocaleDateString()}</span>
                      {(user?._id === c.userId || isAdmin) && (
                        <button className="comment-delete" onClick={() => handleDeleteComment(c._id)}>✕</button>
                      )}
                    </div>
                    <p className="comment-msg">{c.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}