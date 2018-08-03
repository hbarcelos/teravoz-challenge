export default ({ type, their_number, ...rest }) => ({
  type,
  timestamp: new Date(),
  their_number,
  code: '123456',
  ...rest
})

export const type = {
  NEW: 'call.new',
  STANDBY: 'call.standby',
  WAITING: 'call.waiting',
  ONGOING: 'call.ongoing',
  FINISHED: 'call.finished'
}
