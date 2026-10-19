// Schrijft source.json: de SideStore-bron voor de build die net gemaakt is. Eén keer toevoegen in SideStore
// (Sources → +) en elke nieuwe build verschijnt daar als Update. Zelfde opzet als Uurwerk en Pixel Quest.
//   RUN=<github run number> MESSAGE=<commit message> node sidestore-source.mjs <ipa>
import { statSync, writeFileSync } from 'node:fs'

const [ipa] = process.argv.slice(2)
const run = process.env.RUN ?? '0'
const note = (process.env.MESSAGE ?? '').split('\n')[0] || 'Nieuwe build.'
const repo = 'https://github.com/hiddepepijn-work/reisbouwer-ios'

const source = {
  name: 'Reisbouwer',
  identifier: 'nl.reisbouwer.app.source',
  subtitle: 'Plan je reis op de kaart',
  apps: [
    {
      name: 'Reisbouwer',
      bundleIdentifier: 'nl.reisbouwer.app',
      developerName: 'Hidde',
      subtitle: 'Plan je reis op de kaart',
      localizedDescription: 'Reisbouwer op je iPhone: dezelfde reisplanner als reisbouwer.nl, met je reizen van de server.',
      iconURL: 'https://raw.githubusercontent.com/hiddepepijn-work/reisbouwer-ios/main/resources/icon-ios.png',
      tintColor: '0F7566',
      versions: [
        {
          // Dezelfde nummers die de workflow in Info.plist zet.
          version: `1.0.${run}`,
          buildVersion: run,
          date: new Date().toISOString(),
          localizedDescription: note,
          downloadURL: `${repo}/releases/download/ios-latest/Reisbouwer.ipa`,
          size: statSync(ipa).size,
          minOSVersion: '15.0'
        }
      ],
      appPermissions: { entitlements: [], privacy: {} }
    }
  ],
  news: []
}

writeFileSync('source.json', JSON.stringify(source, null, 2))
console.log(`source.json voor 1.0.${run}`)
