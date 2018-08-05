import events from './events.enum'
import redirect from './actions/redirect'
import { repository } from '../customers'
import service from './service'

const actionMap = {
  [events.STANDBY]: redirect({ repository, service })
}

export default async function callEventReducer(callEvent) {
  if (actionMap[callEvent.type]) {
    return actionMap[callEvent.type](callEvent)
  }
}
