export function getFulfilledResult<T>(
  settledResult: PromiseSettledResult<T>[]
): T[] {
  return settledResult
    .filter(
      (result): result is PromiseFulfilledResult<T> =>
        result.status === 'fulfilled'
    )
    .map((result) => result.value)
}
