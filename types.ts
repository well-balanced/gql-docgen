import { ParsedArgs } from 'minimist'

export interface GqlMdxOptions extends ParsedArgs {
  title?: string
  headers?: Headers
}

export interface Headers {
  [k: string]: string
}

export interface GraphQLSchema {
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
  fields: GraphQLField[]
  inputFields: any
  enumValues: any
  interfaces: any
  possibleTypes: any
}

export interface GraphQLField {
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
  queries: GraphQLField[]
  mutations: GraphQLField[]
  subscriptions: GraphQLField[]
  objects: GraphQLType[]
}
