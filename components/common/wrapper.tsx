import { cn } from "@heroui/styles";
import { ReactNode, ReactElement, cloneElement, isValidElement, HTMLAttributes } from "react";

interface WrapperProps {
    wrapper?: ReactElement;
    children: ReactNode;
}

export function Wrapper({ wrapper, children }: WrapperProps) {
    if (isValidElement(wrapper)) {
        // just inject children, keep existing props automatically
        return cloneElement(wrapper, undefined, children);
    }
    return <>{children}</>;
}

interface ScreenWrapperProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    title?: string;
}

export function ScreenWrapper({ children, className, title, ...otherProps }: ScreenWrapperProps) {
    return (
        <div className={cn("flex flex-col ps-4 pe-4 pb-4 gap-5", className)} {...otherProps}>
            {!!title && <h1 className="text-large font-bold">{title}</h1>}
            {children}
        </div>
    );
}
