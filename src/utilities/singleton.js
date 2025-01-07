export const createSingleton = (
  createMethod,
) => {
  let instance = null
  return () => {
    if (!instance) {
      instance = createMethod()
    }
    return instance
  }
}