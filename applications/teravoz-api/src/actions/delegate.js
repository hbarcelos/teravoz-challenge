export default async function delegate(payload) {
  console.log('Got delegate event:', payload)
  console.log(`Delegating call ${payload.call_id} to ${payload.destination}`)
}
