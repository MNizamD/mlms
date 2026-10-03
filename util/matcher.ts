const matchesPrefix = (pathname: string, prefix: string) => pathname === prefix || pathname.startsWith(prefix);

export { matchesPrefix };
