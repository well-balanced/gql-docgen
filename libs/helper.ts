import { FieldType } from '@types'

export function extractRequestExample(desc: string) {
  const REQUEST_EXAMPLE_REGEX = /@req\n([\s]*?)```([\s\S]*?)```([\n]*?)/g
  const matched = desc?.match(REQUEST_EXAMPLE_REGEX)?.[0]
  const formatted =
    matched
      ?.split('@req')
      ?.at(-1)
      .split('```')
      .map((s) => s.trim())
      .join('\n```') || ''
  return formatted
}

export function extractResponseExample(desc: string) {
  const RESPONSE_EXAMPLE_REGEX = /@res\n([\s]*?)```([\s\S]*?)```([\n]*?)/g
  const matched = desc?.match(RESPONSE_EXAMPLE_REGEX)?.[0]
  const formatted =
    matched
      ?.split('@res')
      ?.at(-1)
      .split('```')
      .map((s) => s.trim())
      .join('\n```') || ''
  return formatted
}

export function extractDescription(desc: string) {
  const DESCRIPTION_REGEX = /@desc([\s\S]*?)\n/g
  const matched = desc?.match(DESCRIPTION_REGEX)?.[0]
  const formatted = matched?.split('@desc')?.at(-1).trim()
  return formatted ? formatted + '\n' : '\n'
}

export function formatType(type: FieldType) {
  if (type.kind === 'NON_NULL') return `${formatType(type.ofType)}!`
  if (type.kind === 'LIST') return `[${formatType(type.ofType)}]`
  if (type.ofType) return formatType(type.ofType)
  return type.name
}

export function extractOriginType(type: FieldType): FieldType {
  return type.ofType ? extractOriginType(type.ofType) : type
}
