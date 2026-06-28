import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

export default function DeveloperCard({ developer }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="dev-header">
          <div className="dev-avatar">{developer.name[0].toUpperCase()}</div>
          <div>
            <h3 className="card-title">
              <Link to={`/profile/${developer._id}`}>{developer.name}</Link>
            </h3>
            <p className="card-desc" style={{ margin: 0 }}>{developer.bio || 'Developer'}</p>
          </div>
        </div>

        <div className="card-tags mt-2">
          {developer.skills.slice(0, 5).map(skill => (
            <span key={skill} className="badge badge-primary">{skill}</span>
          ))}
        </div>
      </div>

      <div className="card-footer">
        {developer.github && (
          <a href={developer.github} target="_blank" rel="noreferrer" className="card-link">GitHub</a>
        )}
        <Link to={`/profile/${developer._id}`} className="card-link">View Profile →</Link>
      </div>
    </div>
  );
}