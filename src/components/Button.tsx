import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** "sekundaer" ist für dunklen Grund gedacht, "sekundaer-hell" für weiße Karten. */
  variante?: "primaer" | "sekundaer" | "sekundaer-hell";
}

export function Button({ variante = "primaer", className, ...rest }: ButtonProps) {
  const klassen = ["app-button", `app-button--${variante}`, className].filter(Boolean).join(" ");
  return <button type="button" className={klassen} {...rest} />;
}
