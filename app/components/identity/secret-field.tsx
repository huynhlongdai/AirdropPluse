import React from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import classNames from "classnames";
import styles from "./secret-field.module.css";

interface SecretFieldProps {
  value?: string;
  isGlobalHidden: boolean;
  placeholder?: string;
}

export function SecretField({ value, isGlobalHidden, placeholder = "—" }: SecretFieldProps) {
  const [copied, setCopied] = React.useState(false);
  const [localVisible, setLocalVisible] = React.useState(false);

  const isHidden = isGlobalHidden || !localVisible;

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!value) {
    return <span className={styles.empty}>{placeholder}</span>;
  }

  return (
    <div className={styles.wrapper}>
      <span className={classNames(styles.value, { [styles.masked]: isHidden })}>
        {isHidden ? "••••••••••••" : value}
      </span>
      <div className={styles.actions}>
        <button
          className={styles.iconBtn}
          onClick={() => setLocalVisible((v) => !v)}
          title={localVisible ? "Hide" : "Reveal"}
          type="button"
        >
          {localVisible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        <button
          className={classNames(styles.iconBtn, { [styles.copied]: copied })}
          onClick={handleCopy}
          title="Copy"
          type="button"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}
