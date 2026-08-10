import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Send, 
  Link, 
  CheckCircle, 
  Wifi, 
  Radio,
  UserCheck
} from '../Icons';
import { MOCK_COLLABORATORS, MOCK_COMMENTS } from '../../mockData';

export default function CollaborationTab() {
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSendComment = () => {
    if (!newCommentText.trim()) return;

    const newCm = {
      id: `cm-${Date.now()}`,
      author: "Alexandru Popescu (You)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      timestamp: "Just now",
      section: "Work Experience - TechScale Solutions",
      text: newCommentText,
      resolved: false
    };

    setComments([newCm, ...comments]);
    setNewCommentText('');
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText("https://cvbuilder.live/room/crdt-78923-ws");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="collaboration-tab">
      {/* Room Status */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 800, color: '#f3f4f6' }}>
          <Radio size={18} style={{ color: '#34d399' }} /> Real-time CRDT & WebSocket Session
        </div>
        <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>
          Collaborate live with recruiters, peer reviewers, or mentors with active cursor tracking and conflict-free data replication.
        </p>
      </div>

      {/* Invite Share Link Card */}
      <div className="item-card" style={{ background: '#1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#60a5fa' }}>
              Active Room ID: crdt-78923-ws
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.1rem' }}>
              Yjs / Automerge WebSocket server connected (wss://sync.cvbuilder.io)
            </div>
          </div>
          <button className="action-btn action-btn-primary" onClick={handleCopyInvite}>
            <Link size={14} /> {copiedLink ? "Copied!" : "Copy Invite Link"}
          </button>
        </div>
      </div>

      {/* Connected Collaborators */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <UserCheck size={14} /> Active Collaborators (2 Online)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {MOCK_COLLABORATORS.map(collab => (
            <div key={collab.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', padding: '0.6rem 0.8rem', borderRadius: '8px', borderLeft: `3px solid ${collab.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${collab.name.split(' ')[0]}`} alt={collab.name} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f3f4f6' }}>{collab.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{collab.status}</div>
                </div>
              </div>
              <span className={`badge ${collab.active ? 'badge-green' : 'badge-danger'}`}>
                <Wifi size={10} /> {collab.active ? 'Active' : 'Offline'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Comments & Feedback Feed */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MessageSquare size={14} /> Feedback & Comment Threads
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Add a comment or suggestion on current section..."
            value={newCommentText} 
            onChange={(e) => setNewCommentText(e.target.value)} 
          />
          <button className="action-btn action-btn-primary" onClick={handleSendComment}>
            <Send size={14} /> Post
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {comments.map(cm => (
            <div key={cm.id} style={{ background: '#1e293b', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <img src={cm.avatar} alt={cm.author} style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                  <strong style={{ fontSize: '0.8rem', color: '#f3f4f6' }}>{cm.author}</strong>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{cm.timestamp}</span>
              </div>

              <div style={{ fontSize: '0.72rem', color: '#c084fc', marginTop: '0.2rem', fontWeight: 600 }}>
                📍 {cm.section}
              </div>

              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.35rem' }}>
                "{cm.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
