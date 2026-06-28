import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import DeveloperCard from '../../components/DeveloperCard'
import './Developers.css';

export default function Developers() {
  const [developers, setDevelopers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users')
      .then(r => setDevelopers(r.data.filter(u => u.role === 'developer')))
      .finally(() => setLoading(false));
  }, []);

  const filtered = developers.filter(d =>
    !search ||
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Developers</h1>
          <p className="page-sub">Discover talented developers in the community</p>
        </div>

        <div className="search-bar mb-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or skill..."
          />
        </div>

        {loading ? (
          <div className="loading">Loading developers...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No developers found</h3>
            <p>Try a different search term</p>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map(d => <DeveloperCard key={d._id} developer={d} />)}
          </div>
        )}
      </div>
    </div>
  );
}