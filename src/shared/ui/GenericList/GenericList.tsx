import { ReactNode } from 'react';
import './GenericList.css';

export interface GenericListProps<T> {
    title: string;
    items: T[];
    onAdd: () => void;
    renderItem: (item: T) => ReactNode;
    addButtonText?: string;
    emptyMessage?: string;
    className?: string;
}

export function GenericList<T>({
    title,
    items,
    onAdd,
    renderItem,
    addButtonText = 'Add',
    emptyMessage = 'No items yet',
    className = '',
}: GenericListProps<T>) {
    return (
        <div className={`generic-list ${className}`}>
            <div className="generic-list__header">
                <h2 className="generic-list__title">{title}</h2>
                <button 
                    className="generic-list__add-button"
                    onClick={onAdd}
                >
                    {addButtonText}
                </button>
            </div>

            <div className="generic-list__content">
                {items.length > 0 ? (
                    items.map((item) => renderItem(item))
                ) : (
                    <p className="generic-list__empty">{emptyMessage}</p>
                )}
            </div>
        </div>
    );
} 