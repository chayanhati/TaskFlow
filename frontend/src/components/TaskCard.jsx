import { useState } from 'react';
import { format, isPast, parseISO } from 'date-fns';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

const priorityConfig = {
  high: { label: 'High', dot: 'bg-red-500' },
  medium: { label: 'Medium', dot: 'bg-amber-500' },
  low: { label: 'Low', dot: 'bg-green-500' },
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const isOverdue = task.dueDate && task.status !== 'completed' && isPast(parseISO(task.dueDate));

  const nextStatus = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' };
  const nextStatusLabel = { pending: 'Start', in_progress: 'Complete', completed: 'Reopen' };

  return (
    <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 p-5 group ${task.status === 'completed' ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${status.color}`}>
            {status.label}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
            {priority.label}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[140px] overflow-hidden">
              <button
                onClick={() => { onEdit(task); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => { onStatusChange(task.id, nextStatus[task.status]); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {nextStatusLabel[task.status]}
              </button>
              <button
                onClick={() => { onDelete(task.id); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className={`font-semibold text-slate-800 mb-1 leading-snug ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
        {task.title}
      </h3>

      {task.description && (
        <p className="text-sm text-slate-500 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        {task.dueDate ? (
          <span className={`text-xs font-medium flex items-center gap-1 ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {isOverdue ? 'Overdue · ' : ''}{format(parseISO(task.dueDate), 'MMM d, yyyy')}
          </span>
        ) : (
          <span className="text-xs text-slate-300">No due date</span>
        )}

        <button
          onClick={() => onStatusChange(task.id, nextStatus[task.status])}
          className="text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline transition-colors"
        >
          {nextStatusLabel[task.status]} →
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
