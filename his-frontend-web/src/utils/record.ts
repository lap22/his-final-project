export type UnknownRecord = Record<string, unknown>

export function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function asRecordArray(value: unknown): UnknownRecord[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(isRecord)
}

export function getStringValue(
  record: UnknownRecord,
  keys: readonly string[],
  fallback = '-',
): string {
  for (const key of keys) {
    const value = record[key]

    if (typeof value === 'string' && value.trim()) {
      return value
    }

    if (typeof value === 'number') {
      return String(value)
    }
  }

  return fallback
}

export function getNestedRecord(
  record: UnknownRecord,
  keys: readonly string[],
): UnknownRecord | null {
  for (const key of keys) {
    const value = record[key]

    if (isRecord(value)) {
      return value
    }
  }

  return null
}
