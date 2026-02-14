import { log } from "./logger"

export function safeCreateHook<T>(name: string, factory: () => T, fallback: T): T
export function safeCreateHook<T>(name: string, factory: () => T, fallback?: T | null): T | null
export function safeCreateHook<T>(name: string, factory: () => T, fallback?: T | null): T | null {
  try {
    return factory()
  } catch (error) {
    log("[hook] create failed", {
      hook: name,
      error: error instanceof Error ? error.message : String(error),
    })
    return fallback ?? null
  }
}
