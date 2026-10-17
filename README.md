# Anwesenheits-App – Supabase-Version

## Enthalten
- `index.html`, `style.css`, `app.js`: App mit Supabase-Anmeldung, Zugangsanfrage, Freigabeprüfung, Cloud-Speichern und Aktualisieren.
- `SUPABASE_SETUP.sql`: SQL zum Abgleichen/Einrichten der RLS-Regeln und Hinweise zur ersten Administratorfreigabe.

## Supabase einrichten
1. Öffne das Supabase-Dashboard des Projekts `yfkijeyujeclgupjfkdi`.
2. Unter Authentication die E-Mail-Bestätigungseinstellung prüfen. Wenn sie aktiv ist, muss ein neuer Nutzer erst die Bestätigungs-E-Mail anklicken.
3. Führe `SUPABASE_SETUP.sql` im SQL Editor aus. Das Skript setzt voraus, dass die Tabellen und Funktionen aus den vorigen Schritten schon angelegt sind.
4. Registriere dein eigenes Konto über die App und bestätige ggf. die E-Mail.
5. Öffne Authentication → Users und kopiere die Konto-E-Mail. Führe danach den auskommentierten Admin-Bootstrap aus dem SQL-Skript separat aus, nachdem du deine E-Mail eingesetzt hast. Nur dein eigenes Konto zum Admin machen.
6. Für neue Teilnehmer: Sie wählen in der App „Zugang anfordern“. Nach Registrierung und ggf. E-Mail-Bestätigung erscheint das Profil unter Table Editor → `app_profiles`. Setze bei der passenden Zeile `approved` auf `true` und speichere. Damit erhält der Teilnehmer Zugriff auf die gemeinsame Anwesenheitsliste.
7. Lade diese Dateien zu GitHub Pages hoch.

## Speichern / Aktualisieren
- `Speichern` schreibt Teilnehmer und alle im lokalen Browser gespeicherten Monats-Tage in Supabase.
- `Aktualisieren` lädt Teilnehmer und Anwesenheitstage aus Supabase und aktualisiert die Anzeige.
- Die erste Synchronisierung: Auf dem Gerät mit den bisherigen lokalen Daten anmelden und einmal `Speichern` drücken, um diese Daten hochzuladen.

## Hinweise
- Der Publishable-Key ist im Frontend vorgesehen; die Datenbank wird durch Row Level Security geschützt.
- Alle freigegebenen Nutzer dürfen alle Anwesenheitsdaten sehen und bearbeiten – entsprechend deiner Vorgabe.
- Die Daten aus einem Browser werden nicht automatisch hochgeladen, bevor du dich anmeldest und `Speichern` verwendest.
- Die Datenbank speichert Anwesenheit pro Teilnehmer und Datum. Einstellungen für Stunden/Quote verbleiben vorerst lokal im Browser.


## Handy / Startbildschirm
Nach Veröffentlichung über HTTPS: Android (Chrome): Menü → „Installieren“ oder „Zum Startbildschirm hinzufügen“. iPhone (Safari): Teilen → „Zum Home-Bildschirm“. Die App-Oberfläche wird zwischengespeichert; Supabase-Daten benötigen weiterhin Internet.
