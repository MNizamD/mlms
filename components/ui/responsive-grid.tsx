import { cn } from "@heroui/react";

type ResponsiveGridProps = {
    children: React.ReactNode;
    /** Number of columns on large screens (default: 2) */
    lgcols?: 1 | 2 | 3 | 4;
    /** Number of columns on medium screens (default: auto) */
    mdCols?: 1 | 2 | 3;
    /** Number of columns on small screens (default: 1) */
    smCols?: 1 | 2;
    /** Gap between items */
    gap?: "sm" | "md" | "lg";
    className?: string;
};

const lgColMap = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
} as const;

const mdColMap = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
} as const;

const smColMap = {
    1: "grid-cols-1",
    2: "grid-cols-2",
} as const;

const gapMap = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
} as const;

export function ResponsiveGrid({
    children,
    lgcols = 2,
    mdCols = 2,
    smCols = 1,
    gap = "md",
    className = "",
}: ResponsiveGridProps) {
    return (
        <div
            className={cn(
                "grid w-full",
                smColMap[smCols], // base (mobile)
                mdColMap[mdCols], // tablet
                lgColMap[lgcols], // desktop
                gapMap[gap],
                className,
            )}
        >
            {children}
        </div>
    );
}
