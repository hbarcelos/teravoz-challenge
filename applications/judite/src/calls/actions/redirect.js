export const destinations = {
  NEW: '900',
  RETURNING: '901'
}

// redirect :: { repository, service } -> incommingCall -> void
export default function redirect({ repository, service }) {
  return async incommingCall => {
    const phoneNumber = incommingCall.their_number
    const customer = await repository.find(phoneNumber)

    const destination = customer ? destinations.RETURNING : destinations.NEW

    if (!customer) {
      console.log(`New customer: ${phoneNumber}`)
      await repository.insert({ phoneNumber })
    } else {
      console.log(`Returning customer: ${phoneNumber}`)
    }

    await service.delegate(incommingCall, destination)
  }
}
