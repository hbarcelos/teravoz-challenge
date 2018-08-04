import Call, { type as callTypes } from './call'
import Actor, { type as actorTypes } from './actor'

const _Call = Object.assign(Call, callTypes)
const _Actor = Object.assign(Actor, actorTypes)

export { _Call as Call }
export { _Actor as Actor }
