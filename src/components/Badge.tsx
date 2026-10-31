import type { ReactNode } from "react";
import "./Badge.css";

interface BadgeProps {
  variante: "erfuellt" | "hinweis";
  children: ReactNode;
}

// Nur Markenfarben (siehe brand/BRAND.md: keine weiteren Farbtöne). "Hinweis"
// wird über Rahmen/Gewicht/Icon abgesetzt, nicht über eine Warnfarbe wie Rot.
export function Badge({ variante, children }: BadgeProps) {
  return (
    <span className={`badge badge--${variante}`}>
      <span aria-hidden="true" className="badge-icon">
        {variante === "erfuellt" ? "✓" : "!"}
      </span>
      {children}
    </span>
  );
}
