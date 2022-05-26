import parse from 'minimist'
import { GqlMdxOptions } from '@types'

function isValidOptionKey(key: string): boolean {
  return ['title', 'headers', 'version'].includes(key)
}

function validateOptions(args: any): args is GqlMdxOptions {
  const disallowedKeys = ['_', '--']
  return Object.keys(args)
    .filter((arg) => !disallowedKeys.includes(arg))
    .every(isValidOptionKey)
}

function parseHeader(header: string | undefined): { [k: string]: string } {
  if (typeof header !== 'string') return {}
  return header.split(',').reduce((prev, curr) => {
    const [k, v] = curr.split('=')
    return { ...prev, [k]: v }
  }, {})
}

export function parseArgs(args: string[]): GqlMdxOptions {
  const preParsed = parse(args)
  const headers = parseHeader(preParsed?.headers)
  if (!validateOptions(preParsed)) throw new Error('unsupported option')
  return { ...preParsed, headers }
}
