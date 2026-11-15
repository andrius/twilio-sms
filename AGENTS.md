# CLAUDE.md

## Overview

React web app for interacting with Twilio SMS - login with Twilio credentials,
browse SMS conversations in a threaded view, and send new messages. A demo
(live at https://andrius.mobi/twilio-sms/), not production-hardened. Own project.

## Tech stack

- React (Create React App / `react-scripts`), TypeScript (`src/index.tsx`).
- Bootstrap for styling, Axios for Twilio API calls.

## Commands

- `npm install`
- `npm start` - dev server.
- `npm run build` - production build.
- `npm test` - CRA test runner.

## Notes

- `.env` holds local config; never commit real Twilio credentials.
- Static build is deployed under a subpath (`homepage: "."` in package.json).
