import { Client } from "discord.js"
import dialogflow from "@google-cloud/dialogflow"
import uuid from "uuid"
import { randomUUID } from "crypto"

const fallbackIntent = process.env.DEFAULT_FALLBACK_INTENT_NAME!

class Main {
  client: Client
  channelIds: string[]

  constructor () {
    this.client = new Client({
      intents: [
        "GUILDS",
        "GUILD_MESSAGES"
      ]
    })

    this.channelIds = process.env.CHANNEL_IDS!.split(',')
  }

  async addPhraseToIntent (intentName: string, phrase: string) {
    const intents = new dialogflow.IntentsClient()
    const intent = await intents.getIntent({
      name: intentName,
      languageCode: 'pt-BR',
      intentView: 'INTENT_VIEW_FULL'
    })

    return intents.updateIntent({
      languageCode: 'pt-BR',
      intent: {
        ...intent[0]!,
        trainingPhrases: [
          {
            type: 'EXAMPLE',
            parts: [
              {
                text: phrase,
                userDefined: false
              }
            ]
          },
          ...intent[0].trainingPhrases!
        ]
      },
      intentView: 'INTENT_VIEW_FULL'
    })
  }

  init () {
    this.client.on('interactionCreate', async interaction => {
      if (interaction.isButton()) {
        interaction.deferUpdate()
        const replyMessage = await interaction.channel?.messages.fetch(interaction.message.id)
        const reference = await replyMessage?.channel.messages.fetch(replyMessage?.reference?.messageId!)
        switch (interaction.customId.split(':')[0]) {
          case 'upvote': {            
            this.addPhraseToIntent(interaction.customId.split(':')[1], reference?.cleanContent!)
            break
          }
          case 'downvote': {            
            this.addPhraseToIntent(fallbackIntent, reference?.cleanContent!)
            break
          }
        } 
        replyMessage?.edit({
          content: replyMessage.content,
          components: []
        })
      }
    })

    this.client.on("messageCreate", async message => {
      if (message.author.bot) return
      if (message.channel.isText() && this.channelIds.includes(message.channel.id)) {
        const sessionId = randomUUID()
        const sessionClient = new dialogflow.SessionsClient()
        const sessionPath = sessionClient.projectAgentSessionPath(
          'inhouse-jim9',
          sessionId
        )

        try {
          const responses = await sessionClient.detectIntent({
            session: sessionPath,
            queryInput: {
              text: {
                text: message.cleanContent,
                languageCode: 'pt-BR'
              }
            }
          })
  
          // console.log(responses[0].queryResult?.intent)
  
          if (responses.length > 0 && responses[0].queryResult?.intentDetectionConfidence! > 0.7 && responses[0].queryResult?.fulfillmentText !== '') {
            message.reply({
              content: [
                responses[0].queryResult?.fulfillmentText!,
                `_Confiança da resposta: ${Math.round(responses[0].queryResult?.intentDetectionConfidence! * 100)}%_`
              ].join(`\n`),
              components: [
                {
                  type: 'ACTION_ROW',
                  components: [
                    {
                      type: 'BUTTON',
                      label: '👍',
                      customId: `upvote:${responses[0].queryResult?.intent?.name}`,
                      style: 'SECONDARY'
                    },
                    {
                      type: 'BUTTON',
                      label: '👎',
                      customId: `downvote`,
                      style: 'SECONDARY'
                    }
                  ]
                }
              ]
            })
          }
        } catch (e) {
        }
      }
    })

    this.client.login(process.env.DISCORD_TOKEN)
  }
}

export default Main