/**
 * Type that determines the keys of the optional properties in a given type `T`.
 *
 * It works by iterating over each key `K` in `T` and checking if `T` extends a record with `K` and `T[K]`.
 * If it does, it means `K` is a required property, so it returns `never`.
 * If it doesn't, it means `K` is an optional property, so it returns `K`.
 *
 * The result is a union of the keys of the optional properties in `T`.
 */
type OptionalKeys<T> = {
  [K in keyof T]: T extends Record<K, T[K]> ? never : K;
} extends { [_ in keyof T]: infer U }
  ? U
  : never;

/**
 * Type that picks the optional properties from a given type `T`.
 *
 * It uses the `OptionalKeys<T>` type to get the keys of the optional properties in `T`,
 * and then uses the `Pick` utility type to pick these properties from `T`.
 *
 * The result is a type with the same optional properties as `T`.
 */
export type PickOptional<T> = Pick<T, OptionalKeys<T>>;
