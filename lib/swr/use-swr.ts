import useSWR, { SWRConfiguration } from "swr";
import fetcher from "./fetcher";

////////////////////////////////////////////////////////////////////////////////////////
type ArgumentsTuple = readonly [any, ...unknown[]];
type Arguments = string | ArgumentsTuple | Record<any, any> | null | undefined | false;
type Key = Arguments | (() => Arguments);

////////////////////////////////////////////////////////////////////////////////////////

export function useQuery<T>(key: Key, options?: SWRConfiguration<T>) {
    return useSWR<T>(key, fetcher, options);
}
