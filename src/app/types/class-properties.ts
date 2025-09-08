/** All properties of a class <C>. */
export type ClassProperties<C> = Pick<
  C,
  {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    [Key in keyof Required<C>]: C[Key] extends Function ? never : Key;
  }[Extract<keyof C, string>]
>;
