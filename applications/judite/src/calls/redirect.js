import { store } from '../customers'
import service from './service'
import events from './events'

const destinations = {
  NEW: '900',
  RETURNING: '901'
}

export default async function redirect(incommingCall) {
  if (incommingCall.type === events.STANDBY) {
    const phoneNumber = incommingCall.their_number
    const customer = await store.find(phoneNumber)

    const destination = customer ? destinations.RETURNING : destinations.NEW

    if (!customer) {
      console.log(`New customer: ${phoneNumber}`)
      await store.insert({ phoneNumber })
    } else {
      console.log(`Returning customer: ${phoneNumber}`)
    }

    await service.delegate(incommingCall, destination)
  }
}
