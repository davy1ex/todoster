import { useCallback, useEffect } from 'react';
import { useBrainDumpStore } from '../model/store';
import './BrainDump.css';

export const BrainDump = () => {
    const { dumps, sharedContent, createDump, updateContent, deleteDump } = useBrainDumpStore();

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

    return (
        <div className="brainDump__container">
            <button className="brainDump__addButton" onClick={handleAddNew}>
                <span>+</span>
            </button>
            <div className="brainDump__grid">
                {dumps.map((dump) => (
                    <div key={dump.id} className="brainDump">
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