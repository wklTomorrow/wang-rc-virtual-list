import { useEffect } from 'react'
import { fn } from '../type'

export const useDeepEffect = (cb: fn, list: Array<unknown>) => {
  useEffect(cb, [JSON.stringify(list)])
}
