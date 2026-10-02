import { Avatar, AvatarFallback, AvatarImage, Description, Label, ListBox, Select, type Key } from "@heroui/react";
import type { ComponentProps } from "react";

type SelectItemProp = {
    id: Key;
    icon?: string;
    name: string;
    description?: string;
};

type SelectProp = ComponentProps<typeof Select> & {
    label?: string;
    list: SelectItemProp[];
};

export function SelectItems({ label, list, ...selectProps }: SelectProp) {
    return (
        <Select {...selectProps}>
            {/* {label && <Label>{label}</Label>} */}
            <Label className={label ? "" : "hidden"}>{label ?? ""}</Label>
            <Select.Trigger>
                <Select.Value>
                    {({ defaultChildren, isPlaceholder, state }) => {
                        if (isPlaceholder || state.selectedItems.length === 0) {
                            return defaultChildren;
                        }
                        const selectedItems = state.selectedItems;
                        if (selectedItems.length > 1) {
                            return `${selectedItems.length} users selected`;
                        }
                        const selectedItem = list.find((item) => item.id === selectedItems[0]?.key);
                        if (!selectedItem) {
                            return defaultChildren;
                        }
                        return (
                            <div className="flex items-center gap-2">
                                <Avatar className="size-4" size="sm">
                                    {selectedItem.icon && <AvatarImage src={selectedItem.icon} />}
                                    {/* <AvatarFallback>{selectedItem.fallback}</AvatarFallback> */}
                                </Avatar>
                                <span>{selectedItem.name}</span>
                            </div>
                        );
                    }}
                </Select.Value>
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {list.map((item) => (
                        <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                            <Avatar size="sm">
                                <AvatarImage src={item.icon} />
                                <AvatarFallback>{item.name}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <Label>{item.name}</Label>
                                {item.description && <Description>{item.description}</Description>}
                            </div>
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
    );
}
