export type PrismaRetype<T> =
  T extends bigint ? number :
  T extends Date ? string :
  T extends Array<infer U> ? PrismaRetype<U>[] :
  T extends object ? {
    [K in keyof T]: PrismaRetype<T[K]>
  } :
  T;

export function prismaJson<T>(obj: T): PrismaRetype<T> {
    return JSON.parse(
        JSON.stringify(obj, (_, value) =>
          typeof value === "bigint" ? Number(value) : value
        )
    );
}