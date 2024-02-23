'use client'

import { useState } from "react"

const useLocalStorage = (name: string, fallbackValue?: string) => {
  const [state, setState] = useState(() => {
    try {
      if (typeof window != "undefined") {
        const value = window.localStorage.getItem(name)
        return value ? JSON.parse(value) : fallbackValue 
      }
    } catch (error) {
      console.log(error)
    }

  })

  const setValue = (value: Function) => {
    try {
      if (typeof window != "undefined") {
        const valueToStore = value instanceof Function ? value(state) : value
        window.localStorage.setItem(name, JSON.stringify(valueToStore))
        setState(value)
      }
    } catch (error) {
      console.log(error)
    }

  }

  return [state, setValue]
}

export default useLocalStorage
