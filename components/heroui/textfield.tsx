import { FieldError, Input, Label, TextField as TF } from "@heroui/react";
import { ComponentProps } from "react";

type TFProp = ComponentProps<typeof TF> & {
    label: string;
    placeholder?: string;
    errorField?: string;
};

function TextField({ label, placeholder, errorField, ...props }: TFProp) {
    return (
        <TF {...props} className={`w-full gap-1.5 ${props.className}`}>
            <Label className="font-medium text-muted">{label}</Label>
            <Input
                placeholder={placeholder}
            />
            <FieldError>{errorField}</FieldError>
        </TF>
    );
}

export default TextField;
