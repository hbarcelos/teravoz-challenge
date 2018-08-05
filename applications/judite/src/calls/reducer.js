import events from './events.enum'
import delegate from './actions/delegate'
import { repository } from '../customers'
import service from './service'

const actionMap = {
  [events.STANDBY]: delegate({ repository, service })
}

export default async function callEventReducer(callEvent) {
  if (actionMap[callEvent.type]) {
    return actionMap[callEvent.type](callEvent)
  }
}
