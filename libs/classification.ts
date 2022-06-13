import { JsonGraphQLSchema, ClassifiedType, JsonGraphQLSchemaMap } from '@types'
import { sortBy } from 'lodash'

export function classifyAllByType(
  schemaMap: JsonGraphQLSchemaMap
): ClassifiedType {
  return Object.values(schemaMap).reduce(
    (prev, schema) => {
      const classified = classifyByType(schema)
      return {
        queries: [...prev?.queries, ...classified?.queries],
        mutations: [...prev?.mutations, ...classified?.mutations],
        subscriptions: [...prev?.subscriptions, ...classified?.subscriptions],
        objects: [...prev?.objects, ...classified?.objects],
        inputs: [...prev?.inputs, ...classified?.inputs],
        enums: [...prev?.enums, ...classified?.enums],
        scalars: [...prev?.scalars, ...classified?.scalars],
        interfaces: [...prev?.interfaces, ...classified?.interfaces],
        unions: [...prev?.unions, ...classified?.unions],
      }
    },
    {
      queries: [],
      mutations: [],
      subscriptions: [],
      objects: [],
      inputs: [],
      enums: [],
      scalars: [],
      interfaces: [],
      unions: [],
    } as ClassifiedType
  )
}

export function classifyByType(schema: JsonGraphQLSchema): ClassifiedType {
  const initialValue = {
    queries: [],
    mutations: [],
    subscriptions: [],
    objects: [],
    inputs: [],
    enums: [],
    scalars: [],
    interfaces: [],
    unions: [],
  }
  return (
    sortBy(schema.types, ['name'])
      .filter((type) => !type.name.includes('__'))
      // .filter((type) => !defaultScalars.includes(type.name))
      .reduce((prev, curr) => {
        const isResolver = ['Query', 'Mutation', 'Subscription'].includes(
          curr.name
        )
        return {
          ...prev,
          ...(curr.name === 'Query' && {
            queries: [...prev.queries, ...curr.fields],
          }),
          ...(curr.name === 'Mutation' && {
            mutations: [...prev.mutations, ...curr.fields],
          }),
          ...(curr.name === 'Subscription' && {
            subscriptions: [...prev.subscriptions, ...curr.fields],
          }),
          ...(!isResolver &&
            curr.kind === 'OBJECT' && { objects: [...prev.objects, curr] }),
          ...(curr.kind === 'INPUT_OBJECT' && {
            inputs: [...prev.inputs, curr],
          }),
          ...(curr.kind === 'ENUM' && { enums: [...prev.enums, curr] }),
          ...(curr.kind === 'SCALAR' && { scalars: [...prev.scalars, curr] }),
          ...(curr.kind === 'INTERFACE' && {
            interfaces: [...prev.interfaces, curr],
          }),
          ...(curr.kind === 'UNION' && { unions: [...prev.unions, curr] }),
        }
      }, initialValue)
  )
}
