// lib/db.ts
// Local-first database using Dexie (IndexedDB wrapper).
// This is where all student work lives on the device.
// Everything here is available offline, 100% of the time.

import Dexie, { type Table } from 'dexie'
import { AuthUser } from '@/lib/utils/roles'

// ── Types ────────────────────────────────────────────────────────────────────

export interface CachedSession {
  id: 'current'                // singleton row
  user: AuthUser
  accessToken: string
  cachedAt: string
}


// ── Database ─────────────────────────────────────────────────────────────────

class HammetDB extends Dexie {
  session!:          Table<CachedSession>

  constructor() {
    super('hammet-db')

    this.version(1).stores({
      session:          'id',
    })
  }
}

export const db = new HammetDB()

// ── Session cache helpers ─────────────────────────────────────────────────────

/**
 * Persist the authenticated session to IndexedDB.
 * Call this after every successful refresh or login so the student
 * can be recognised offline without a network round-trip.
 */
export async function persistSession(user: AuthUser, accessToken: string): Promise<void> {
  try {
    await db.session.put({
      id: 'current',
      user,
      accessToken,
      cachedAt: new Date().toISOString(),
    })
  } catch {
    // best-effort — never throw
  }
}

/**
 * Read the most recently persisted session.
 * Returns null if nothing is cached or the DB read fails.
 */
export async function getPersistedSession(): Promise<CachedSession | null> {
  try {
    return (await db.session.get('current')) ?? null
  } catch {
    return null
  }
}

/**
 * Wipe the session cache on explicit logout.
 */
export async function clearPersistedSession(): Promise<void> {
  try {
    await db.session.delete('current')
  } catch {
    // best-effort
  }
}