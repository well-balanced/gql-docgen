import { ParsedArgs } from 'minimist'

export interface GqlMdxOptions extends ParsedArgs {
  title?: string
  headers?: Headers
}

export interface Headers {
  [k: string]: string
}

export interface JsonGraphQLSchemaMap {
  [key: string]: JsonGraphQLSchema
}

export interface JsonGraphQLSchema {
  queryType: any
  mutationType: any
  subscriptionType: any
  types: GraphQLType[]
  directives: any[]
}

export interface GraphQLType {
  kind: string
  name: string
  description: string | null
  fields: GraphQLResolver[]
  inputFields: GraphQLResolver[]
  enumValues: EnumValue[]
  interfaces: any
  possibleTypes: FieldType[]
}

export interface GraphQLResolver {
  name: string
  description: string | null
  args: FieldArgument[]
  type: FieldType
  isDeprecated: boolean
  deprecationReason: string | null
}

export interface FieldArgument {
  name: string
  description: string | null
  type: FieldType
  defaultValue: string | null
}
export interface FieldType {
  kind: string
  name: string
  ofType: any
}

export interface ClassifiedType {
  queries: GraphQLResolver[]
  mutations: GraphQLResolver[]
  subscriptions: GraphQLResolver[]
  objects: GraphQLType[]
  inputs: GraphQLType[]
  enums: GraphQLType[]
  scalars: GraphQLType[]
  interfaces: GraphQLType[]
  unions: GraphQLType[]
}

export interface EnumValue {
  name: string
  description: string
  isDeprecated: boolean
  deprecationReason: string | null
}
