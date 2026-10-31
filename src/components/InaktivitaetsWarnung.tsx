import "./InaktivitaetsWarnung.css";

export function InaktivitaetsWarnung({ verbleibendeSekunden }: { verbleibendeSekunden: number }) {
  return (
    <div className="inaktivitaets-warnung" role="alertdialog" aria-live="assertive">
      <p>
        Noch da? In {verbleibendeSekunden} Sekunden startet die Demo neu und alle Eingaben werden
        gelöscht.
      </p>
    </div>
  );
}
