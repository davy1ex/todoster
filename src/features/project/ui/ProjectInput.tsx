import { FC, useState } from 'react';
import styles from './ProjectInput.module.css';

interface ProjectInputProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export const ProjectInput: FC<ProjectInputProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
    }
  };

  return (
    <div className={styles.overlay}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          autoFocus
          className={styles.input}
        />
        <div className={styles.buttons}>
          <button type="submit" className={styles.submitButton}>
            Add
          </button>
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}; 