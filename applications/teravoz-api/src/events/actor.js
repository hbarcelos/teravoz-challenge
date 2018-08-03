export default ({ actor, type, ...rest }) => ({
  type,
  actor,
  timestamp: new Date(),
  ...rest
})

export const type = {
  ENTERED: 'actor.entered',
  LEFT: 'actor.left'
}
