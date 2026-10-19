# Reisbouwer voor de iPhone (schil)

Een dunne Capacitor-app die https://reisbouwer.nl laadt. Er zit zelf geen app-code in: elke
update van de site komt vanzelf in de app. Alleen een wijziging aan deze map (icoon, URL-schema,
plugins) vraagt een nieuwe .ipa. Zie `STAP8-IPHONE-APP.md` in de hoofdrepo voor de keuzes.

Deze map is bedoeld als de wortel van een **aparte, openbare repo** (`hiddepepijn-work/reisbouwer-ios`):
openbaar omdat dan de Actions-macOS-minuten gratis zijn en SideStore de release zonder inlog kan
ophalen. Er staat niets geheims in.

## Stappen voor de lead (na akkoord van Hidde)

1. Maak de repo (openbaar) en zet de inhoud van `ios-schil/` erin, met `.github/` en `.gitignore`:

   ```bash
   gh repo create hiddepepijn-work/reisbouwer-ios --public --description "iPhone-schil om reisbouwer.nl"
   cp -r ios-schil/. /pad/naar/reisbouwer-ios/      # zonder node_modules
   cd /pad/naar/reisbouwer-ios && rm -rf node_modules
   git init -b main && git add -A && git commit -m "Reisbouwer iPhone-schil"
   git remote add origin https://github.com/hiddepepijn-work/reisbouwer-ios.git && git push -u origin main
   ```

2. De workflow start bij de push (of: Actions, "Reisbouwer iPhone-app", Run workflow). Hij duurt
   ongeveer 10 minuten en maakt de release **ios-latest** met `Reisbouwer.ipa` en `source.json`.
3. Controleer: `gh release view ios-latest --repo hiddepepijn-work/reisbouwer-ios`.
4. De server moet de schil-wijzigingen hebben (branch `ios-app`): zonder `app-inwisselen` werkt
   Google in de app niet. Naam en wachtwoord werken ook zonder.

## Voor Hidde: installeren met SideStore

1. SideStore, tabblad Sources, plus, plak:
   `https://github.com/hiddepepijn-work/reisbouwer-ios/releases/download/ios-latest/source.json`
2. Tik Reisbouwer, Free, installeren. Updates: tabblad My Apps, Update (of Refresh).

## Wat er in zit

| Bestand | Waarvoor |
|---|---|
| `capacitor.config.json` | `server.url` = de site; `allowNavigation` alleen reisbouwer.nl (al het andere opent in Safari); `appendUserAgent: ReisbouwerApp/1` waaraan site en server de schil herkennen; `errorPath` = offline-pagina |
| `package.json` | alleen Capacitor core, ios, app (opvangen van `reisbouwer://`) en browser (systeembrowser voor Google) |
| `www/` | wordt in de app gepakt maar niet getoond: een lege pagina en `offline.html` voor als de server onbereikbaar is |
| `resources/icon-ios.png`, `splash.png` | icoon (1024) en startscherm; gemaakt door `npm run iconen` in de hoofdrepo |
| `sidestore-source.mjs` | schrijft `source.json` (zelfde formaat als Uurwerk en Pixel Quest) |
| `.github/workflows/ios.yml` | bouwt op macos-15: `cap add ios` elke run, icoon, Info.plist (naam, versie `1.0.<run>`, URL-schema `reisbouwer`), ongetekende .ipa, release |

## Inloggen met Google

Google weigert ingebedde webviews. De site ziet aan de user-agent dat hij in de schil draait en
opent Google dan in de systeembrowser (`/api/auth/google/start?doel=inloggen&app=1`). Na het
inloggen roept de server de app terug met `reisbouwer://google?code=<eenmalig, 60 s>`; de app
laat de webview die code inwisselen op `/api/auth/app-inwisselen`, waar de sessie als gewoon
koekje in de webview komt. Daarom staat het URL-schema `reisbouwer` in de Info.plist (zie de
workflow). Zie `packages/server/src/app-inwisselen.ts`.

## Niet mogelijk zonder betaald Apple-account

- Pushmeldingen (APNs) en Web Push in de webview. De meldingenkaart in de app zegt dat.
- Universal links (`https://reisbouwer.nl/...` die de app openen): daarvoor is een entitlement
  nodig. Het eigen schema `reisbouwer://` werkt wel.
- Delen naar de app vanuit TikTok (Share Extension): idem.
