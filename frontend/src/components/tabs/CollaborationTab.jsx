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
} from 'lucide-react';
import { MOCK_COLLABORATORS, MOCK_COMMENTS } from '../../mockData.js';
import { Card, CardHeader, CardTitle, CardContent } from '@/frontend/components/ui/card';
import { Button } from '@/frontend/components/ui/button';
import { Badge } from '@/frontend/components/ui/badge';
import { Input } from '@/frontend/components/ui/input';

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

  const handleToggleResolve = (commentId) => {
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, resolved: !c.resolved } : c
    ));
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText("https://cvbuilder.live/room/crdt-78923-ws");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const activeCollaboratorsCount = MOCK_COLLABORATORS.filter(c => c.active).length;

  return (
    <div className="w-full space-y-5">
      {/* Room Status Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-base font-extrabold text-slate-100">
          <div className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </div>
          <Radio className="size-4 text-emerald-400 shrink-0" />
          <span>Real-time CRDT & WebSocket Session</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Collaborate live with recruiters, peer reviewers, or mentors with active cursor tracking and conflict-free data replication.
        </p>
      </div>

      {/* Invite Share Link Card */}
      <Card className="bg-slate-900 border-slate-800 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-400">Active Room ID:</span>
              <Badge variant="blue" className="text-[11px] font-mono font-bold">crdt-78923-ws</Badge>
            </div>
            <div className="text-xs text-slate-400">
              Yjs / Automerge WebSocket server connected (<span className="text-slate-300 font-mono text-[11px]">wss://sync.cvbuilder.io</span>)
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={handleCopyInvite} 
            className="gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shrink-0"
          >
            <Link className="size-3.5" />
            {copiedLink ? "Copied!" : "Copy Invite Link"}
          </Button>
        </div>
      </Card>

      {/* Connected Collaborators */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <UserCheck className="size-4 text-emerald-400 shrink-0" />
            <span>Active Collaborators ({activeCollaboratorsCount} Online)</span>
          </div>
        </div>

        <div className="space-y-2">
          {MOCK_COLLABORATORS.map(collab => (
            <Card key={collab.id} className="bg-slate-950/80 border-slate-800 p-3 flex items-center justify-between hover:bg-slate-900/60 transition-colors">
              <div className="flex items-center gap-3">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${collab.name.split(' ')[0]}`} 
                  alt={collab.name} 
                  className="w-7 h-7 rounded-full ring-2 ring-indigo-500/40 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">{collab.name}</span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-slate-400 border-slate-800">
                      {collab.role}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-400">{collab.status}</div>
                </div>
              </div>
              <div className="shrink-0">
                {collab.active ? (
                  <Badge variant="success" className="gap-1 text-[10px] font-bold">
                    <Wifi className="size-2.5 animate-pulse" /> Active
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1 text-[10px] font-bold">
                    <Wifi className="size-2.5 opacity-40" /> Offline
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Live Comments & Feedback Feed */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
          <MessageSquare className="size-4 text-sky-400 shrink-0" />
          <span>Feedback & Comment Threads</span>
        </div>

        {/* New Comment Input */}
        <div className="flex items-center gap-2">
          <Input 
            type="text" 
            placeholder="Add a comment or suggestion on current section..."
            value={newCommentText} 
            onChange={(e) => setNewCommentText(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
            className="bg-slate-950/90 border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 h-9"
          />
          <Button 
            size="sm" 
            onClick={handleSendComment} 
            className="gap-1.5 h-9 font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 text-xs"
          >
            <Send className="size-3.5" />
            Post
          </Button>
        </div>

        {/* Comment Cards List */}
        <div className="space-y-3">
          {comments.map(cm => (
            <Card 
              key={cm.id} 
              className={`p-3.5 space-y-2 border transition-all ${
                cm.resolved 
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-60' 
                  : 'bg-slate-900 border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img 
                    src={cm.avatar} 
                    alt={cm.author} 
                    className="w-5 h-5 rounded-full shrink-0" 
                  />
                  <span className="text-xs font-bold text-slate-200">{cm.author}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">{cm.timestamp}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Badge variant="purple" className="text-[10px] font-semibold gap-1 py-0.5 px-2">
                  📍 {cm.section}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="xs" 
                  onClick={() => handleToggleResolve(cm.id)}
                  className="text-[11px] h-6 gap-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50"
                >
                  <CheckCircle className={`size-3 ${cm.resolved ? 'text-emerald-400' : ''}`} />
                  {cm.resolved ? 'Resolved' : 'Mark Resolved'}
                </Button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
                "{cm.text}"
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

