import { GraphQLSchema, ClassifiedType } from '@types'
import { sortBy } from 'lodash'

export function schemaToMdx(schema: GraphQLSchema) {
  const classified = classifyByType(schema)
  console.log(classified.objects[0].fields)
}

function classifyByType(schema: GraphQLSchema): ClassifiedType {
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
  const defaultScalars = ['Boolean', 'ID', 'String']
  return sortBy(schema.types, ['name'])
    .filter((type) => !type.name.includes('__'))
    .filter((type) => !defaultScalars.includes(type.name))
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
          subscriptions: [...prev.mutations, ...curr.fields],
        }),
        ...(!isResolver &&
          curr.kind === 'OBJECT' && { objects: [...prev.objects, curr] }),
        ...(curr.kind === 'INPUT_OBJECT' && { inputs: [...prev.inputs, curr] }),
        ...(curr.kind === 'ENUM' && { enums: [...prev.enums, curr] }),
        ...(curr.kind === 'SCALAR' && { scalars: [...prev.scalars, curr] }),
        ...(curr.kind === 'INTERFACE' && {
          interfaces: [...prev.interfaces, curr],
        }),
        ...(curr.kind === 'UNION' && { unions: [...prev.unions, curr] }),
      }
    }, initialValue)
}
