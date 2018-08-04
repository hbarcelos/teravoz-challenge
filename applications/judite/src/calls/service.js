import axios from 'axios'

const callDelegateUrl = process.env.CALL_DELEGATE_URL

export default {
  async delegate(incommingCall, destination) {
    const data = {
      type: 'delegate',
      call_id: incommingCall.call_id,
      destination
    }

    return axios.post(callDelegateUrl, data, { timeout: 5000 })
  }
}
