import axios from 'axios'
import { getIntrospectionQuery, buildSchema, graphql } from 'graphql'
import fs from 'fs/promises'
import { GqlMdxOptions, GraphQLSchema, Headers } from '@types'

export async function loadSchema(path: string, { headers }: GqlMdxOptions) {
  if (path.includes('//')) {
    return await fetchSchema(path, headers)
  }

  if (path.includes('.graphql') || path.includes('.gql')) {
    const schema = await readSchema(path)
    return await schemaToJson(schema)
  }
}

async function fetchSchema(url: string, headers: Headers) {
  const { data } = await axios.post<{ data: { __schema: GraphQLSchema } }>(
    url,
    { query: getIntrospectionQuery() },
    { headers: { 'Content-Type': 'application/json', ...headers } }
  )
  return data?.data?.__schema
}

async function readSchema(path: string) {
  const data = await fs.readFile(path, 'utf-8')
  return buildSchema(data)
}

async function schemaToJson(schema: any): Promise<GraphQLSchema> {
  const json = await graphql({
    schema,
    source: getIntrospectionQuery(),
  })
  return json.data?.__schema as GraphQLSchema
}
