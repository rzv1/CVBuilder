import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Send, 
  Link, 
  CheckCircle, 
  Wifi, 
  Radio,
  UserCheck,
  Lock
} from 'lucide-react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { useCv, useAuth } from '@/src/context/index.jsx';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '../ui/empty';

export default function CollaborationTab(props = {}) {
  const cv = useCv();
  const auth = useAuth();
  const currentUser = props.currentUser ?? auth.currentUser;

  const groupMembers = props.groupMembers ?? cv.groupMembers ?? [];
  const comments = props.comments ?? cv.comments ?? [];
  const onAddComment = props.onAddComment ?? cv.handleAddGroupComment;
  const onToggleComment = props.onToggleComment ?? cv.handleToggleGroupComment;

  const [newCommentText, setNewCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSendComment = async () => {
    if (!newCommentText.trim()) return;

    if (onAddComment) {
      await onAddComment("Work Experience - TechScale Solutions", newCommentText);
    }
    setNewCommentText('');
  };

  const handleToggleResolve = async (commentId) => {
    if (onToggleComment) {
      await onToggleComment(commentId);
    }
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText("https://cvbuilder.live/room/crdt-78923-ws");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const activeCollaboratorsCount = groupMembers.filter(c => c.active !== false).length;

  if (!currentUser) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center p-4">
        <Empty className="w-full max-w-md border-slate-800 bg-slate-900/60 p-8 shadow-sm">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Lock className="size-6" />
            </EmptyMedia>
            <EmptyTitle className="text-base font-bold text-slate-100">
              Autentificare necesară pentru Colaborare
            </EmptyTitle>
            <EmptyDescription className="text-xs text-slate-400 max-w-md leading-relaxed">
              Conectați-vă în cont pentru a iniția sau participa la sesiuni live de editare colaborativă, feedback și comentarii pe CV.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex flex-col items-center gap-2">
            <Button
              onClick={() => auth?.openAuthModal?.()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Lock className="size-4" />
              Conectare / Autentificare
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (groupMembers.length === 0 && comments.length === 0) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center p-4">
        <Empty className="w-full max-w-md border-slate-800 bg-slate-900/60 p-8 shadow-sm">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Users className="size-6" />
            </EmptyMedia>
            <EmptyTitle className="text-base font-bold text-slate-100">
              Nicio sesiune de colaborare activă
            </EmptyTitle>
            <EmptyDescription className="text-xs text-slate-400 max-w-md leading-relaxed">
              Nu există colaboratori conectați sau comentarii adăugate pe acest CV. Partajați link-ul camerei pentru a invita colegi sau mentori.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex flex-col items-center gap-2">
            <Button
              onClick={handleCopyInvite}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Link className="size-4" />
              {copiedLink ? "Link Copiat!" : "Copiază Link Invitație"}
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

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
          {groupMembers.map(collab => (
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
                  <div className="text-[11px] text-slate-400">{collab.status || 'Online'}</div>
                </div>
              </div>
              <div className="shrink-0">
                {collab.active !== false ? (
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
                    src={cm.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena'} 
                    alt={cm.author || 'User'} 
                    className="w-5 h-5 rounded-full shrink-0" 
                  />
                  <span className="text-xs font-bold text-slate-200">{cm.author || 'Elena Ionescu'}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {cm.createdAt ? new Date(cm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                </span>
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
