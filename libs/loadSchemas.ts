import axios from 'axios'
import {
  getIntrospectionQuery,
  buildSchema,
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql'
import fs from 'fs/promises'
import {
  GqlMdxOptions,
  JsonGraphQLSchema,
  Headers,
  JsonGraphQLSchemaMap,
} from '@types'
import { readdirRecursive, getFulfilledResult } from '../utils'
import { capitalize } from 'lodash'

const DEFAULT_TITLE = 'GraphQL API Docuemnts'

export async function loadSchemas(
  path: string,
  { headers, title }: GqlMdxOptions
): Promise<JsonGraphQLSchemaMap> {
  if (path.includes('//')) {
    const schema = await fetchSchema(path, headers)
    return schema && { [title || DEFAULT_TITLE]: schema }
  }

  if (path.includes('.graphql') || path.includes('.gql')) {
    return await readSchema(path)
  }

  const stat = await fs.stat(path)
  if (!stat.isDirectory()) {
    throw new Error('unsupported file extension')
  }

  const paths = await readdirRecursive(path)
  return getFulfilledResult(
    await Promise.allSettled(
      paths
        .filter((path) => path.includes('.graphql') || path.includes('.gql'))
        .map((path) => readSchema(path))
    )
  ).reduce((prev, curr) => ({ ...prev, ...curr }))
}

async function schemaToJson(
  schema: GraphQLSchema,
  title: string
): Promise<JsonGraphQLSchemaMap> {
  const config = schema.toConfig()
  if (!config.query) {
    /**
     * Add default query to avoid GraphQLError
     */
    config.query = new GraphQLObjectType({
      name: 'Query',
      fields: {},
    })
    schema = new GraphQLSchema(config)
  }

  const json = await graphql({
    schema,
    source: getIntrospectionQuery(),
  })
  return { [title]: json.data?.__schema as JsonGraphQLSchema }
}

async function fetchSchema(url: string, headers: Headers) {
  const { data } = await axios.post<{ data: { __schema: JsonGraphQLSchema } }>(
    url,
    { query: getIntrospectionQuery() },
    { headers: { 'Content-Type': 'application/json', ...headers } }
  )
  return data?.data?.__schema
}

async function readSchema(path: string, title?: string) {
  const defaultTitle = capitalize(path.split('/').at(-1).split('.')[0])
  const data = await fs.readFile(path, 'utf-8')
  return schemaToJson(
    buildSchema(data, { assumeValid: true, assumeValidSDL: true }),
    title || defaultTitle
  )
}
