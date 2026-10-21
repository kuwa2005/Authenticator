# Authenticator

[日本語](README.md)

<img align="right" width="100" height="100" src="https://github.com/kuwa2005/Authenticator/raw/main/images/icon.svg">

> Authenticator generates 2-Step Verification codes in your browser.

Japanese is the primary language for this repository. This file is the English copy.

## This repository

`kuwa2005/Authenticator` is the maintained fork. The upstream repository [Authenticator-Extension/Authenticator](https://github.com/Authenticator-Extension/Authenticator) is not the target for bug reports, features, or releases. This fork does not open pull requests against upstream.

Use this repository for:

- bug reports
- security reports
- feature requests
- release tracking

## Release tags

Fork releases use:

`fork-v<major>.<minor>.<patch>`

Example: `fork-v8.0.3`

- Tags are created only from `main`, after validation.
- A security-only release may increment the patch number (for example, `fork-v8.0.4`).
- Release notes should summarize fork-specific changes and security-impacting fixes.

## Store editions

Chrome, Firefox, and Microsoft Edge listings below are the upstream store editions. They are separate from a development build of this fork.

[<img src="https://raw.githubusercontent.com/wiki/Authenticator-Extension/Authenticator/readme-images/chrome-web-store.png" title="Chrome Web Store" width="170" height="48" />](https://chrome.google.com/webstore/detail/authenticator/bhghoamapcdpbohphigoooaddinpkbai) [<img src="https://raw.githubusercontent.com/wiki/Authenticator-Extension/Authenticator/readme-images/firefox-add-ons.png" title="Firefox Add-ons" width="170" height="48" />](https://addons.mozilla.org/en-US/firefox/addon/auth-helper?src=external-github) [<img src="https://raw.githubusercontent.com/wiki/Authenticator-Extension/Authenticator/readme-images/microsoft-store.png" title="Microsoft Store" height="48">](https://microsoftedge.microsoft.com/addons/detail/ocglkepbibnalbgmbachknglpdipeoio)

### Safari edition

A Safari edition is on the App Store. This fork does not officially support it.

[<img width="150" alt="Download on the App Store" src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"/>](https://apps.apple.com/us/app/authen/id1602945200?mt=12)

## Load in Chrome

The repository root has no `manifest.json`. Chrome only reads `manifest.json` in the folder you select. Loading the source tree reports that the manifest file is missing or unreadable.

Load the built `chrome/` directory.

```bash
npm install
npm run chrome
```

Then in Chrome:

1. Open `chrome://extensions`
2. Turn on Developer mode
3. Click **Load unpacked**
4. Select this repository's `chrome` directory (the folder that contains `manifest.json`)

If you built the extension in WSL, point Windows Chrome at the `chrome` folder inside WSL.

To rebuild JavaScript while developing:

```bash
npm run dev:chrome
```

Reload the extension on `chrome://extensions` after webpack writes new output.

TOTP works without API keys. Drive, Dropbox, and OneDrive backup need keys in `src/models/credentials.ts`.

## Build

```bash
npm install
npm run chrome    # ./chrome
npm run firefox   # ./firefox
npm run edge      # ./edge
npm run prod      # ./release/{chrome,firefox,edge}
```

To reproduce a build:

```bash
npm ci
npm run prod
```

For a Safari build, follow [Authenticator-Extension/Authen](https://github.com/Authenticator-Extension/Authen#how-to-contribute).

On Windows, build from [Git Bash](https://git-scm.com/download/win) or [Cygwin](http://cygwin.com/).

## Acknowledgment

Thanks to Laurent, Chief Information Security Officer of the University of Luxembourg, and to the university information security team. Their recommendations during development helped identify and address vulnerabilities in this project.
