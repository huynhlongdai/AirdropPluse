import { Trash2 } from "lucide-react";
import styles from "./confirm-delete-dialog.module.css";

interface Props {
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteDialog({ title, description, onCancel, onConfirm }: Props) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}>
          <Trash2 size={20} />
        </div>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel} type="button">Cancel</button>
          <button className={styles.deleteBtn} onClick={onConfirm} type="button">Delete</button>
        </div>
      </div>
    </div>
  );
}
