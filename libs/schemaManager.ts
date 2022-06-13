import { ClassifiedType } from '@types'

export class SchemaManager {
  constructor(private typeMap: ClassifiedType) {}

  findObjectByName(name: string) {
    return this.typeMap.objects.find((obj) => obj.name === name)
  }
}
