import axios from 'axios'
import serializeError from 'serr'

const webhookConsumerUrl = process.env.WEBHOOK_CONSUMER_URL

export default async function sendEventsToWebhook(events$) {
  events$.subscribe(async payload => {
    console.log(`Sending event to ${webhookConsumerUrl}`, payload)

    try {
      await axios.post(webhookConsumerUrl, payload, { timeout: 5000 })
    } catch (err) {
      const {
        request,
        response,
        constructor,
        name,
        ...errorDetails
      } = serializeError(err).toObject()

      console.error(
        `Failed to send event to ${webhookConsumerUrl}`,
        errorDetails
      )
    }
  })
}
