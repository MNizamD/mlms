
/* ---------------------------------------------------------------
 *  Type-safe runtime equivalents of TypeScript's Pick, Omit, Merge
 * --------------------------------------------------------------- */

const hasOwn = <T extends object>(
  obj: T,
  key: PropertyKey,
): key is keyof T => Object.prototype.hasOwnProperty.call(obj, key);

/* ----------------------------- Pick ---------------------------- */
/**
 * Returns a new object containing only the given keys.
 * - `K` is constrained to keys of `T`, so typos are compile errors.
 * - Missing keys are silently skipped at runtime.
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const key of keys) {
    if (hasOwn(obj, key)) {
      out[key] = obj[key];
    }
  }
  return out;
}

/* ----------------------------- Omit ---------------------------- */
/**
 * Returns a new object with the given keys removed.
 * - `K` is constrained to keys of `T`.
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {
  const exclude = new Set<PropertyKey>(keys);
  const out = {} as Omit<T, K>;

  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (!exclude.has(key)) {
      // Cast needed: TS can't prove `key` isn't in `K` here.
      (out as Record<keyof T, unknown>)[key] = obj[key];
    }
  }
  return out;
}

/* ----------------------------- Merge --------------------------- */
type PlainObject = Record<PropertyKey, unknown>;

const isPlainObject = (value: unknown): value is PlainObject => {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

/** Compute the merged type of a tuple of objects. Later wins. */
type MergeAll<T extends readonly unknown[]> = T extends readonly [
  infer Head,
  ...infer Tail,
]
  ? Head extends object
    ? Tail extends readonly unknown[]
      ? Simplify<Head & MergeAll<Tail>>
      : Head
    : MergeAll<Tail>
  : {};

/** Flatten intersections for nicer IDE tooltips. */
type Simplify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Deep-merges any number of objects into a brand-new object.
 * - Later sources win.
 * - Plain objects merge recursively.
 * - Arrays are cloned (not concatenated) — last one wins.
 */
export function merge<T extends readonly object[]>(...sources: T): MergeAll<T> {
  const out: PlainObject = {};

  for (const source of sources) {
    if (source == null) continue;

    for (const [key, value] of Object.entries(source)) {
      if (isPlainObject(value)) {
        const existing = out[key];
        out[key] = isPlainObject(existing)
          ? merge(existing, value)
          : merge({}, value);
      } else if (Array.isArray(value)) {
        out[key] = value.slice();
      } else {
        out[key] = value;
      }
    }
  }

  return out as MergeAll<T>;
}