# Hyttecal

Automatisk kalender som viser når hytta er opptatt, basert på [finn.no-annonsen](https://www.finn.no/reise/feriehus-hytteutleie/ad.html?finnkode=244033792&ci=2).

Kalenderen oppdateres automatisk hver natt via GitHub Actions og publiseres som en `.ics`-fil du kan abonnere på.

## Abonner på kalenderen

Etter at GitHub Pages er aktivert (se oppsett nedenfor), vil kalender-URLen være:

```
https://<ditt-brukernavn>.github.io/hyttecal/hyttecal.ics
```

### Apple Kalender
1. Åpne **Kalender** → **Fil** → **Nytt kalenderabonnement...**
2. Lim inn URL-en og klikk **Abonner**
3. Sett oppdateringsfrekvens til **Hvert 5. minutt** eller **Hver time**

### Google Kalender
1. Klikk **+** ved siden av "Andre kalendere" → **Fra URL**
2. Lim inn URL-en og klikk **Legg til kalender**
> ⚠️ Google Kalender oppdaterer abonnerte kalendere kun ca. én gang i døgnet – dette er en Google-begrensning.

### Thunderbird
1. Høyreklikk på kalenderlisten → **Ny kalender** → **På nettet**
2. Lim inn URL-en

---

## Oppsett

### 1. Aktiver GitHub Pages

1. Gå til **Settings** → **Pages** i dette repositoriet
2. Under **Source**, velg **Deploy from a branch**
3. Velg branch `main` og mappen `/calendar`
4. Klikk **Save**

Etter noen minutter vil kalenderfilen være tilgjengelig på URL-en over.

### 2. Kjør manuelt (valgfritt)

Du kan trigge en synkronisering manuelt under **Actions** → **Synkroniser hyttecal** → **Run workflow**.

---

## Teknisk

| | |
|---|---|
| Språk | TypeScript |
| Pakkebehandler | pnpm |
| Skraping | Playwright (headless Chromium) |
| Kalenderformat | iCal (`.ics`) |
| Automatisering | GitHub Actions (nightly cron) |
| Hosting | GitHub Pages |

Kalenderfilen genereres i `calendar/hyttecal.ics` og committes automatisk ved endringer.
