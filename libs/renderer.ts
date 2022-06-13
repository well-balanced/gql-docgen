import {
  GraphQLResolver,
  FieldArgument,
  FieldType,
  GraphQLType,
  ClassifiedType,
  EnumValue,
} from '@types'
import {
  extractDescription,
  extractOriginType,
  extractRequestExample,
  extractResponseExample,
  formatType,
} from './helper'
import { SchemaManager } from './schemaManager'

export class MarkdownRenderer {
  constructor(private schemaManager: SchemaManager) {}

  renderDocument = (typeMap: ClassifiedType, title: string) => {
    const titleBlock = `---\ntitle: ${title}\n---`
    const content = [
      titleBlock,
      this.renderQueryParagraph(typeMap.queries),
      this.renderMutationParagraph(typeMap.mutations),
      this.renderSubscriptionParagraph(typeMap.subscriptions),
      this.renderObjectParagraph(typeMap.objects),
      this.renderInputParagraph(typeMap.inputs),
      this.renderEnumParagraph(typeMap.enums),
      this.renderInterfaceParagraph(typeMap.interfaces),
      this.renderUnionParagraph(typeMap.unions),
      this.renderScalarParagraph(typeMap.scalars),
    ].join('\n')
    return this.formatMdx(content)
  }

  formatMdx = (content: string) => {
    return content
      .split('\n')
      .reduce(
        /**
         * skip if there are code blocks
         */
        ({ result, skip }, line) =>
          line.includes('```')
            ? { result: [...result, line], skip: !skip }
            : { result: [...result, skip ? line : line.trim()], skip },
        { result: [], skip: false }
      )
      .result.join('\n')
  }

  renderQueryParagraph = (queries: GraphQLResolver[]) => {
    if (!queries.length) return ''
    return `
    ## Query
    ${queries.map(this._renderResolver).join('\n')}
    `
  }

  renderMutationParagraph = (mutations: GraphQLResolver[]) => {
    if (!mutations.length) return ''
    return `
    ## Mutation
    ${mutations.map(this._renderResolver).join('\n')}
    `
  }

  renderObjectParagraph = (objects: GraphQLType[]) => {
    if (!objects.length) return ''
    return `
    ## Object
    ${objects.map(this._renderObject).join('\n')}
    `
  }

  renderSubscriptionParagraph = (subscriptions: GraphQLResolver[]) => {
    if (!subscriptions.length) return ''
    return `
    ## Subscription
    ${subscriptions.map(this._renderResolver).join('\n')}
    `
  }

  renderInputParagraph = (inputs: GraphQLType[]) => {
    if (!inputs.length) return ''
    return `
    ## Input
    ${inputs.map(this._renderInput).join('\n')}
    `
  }

  _renderInput = (input: GraphQLType) => {
    return `
    ### ${input.name}
    ${input.description || ''}
    ${this._renderFieldTable(input.inputFields)}
    `
  }

  renderEnumParagraph = (enums: GraphQLType[]) => {
    if (!enums.length) return ''
    return `
    ## Enum
    ${enums.map(this._renderEnum).join('\n')}
    `
  }

  _renderEnum = (enumeration: GraphQLType) => {
    return `
    ### ${enumeration.name}
    ${enumeration.description || ''}
    ${this._renderEnumValueTable(enumeration.enumValues)}
    `
  }

  _renderEnumValueTable = (enumValues: EnumValue[]) => {
    return `
    <table>
      <thead>
        <tr>
          <th align="left">Name</th>
          <th align="left">Description</th>
        </tr>
      </thead>
      <tbody>${enumValues.map(this._renderEnumValue).join('\n')}</tbody>
    </table>`
  }

  _renderEnumValue = (enumValue: EnumValue) => {
    return `
    <tr>
      <td>${enumValue.name}</td>
      <td>${enumValue.description}</td>
    </tr>
      `
  }

  renderScalarParagraph = (scalars: GraphQLType[]) => {
    return `
    ## Scalar
    ${scalars.map(this._renderScalar).join('\n')}
    `
  }

  _renderScalar = (scalar: GraphQLType) => {
    return `
    ### ${scalar.name}
    ${scalar.description}
    `
  }

  renderInterfaceParagraph = (interfaces: GraphQLType[]) => {
    if (!interfaces.length) return ''
    return `
    ## Interface
    ${interfaces.map(this._renderInterface)}
    `
  }

  _renderInterface = (interfaceType: GraphQLType) => {
    return `
    ### ${interfaceType.name}
    ${interfaceType.description || ''}
    ${this._renderFieldTable(interfaceType.fields)}`
  }

  renderUnionParagraph = (unions: GraphQLType[]) => {
    if (!unions.length) return ''
    return `
    ## Union
    ${unions.map(this._renderUnion).join('\n')}
    `
  }

  _renderUnion = (union: GraphQLType) => {
    return `
    ### ${union.name}
    ${union.description || ''}
    ${this._renderUnionTable(union.possibleTypes)}
    `
  }

  _renderUnionTable = (possibleTypes: FieldType[]) => {
    return `
    <table>
    <thead>
        <tr>
          <th align="left">Possible Type</th>
        </tr>
    </thead>
    <tbody>${possibleTypes.map(this._renderPossibleType).join('\n')}</tbody>
  </table>
  `
  }

  _renderPossibleType = (possibleType: FieldType) => {
    return `
    <tr>
      <td>
        <a href="#${possibleType.name.toLowerCase()}">${possibleType.name}</a>
      </td>
    </tr>
    `
  }

  private _renderPayloadTable = (payload: FieldType) => {
    const origin = extractOriginType(payload)
    const isScalar = origin.kind === 'SCALAR'
    return `
    ${
      !isScalar
        ? `
        ${this._renderFieldTable(
          this.schemaManager.findObjectByName(origin.name).fields
        )}`
        : `<table>
        <thead>
          <tr>
            <th align="left">Type</th>
            <th align="left">Require</th>
          </tr>
        </thead>
        <tbody>${this._renderPayload(payload)}</tbody>
      </table>\n`
    }
    `
  }

  private _renderResolver = (resolver: GraphQLResolver) => {
    const reqExam = extractRequestExample(resolver.description)
    const resExam = extractResponseExample(resolver.description)
    const desc = extractDescription(resolver.description)
    return `
    ### ${resolver.name}
    ${desc}
      
    ${reqExam && '<strong style="font-size: 14px;">Request</strong>\n'}
    ${reqExam}
    
    ${resExam && '<strong style="font-size: 14px;">Response</strong>\n'}
    ${resExam}
    
    ${
      resolver.args.length
        ? '<strong style="font-size: 14px;">Arguments</strong>\n'
        : ''
    }
    ${resolver.args.length ? this._renderArgumentTable(resolver.args) : ''}
    
    ${
      resolver.type ? '<strong style="font-size: 14px;">Returns</strong>\n' : ''
    }
    ${resolver.type ? this._renderPayloadTable(resolver.type) : ''}
    `
  }

  private _renderArgument = (arg: FieldArgument) => {
    return `      
    <tr>
      <td>${arg.name}</td>
      <td>
        <a href="#${arg.type.ofType.name.toLowerCase()}">${
      arg.type.ofType.name
    }</a>
      </td>
      <td>${arg.description ? arg.description : ''}</td>
      <td>${arg.type.kind === 'NON_NULL' ? true : false}</td>
    </tr>
    `
  }

  private _renderPayload = (type: FieldType) => {
    return `
    <td>
      <a href="#${extractOriginType(type).name.toLowerCase()}">${formatType(
      type
    )}</a>
    </td>
    <td>${type.kind === 'NON_NULL' ? true : false}</td>
      `
  }

  private _renderArgumentTable = (args: FieldArgument[]) => {
    return `
    <table>
      <thead>
          <tr>
            <th align="left">Field</th>
            <th align="left">Type</th>
            <th align="left">Description</th>
            <th align="left">Require</th>
          </tr>
      </thead>
      <tbody>${args.map(this._renderArgument)}</tbody>
    </table>`
  }

  private _renderFieldTable = (fields: GraphQLResolver[]) => {
    return `
    <table>
      <thead>
        <tr>
          <th align="left">Name</th>
          <th align="left">Type</th>
          <th align="left">Description</th>
          <th align="left">Require</th>
        </tr>
      </thead>
      <tbody>${fields.map(this._renderField).join('\n')}</tbody>
    </table>`
  }

  private _renderField = (field: GraphQLResolver) => {
    return `      
    <tr>
      <td>${field.name}</td>
      <td>
        <a href="#${extractOriginType(field.type).name.toLowerCase()}">
        ${formatType(field.type)}
        </a>
      </td>
      <td>${field.description || ''}</td>
      <td>${field.type.kind === 'NON_NULL' ? true : false}</td>
    </tr>
      `.trim()
  }

  private _renderObject = ({ name, description, fields }: GraphQLType) => {
    return `
      ### ${name}
      ${description || ''}
      ${this._renderFieldTable(fields)}
      `
  }
}
