# autoreply

This is an automated reply bot I made to answer frequent questions in my public community servers. It uses [Dialogflow](https://dialogflow.cloud.google.com/) to process messages and reply accordingly.

I wrote this after finding out that [jagrosh's Phoenix bot](https://github.com/jagrosh/Phoenix) (which does the same thing) was no longer maintained and used the now deprecated v1 version of the Dialogflow API

# Install

## Using docker

🔨 Coming soon!

## Building from source

- Clone the repository with
`git clone https://github.com/pedrofracassi/autoreply`

- Install the dependencies with `npm install`

- Build with `npm run build`

- Set the [environment variables](#environment-variables) (either by adding them to a `.env` on the project's root or through some other method)

- Put your [Google Credentials](#getting-iam-credentials-from-google-cloud) file in the project root and rename it to `google_credentials.json`

- Run it with `npm start`

# Environment variables

Variable | Description | Example
-|-|-
`DISCORD_TOKEN` | The bot's Discord token. You can obtain one [here](https://discord.dev). | `78JKgfsjhdgbsaklgf.sdrDg.JDFHKGHFDSGHghjgdsfjh`
`CHANNEL_IDS` | A comma-separated list of channel IDs where the bot should reply | `791874107137720342,799842616287690792`
`DEFAULT_FALLBACK_INTENT_NAME` | The Default Fallback intent to which downvoted messages will be added to | `projects/inhouse-jim9/agent/intents/2b39d9a2-45ba-47b2-b947-18300baa540c`

# Getting IAM credentials from Google Cloud

🔨 Coming Soon