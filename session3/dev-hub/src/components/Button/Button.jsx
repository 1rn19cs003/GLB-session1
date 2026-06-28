import React from 'react';
import './Button.css';

export default function Button({ children, variant = 'primary', size = 'md', loading = false, ...props }) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}