import { Description, Label, Radio, RadioGroup } from "@heroui/react";
import { cn } from "@heroui/theme";
import { ComponentProps, ReactNode } from "react";

type RadioCardIemType = {
    description: string;
    icon?: ReactNode;
    label: string;
    value: string;
};

type RadioCard = ComponentProps<typeof RadioGroup> & {
    title?: string;
    options: RadioCardIemType[];
    descriptions?: string;
    errorField?: string;
};

export function RadioCard({ options, title, descriptions, errorField, ...props }: RadioCard) {
    return (
        <RadioGroup variant="secondary" {...props}>
            {!!title && (
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Label>{title}</Label>
                </div>
            )}
            <div className="grid gap-x-4 md:grid-cols-2">
                {options.map((option) => (
                    <Radio key={option.value} value={option.value}>
                        <Radio.Content
                            className={cn(
                                "group relative flex w-full flex-row items-start justify-start gap-4 rounded-xl border border-transparent bg-surface px-5 py-4 transition-all",
                                "data-[selected=true]:border-accent data-[selected=true]:bg-accent/10",
                            )}
                        >
                            <Radio.Control className="absolute inset-e-4 top-3 size-5">
                                <Radio.Indicator />
                            </Radio.Control>
                            {option.icon ?? <div />}
                            <div className="flex flex-col gap-1">
                                <span>{option.label}</span>
                                <Description>{option.description}</Description>
                            </div>
                        </Radio.Content>
                    </Radio>
                ))}
            </div>
            {props.isInvalid && <div className="text-danger text-center">{errorField}</div>}
        </RadioGroup>
        // </div>
    );
}
