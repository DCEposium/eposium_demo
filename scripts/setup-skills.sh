#!/usr/bin/env bash
# Holt die benötigten Skills aus dem Internet in dieses Projekt (.claude/skills).
# Quelle: offizielles Anthropic-Repository https://github.com/anthropics/skills
# Voraussetzung: git, Internet. Aufruf im Projektordner: bash scripts/setup-skills.sh
set -euo pipefail

REPO_URL="https://github.com/anthropics/skills.git"
WANTED=("frontend-design" "webapp-testing" "skill-creator")   # bei Bedarf erweitern
DEST=".claude/skills"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$DEST"
echo ">> Lade $REPO_URL (flach) ..."
git clone --depth 1 "$REPO_URL" "$TMP/skills" >/dev/null 2>&1 || { echo "FEHLER: Klonen fehlgeschlagen (Internet/Proxy prüfen)"; exit 1; }

# Skills können im Repo-Root oder unter skills/ liegen; beides prüfen.
find_skill() {
  for base in "$TMP/skills/skills" "$TMP/skills"; do
    if [ -f "$base/$1/SKILL.md" ]; then echo "$base/$1"; return 0; fi
  done
  return 1
}

for name in "${WANTED[@]}"; do
  if src="$(find_skill "$name")"; then
    rm -rf "$DEST/$name"
    cp -R "$src" "$DEST/$name"
    echo "OK    $name"
  else
    echo "FEHLT $name (im Repo nicht gefunden, Namen prüfen)"
  fi
done

echo; echo ">> Im Repo vorhandene Skills (zur Orientierung):"
for base in "$TMP/skills/skills" "$TMP/skills"; do
  [ -d "$base" ] && find "$base" -maxdepth 2 -name SKILL.md -not -path "*/node_modules/*" | sed "s|$base/||;s|/SKILL.md||" | sort -u && break
done

echo; echo ">> Lizenzhinweis: Einige Anthropic-Skills stehen unter Apache-2.0, andere (Dokumenten-Skills) unter eigenen Bedingungen."
echo "   Vor Weitergabe/Kommerzialisierung die LICENSE-Dateien in $DEST/<skill>/ lesen."
echo ">> Fertig. Der eigene Skill 'eposium-brand' liegt bereits in $DEST/eposium-brand."
