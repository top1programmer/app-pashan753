import { useCallback } from 'react'

export const useHttp = () => {
  const request = useCallback( async(url, method='POST', body = null, headers = {}) => {
    try{
      if(body){
        body = JSON.stringify(body)
      }
      headers['Content-Type'] = 'application/json'
      const response = await fetch(url, {method, body, headers})
      const data = await response.json()
      if(data)
      return data.result
    } catch(error) {throw error}
  }, [])
  return request
}
