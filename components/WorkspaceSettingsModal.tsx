import React, { useState } from 'react';
import { Workspace, Role, User } from '../types';
import { X, UserPlus, Shield, Trash2, Mail } from 'lucide-react';

interface WorkspaceSettingsModalProps {
  workspace: Workspace;
  users: Record<string, User>;
  onClose: () => void;
  onUpdateMemberRole: (userId: string, newRole: Role) => void;
  onInviteMember: (email: string, role: Role) => void;
  onRemoveMember: (userId: string) => void;
  currentUserRole: Role;
}

export const WorkspaceSettingsModal: React.FC<WorkspaceSettingsModalProps> = ({
  workspace,
  users,
  onClose,
  onUpdateMemberRole,
  onInviteMember,
  onRemoveMember,
  currentUserRole
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('VIEWER');

  const isOwner = currentUserRole === 'OWNER';

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      onInviteMember(inviteEmail, inviteRole);
      setInviteEmail('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-100">Workspace Settings</h2>
            <p className="text-sm text-gray-500">{workspace.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <UserPlus size={16} /> Members & Permissions
          </h3>
          
          {/* Invite Section */}
          {isOwner && (
            <div className="flex gap-2 mb-8 bg-gray-900 p-4 rounded-lg border border-gray-800">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="email" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Invite by email address..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-200 focus:ring-1 focus:ring-primary-500 outline-none"
                />
              </div>
              <select 
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as Role)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 text-sm text-gray-200 outline-none"
              >
                <option value="VIEWER">Viewer</option>
                <option value="REVIEWER">Reviewer</option>
                <option value="DESIGNER">Flow Designer</option>
                <option value="OWNER">Owner</option>
              </select>
              <button 
                onClick={handleInvite}
                disabled={!inviteEmail.trim()}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Invite
              </button>
            </div>
          )}

          {/* Members List */}
          <div className="space-y-3">
             {workspace.members.map(member => {
               const user = users[member.userId] || { name: 'Unknown', email: 'unknown' };
               return (
                 <div key={member.userId} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-300 font-bold">
                          {user.name.charAt(0)}
                       </div>
                       <div>
                          <div className="text-sm font-bold text-gray-200">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       {isOwner && member.userId !== workspace.ownerId ? (
                         <select 
                           value={member.role}
                           onChange={(e) => onUpdateMemberRole(member.userId, e.target.value as Role)}
                           className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 outline-none focus:border-primary-500"
                         >
                           <option value="VIEWER">Viewer</option>
                           <option value="REVIEWER">Reviewer</option>
                           <option value="DESIGNER">Flow Designer</option>
                           <option value="OWNER">Owner</option>
                         </select>
                       ) : (
                         <span className="text-xs font-bold text-gray-500 px-2 py-1 bg-gray-800 rounded flex items-center gap-1">
                           <Shield size={10} /> {member.role}
                         </span>
                       )}
                       
                       {isOwner && member.userId !== workspace.ownerId && (
                         <button 
                            onClick={() => onRemoveMember(member.userId)}
                            className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                         >
                           <Trash2 size={16} />
                         </button>
                       )}
                    </div>
                 </div>
               );
             })}
          </div>
        </div>
        
        {!isOwner && (
           <div className="p-4 bg-yellow-900/10 border-t border-yellow-900/30 text-xs text-yellow-500 text-center">
             You are viewing settings as <strong>{currentUserRole}</strong>. Only Owners can manage members.
           </div>
        )}
      </div>
    </div>
  );
};