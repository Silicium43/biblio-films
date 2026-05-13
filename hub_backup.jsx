import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { Globe, BookOpen, Map, Coffee, Film } from 'lucide-react';

function Hub() {
  return (
    <div className="home-container" style={{ padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>Bienvenue</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Sélectionnez la langue que vous souhaitez étudier aujourd'hui. Chaque module possède son propre design et ses propres jeux d'apprentissage.
          </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Japanese */}
        <Link to="/jp" style={{ background: '#1e1e1e', borderRadius: '16px', padding: '2rem', textDecoration: 'none', color: '#e0e0e0', border: '1px solid #333', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '4rem', color: '#e53935', marginBottom: '1rem', fontWeight: '900', fontFamily: 'Noto Sans JP' }}>語</div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontFamily: 'Outfit' }}>Japonais</h3>
            <p style={{ margin: 0, color: '#9e9e9e', textAlign: 'center', fontFamily: 'Outfit' }}>Kanjis, Vocabulaire, SRS & Conjugaison.</p>
        </Link>

        {/* French */}
        <Link to="/fr" style={{ background: '#1a2238', borderRadius: '16px', padding: '2rem', textDecoration: 'none', color: '#f2e9d0', border: '1px solid #2a3655', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ color: '#d4af37', marginBottom: '1rem' }}><BookOpen size={64} strokeWidth={1.5} /></div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontFamily: 'Playfair Display' }}>Français</h3>
            <p style={{ margin: 0, color: '#c2b59b', textAlign: 'center', fontFamily: 'Playfair Display' }}>Grammaire, Vocabulaire et Géographie.</p>
        </Link>

        {/* Spanish */}
        <Link to="/es" style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem', textDecoration: 'none', color: '#4a3b32', border: '1px solid #eaddcf', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ color: '#c85a17', marginBottom: '1rem' }}><Coffee size={64} strokeWidth={1.5} /></div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontFamily: 'Lora' }}>Espagnol</h3>
            <p style={{ margin: 0, color: '#8c7b70', textAlign: 'center', fontFamily: 'Lora' }}>Conjugaison et Verbes irréguliers.</p>
        </Link>

        {/* Portuguese */}
        <Link to="/pt" style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem', textDecoration: 'none', color: '#1e3a5f', border: '1px solid #d0e1e8', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ color: '#0077b6', marginBottom: '1rem' }}><Globe size={64} strokeWidth={1.5} /></div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontFamily: 'Outfit' }}>Portugais</h3>
            <p style={{ margin: 0, color: '#5c7c99', textAlign: 'center', fontFamily: 'Outfit' }}>Conjugaison ludique.</p>
        </Link>

        {/* Divers */}
        <Link to="/misc" style={{ background: '#2d3748', borderRadius: '16px', padding: '2rem', textDecoration: 'none', color: '#e2e8f0', border: '1px solid #4a5568', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ color: '#68d391', marginBottom: '1rem' }}><Map size={64} strokeWidth={1.5} /></div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontFamily: 'Outfit' }}>Divers</h3>
            <p style={{ margin: 0, color: '#a0aec0', textAlign: 'center', fontFamily: 'Outfit' }}>Géographie, Recettes & Projets.</p>
        </Link>

        {/* Vidéothèque */}
        <a href="/learning-hub/biblio-films/index.html" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '16px', padding: '2rem', textDecoration: 'none', color: '#ffffff', border: '1px solid #f472b6', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 0 15px rgba(244, 114, 182, 0.2)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ color: '#22d3ee', marginBottom: '1rem' }}><Film size={64} strokeWidth={1.5} /></div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontFamily: 'Orbitron, sans-serif' }}>Vidéothèque</h3>
            <p style={{ margin: 0, color: '#94a3b8', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>Ma collection (Vaporwave)</p>
        </a>

      </div>
    </div>
  );
}

export default Hub;
