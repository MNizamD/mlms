"use client";

import type { ReactNode } from "react";
import {
    Controller,
    type ControllerFieldState,
    type ControllerRenderProps,
    type FieldValues,
    type Path,
    type UseFormReturn,
} from "react-hook-form";
import TextField from "../heroui/textfield";
import { RadioCard } from "../heroui/radio-card";

// import { TextField } from "@/components/ui/TextField";
// import { SelectField } from "@/components/ui/SelectField";
// import { CheckboxField } from "@/components/ui/CheckboxField";
// import { RadioField } from "@/components/ui/RadioField";

type FieldType = "text" | "select" | "checkbox" | "radio";

type FieldOption = {
    value: string;
    label: string;
    description: string;
    icon?: ReactNode;
};

type FieldRenderProps<T extends FieldValues> = {
    value: unknown;
    error?: string;
    onChange: (value: unknown) => void;
    field: ControllerRenderProps<T, Path<T>>;
    fieldState: ControllerFieldState;
};

type FormField<T extends FieldValues> = {
    name: Path<T>;
    label: string;

    type?: FieldType; // Defaults to "text"
    inputType?: "text" | "email" | "password" | "number";
    placeholder?: string;
    options?: FieldOption[];
    isRequired?: boolean;

    colSpan?: number;

    // Optional: only use for a fully custom field.
    render?: (props: FieldRenderProps<T>) => ReactNode;
};

type FormFieldsProps<T extends FieldValues> = {
    form: UseFormReturn<T>;
    fields: FormField<T>[];
    columns?: number; // Defaults to 1
};

function DefaultField<T extends FieldValues>({ config, props }: { config: FormField<T>; props: FieldRenderProps<T> }) {
    const { value, error, onChange } = props;

    // Overrides all default field types when supplied.
    if (config.render) {
        return config.render(props);
    }

    switch (config.type ?? "text") {
        case "checkbox":
            return (
                // <CheckboxField
                //     id={config.name}
                //     label={config.label}
                //     isSelected={Boolean(value)}
                //     onValueChange={(checked: boolean) => onChange(checked)}
                //     isInvalid={!!error}
                //     errorField={error}
                // />
                <div>Check</div>
            );

        case "select":
            return (
                // <SelectField
                //     id={config.name}
                //     label={config.label}
                //     value={String(value ?? "")}
                //     options={config.options ?? []}
                //     onChange={(selectedValue: string) => onChange(selectedValue)}
                //     isInvalid={!!error}
                //     errorField={error}
                // />
                <div>Select</div>
            );

        case "radio":
            return (
                <RadioCard
                    id={config.name}
                    title={config.label}
                    value={String(value ?? "")}
                    options={config.options ?? []}
                    onChange={(selectedValue: string) => onChange(selectedValue)}
                    isInvalid={!!error}
                    errorField={error}
                />
                // <div>Radio</div>
            );

        case "text":
        default:
            return (
                <TextField
                    isRequired={config.isRequired ?? false}
                    id={config.name}
                    label={config.label}
                    type={config.inputType ?? "text"}
                    placeholder={config.placeholder}
                    value={String(value ?? "")}
                    onChange={(text: string) => onChange(text)}
                    isInvalid={!!error}
                    errorField={error}
                    variant="secondary"
                />
            );
    }
}

export function FormFields<T extends FieldValues>({ form, fields, columns = 1 }: FormFieldsProps<T>) {
    return (
        <div
            className="grid gap-4"
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
        >
            {fields.map((config) => (
                <Controller
                    key={config.name}
                    name={config.name}
                    control={form.control}
                    render={({ field, fieldState }) => {
                        const props: FieldRenderProps<T> = {
                            value: field.value,
                            error: fieldState.error?.message,
                            field,
                            fieldState,
                            onChange: (value) => {
                                field.onChange(value);
                                form.clearErrors(config.name);
                            },
                        };

                        return (
                            <div
                                style={{
                                    gridColumn: `span ${config.colSpan ?? 1}`
                                }}
                            >
                                <DefaultField config={config} props={props} />
                            </div>
                        );
                    }}
                />
            ))}
        </div>
    );
}
