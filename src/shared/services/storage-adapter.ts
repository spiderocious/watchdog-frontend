const STORAGE_PREFIX = 'watchdog_'

function prefixKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`
}

export const storageAdapter = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(prefixKey(key))
      if (raw === null) return null
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(prefixKey(key), JSON.stringify(value))
    } catch {
      console.error(`Failed to save to storage: ${key}`)
    }
  },

  remove(key: string): void {
    localStorage.removeItem(prefixKey(key))
  },

  clear(): void {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  },
}
