export const extensions = {
  NEW: '900',
  RETURNING: '901'
}

// delegate :: { repository, service } -> incommingCall -> void
export default function delegate({ repository, service }) {
  return async incommingCall => {
    const phoneNumber = incommingCall.their_number
    const customer = await repository.find(phoneNumber)

    const destination = customer ? extensions.RETURNING : extensions.NEW

    if (!customer) {
      console.log(`New customer: ${phoneNumber}`)
      await repository.insert({ phoneNumber })
    } else {
      console.log(`Returning customer: ${phoneNumber}`)
    }

    await service.delegate(incommingCall, destination)
  }
}
