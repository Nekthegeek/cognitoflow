import React, { useState } from 'react';
import { Brain, Sparkles, X, Loader2 } from 'lucide-react';

interface AIGeneratedWorkflowModalProps {
  onClose: () => void;
  onCreateFlow: (goal: string) => Promise<void>;
}

export const AIGeneratedWorkflowModal: React.FC<AIGeneratedWorkflowModalProps> = ({ onClose, onCreateFlow }) => {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!goal.trim()) {
      setError('Please describe your goal.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await onCreateFlow(goal);
      // The modal will be closed by the parent component after the flow is created and the view changes.
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while generating the workflow. The AI may have returned an invalid structure. Please try again with a clearer goal.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-bg-secondary/70 backdrop-blur-sm z-50 flex justify-center items-center animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-2xl bg-bg-card border border-border-primary rounded-xl shadow-2xl p-8 animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="text-center">
          <Brain size={32} className="text-accent-primary mx-auto mb-4"/>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Describe Your Workflow Goal</h2>
          <p className="text-text-tertiary mb-8">
            Let our AI architect a starting point for you. Be descriptive for the best results.
          </p>
        </div>
        
        <div className="space-y-4">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={isLoading}
            placeholder='e.g., "Scrape competitor websites for pricing, analyze the data for trends, and generate a weekly report summary."'
            className="w-full h-32 bg-bg-input border border-border-primary rounded-lg p-4 text-sm resize-none focus:border-accent-primary focus:ring-accent-primary/50 outline-none"
          />
          {error && <p className="text-sm text-status-error">{error}</p>}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button onClick={onClose} disabled={isLoading} className="px-6 py-2 text-sm font-medium text-text-secondary rounded-lg hover:bg-bg-hover">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !goal.trim()}
            className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-accent-secondary to-accent-primary text-white rounded-lg hover:brightness-110 transition-all shadow-lg shadow-glow-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Workflow
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
