import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

export default function ProjectCard({ project, onLike, currentUserId }) {
  const liked = currentUserId && project.likes.includes(currentUserId);

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">
          <Link to={`/projects/${project._id}`}>{project.title}</Link>
        </h3>
        <p className="card-desc">{project.description}</p>

        <div className="card-tags">
          {project.techStack.map(tech => (
            <span key={tech} className="badge badge-primary">{tech}</span>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <span className="card-owner">by {project.ownerName}</span>
        <div className="card-actions">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="card-link">GitHub</a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="card-link">Live</a>
          )}
          <button
            className={`like-btn ${liked ? 'liked' : ''}`}
            onClick={() => onLike && onLike(project._id)}
          >
            ♥ {project.likes.length}
          </button>
        </div>
      </div>
    </div>
  );
}