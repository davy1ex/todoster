import { useCallback, useEffect, useState } from 'react';
import { useBrainDumpStore } from '../model/store';
import './BrainDump.css';

export const BrainDump = () => {
    const { dumps, sharedContent, createDump, updateContent, updateTitle, deleteDump } = useBrainDumpStore();
    const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
    const [editingTitleValue, setEditingTitleValue] = useState('');

    useEffect(() => {
        // Create initial dump if none exists
        if (dumps.length === 0) {
            createDump();
        }
    }, [dumps.length, createDump]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateContent(e.target.value);
    }, [updateContent]);

    const handleAddNew = useCallback(() => {
        createDump();
    }, [createDump]);

    const handleDelete = useCallback((id: string) => {
        deleteDump(id);
    }, [deleteDump]);

    const handleTitleClick = useCallback((dump: { id: string, title: string }) => {
        setEditingTitleId(dump.id);
        setEditingTitleValue(dump.title);
    }, []);

    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEditingTitleValue(e.target.value);
    }, []);

    const handleTitleBlur = useCallback(() => {
        if (editingTitleId && editingTitleValue.trim()) {
            updateTitle(editingTitleId, editingTitleValue.trim());
        }
        setEditingTitleId(null);
    }, [editingTitleId, editingTitleValue, updateTitle]);

    const handleTitleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTitleBlur();
        }
    }, [handleTitleBlur]);

    return (
        <div className="brainDump__container">
            <button className="brainDump__addButton" onClick={handleAddNew}>
                <span>+</span>
            </button>
            <div className="brainDump__grid">
                {dumps.map((dump) => (
                    <div key={dump.id} className="brainDump">
                        <div 
                            className="brainDump__header"
                            onClick={() => handleTitleClick(dump)}
                        >
                            {editingTitleId === dump.id ? (
                                <input
                                    className="brainDump__titleInput"
                                    value={editingTitleValue}
                                    onChange={handleTitleChange}
                                    onBlur={handleTitleBlur}
                                    onKeyPress={handleTitleKeyPress}
                                    autoFocus
                                />
                            ) : (
                                <span className="brainDump__title">{dump.title}</span>
                            )}
                        </div>
                        <textarea
                            className="brainDump__textarea"
                            value={sharedContent}
                            onChange={handleChange}
                            placeholder="Start typing your thoughts..."
                        />
                        <button 
                            className="brainDump__deleteButton"
                            onClick={() => handleDelete(dump.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}; 