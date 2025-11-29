
import React, { useState } from 'react';
import { AuditLogEntry } from '../types';
import { X, Search, FileText, Calendar, User } from 'lucide-react';

interface AuditLogViewerProps {
  logs: AuditLogEntry[];
  onClose: () => void;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-gray-400" />
            <div>
              <h2 className="text-xl font-bold text-gray-100">Audit Logs</h2>
              <p className="text-sm text-gray-500">Track all workspace activity for compliance.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors">
            Close
          </button>
        </div>

        <div className="p-4 border-b border-gray-800 bg-gray-900/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs by action, user, or details..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-200 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-0">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-900 text-gray-400 uppercase font-bold text-xs sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 border-b border-gray-800 w-48">Timestamp</th>
                <th className="p-4 border-b border-gray-800 w-32">User</th>
                <th className="p-4 border-b border-gray-800 w-48">Action</th>
                <th className="p-4 border-b border-gray-800">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 italic">
                    No logs found matching your search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-900/50 transition-colors">
                    <td className="p-4 text-gray-400 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <User size={12} className="text-gray-500" />
                        <span className="truncate max-w-[100px]" title={log.userId}>{log.userId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-1 bg-gray-800 rounded text-xs font-bold text-gray-300 border border-gray-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
