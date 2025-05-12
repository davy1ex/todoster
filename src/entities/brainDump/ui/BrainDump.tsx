import { useCallback } from 'react';
import { brainDumpStore } from '../model/store';
import './BrainDump.css';

export const BrainDump = () => {
    const { dumps, currentDump, addDump, updateCurrentDump, deleteDump } = brainDumpStore(
        (state) => state
    );

    const handleSave = useCallback(() => {
        if (currentDump.trim()) {
            addDump(currentDump.trim());
        }
    }, [currentDump, addDump]);

    const handleClear = useCallback(() => {
        updateCurrentDump('');
    }, [updateCurrentDump]);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString();
    };

    return (
        <div className="brainDump">
            <textarea
                className="brainDump__textarea"
                value={currentDump}
                onChange={(e) => updateCurrentDump(e.target.value)}
                placeholder="Start brain dumping here... Write whatever comes to mind."
                data-testid="brain-dump-input"
            />
            
            <div className="brainDump__controls">
                <button
                    className="brainDump__button brainDump__button--clear"
                    onClick={handleClear}
                    data-testid="brain-dump-clear"
                >
                    Clear
                </button>
                <button
                    className="brainDump__button brainDump__button--save"
                    onClick={handleSave}
                    disabled={!currentDump.trim()}
                    data-testid="brain-dump-save"
                >
                    Save
                </button>
            </div>

            <div className="brainDump__history">
                {dumps.map((dump) => (
                    <div key={dump.id} className="brainDump__history-item">
                        <div className="brainDump__history-content">
                            {dump.content}
                        </div>
                        <div className="brainDump__history-meta">
                            <span>Created: {formatDate(dump.createdAt)}</span>
                            <button
                                className="brainDump__history-delete"
                                onClick={() => deleteDump(dump.id)}
                                data-testid={`brain-dump-delete-${dump.id}`}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 