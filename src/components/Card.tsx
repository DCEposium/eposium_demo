import type { ReactNode } from "react";
import "./Card.css";

interface CardProps {
  titel: string;
  icon?: ReactNode;
  fuss?: string;
  children?: ReactNode;
}

// Weiße Karte mit großem Radius, Icon links, Titel in Medium, optionale Fußleiste
// in sehr hellem Türkis-Ton — siehe brand/BRAND.md, Bildsprache und Layout.
export function Card({ titel, icon, fuss, children }: CardProps) {
  return (
    <div className="card">
      <div className="card-kopf">
        {icon && <span className="card-icon">{icon}</span>}
        <h3 className="card-titel">{titel}</h3>
      </div>
      {children && <div className="card-inhalt">{children}</div>}
      {fuss && <div className="card-fuss">{fuss}</div>}
    </div>
  );
}
