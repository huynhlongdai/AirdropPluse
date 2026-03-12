import React from "react";
import * as OTPAuth from "otpauth";
import classNames from "classnames";
import { Copy, Check } from "lucide-react";
import styles from "./totp-generator.module.css";

const PERIOD = 30;
const RADIUS = 13;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface TotpGeneratorProps {
  secret?: string;
}

export function TotpGenerator({ secret }: TotpGeneratorProps) {
  const [code, setCode] = React.useState<string>("");
  const [remaining, setRemaining] = React.useState<number>(PERIOD);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!secret) return;

    let totp: OTPAuth.TOTP;
    try {
      totp = new OTPAuth.TOTP({ secret: OTPAuth.Secret.fromBase32(secret), period: PERIOD, digits: 6 });
    } catch {
      setCode("INVALID");
      return;
    }

    const tick = () => {
      try {
        const token = totp.generate();
        setCode(token);
        const now = Math.floor(Date.now() / 1000);
        setRemaining(PERIOD - (now % PERIOD));
      } catch {
        setCode("ERROR");
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [secret]);

  const handleCopy = async () => {
    if (!code || code === "INVALID" || code === "ERROR") return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!secret) {
    return <span className={styles.noSecret}>No 2FA secret stored</span>;
  }

  const progress = remaining / PERIOD;
  const offset = CIRCUMFERENCE * (1 - progress);
  const isLow = remaining <= 7;

  return (
    <div className={styles.container}>
      <div className={styles.codeWrapper}>
        <span className={styles.code}>{code ? `${code.slice(0, 3)} ${code.slice(3)}` : "------"}</span>
        <span className={classNames(styles.timer, { [styles.timerLow]: isLow })}>{remaining}s</span>
      </div>

      <svg className={styles.progress} viewBox="0 0 32 32">
        <circle cx="16" cy="16" r={RADIUS} fill="none" stroke="var(--color-accent-5)" strokeWidth="2.5" />
        <circle
          className={styles.progressCircle}
          cx="16"
          cy="16"
          r={RADIUS}
          fill="none"
          stroke={isLow ? "var(--color-error-9)" : "var(--color-accent-9)"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>

      <button
        className={classNames(styles.copyBtn, { [styles.copied]: copied })}
        onClick={handleCopy}
        title="Copy code"
        type="button"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
}
