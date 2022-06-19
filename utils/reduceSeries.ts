export async function reduceSeries<T, U>(
  iterable: T[],
  fn: (prev: U, curr: T, idx: number, array: T[]) => Promise<U>,
  initialVal: U
): Promise<U> {
  return iterable.reduce<Promise<U>>(async (prevPromise, curr, idx, array) => {
    const prev = await prevPromise
    return fn(prev, curr, idx, array)
  }, Promise.resolve(initialVal))
}
