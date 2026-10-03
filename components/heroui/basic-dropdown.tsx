import { Button } from "@heroui/react/button";
import { Dropdown } from "@heroui/react/dropdown";
import { Label } from "@heroui/react/label";
import { MoreHorizontal } from "lucide-react";
import type { ComponentProps, ComponentType, SVGProps } from "react";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;
type BasicDropdownType = Omit<ComponentProps<typeof Dropdown>, "children"> & {
    items: (ComponentProps<typeof Dropdown.Item> & { icon?: IconType })[];
    placement?: ComponentProps<typeof Dropdown.Popover>["placement"]
};

function BasicDropdown({ items, placement, ...props }: BasicDropdownType) {
    return (
        <Dropdown {...props}>
            <Button isIconOnly size="sm" variant="ghost" aria-label="User menu">
                <MoreHorizontal className="w-4 h-4" />
            </Button>

            <Dropdown.Popover placement={placement}>
                <Dropdown.Menu>
                    {items.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Dropdown.Item key={item.id} {...item}>
                                {Icon ? <Icon className="size-4" /> : null}
                                <Label>{item.textValue}</Label>
                            </Dropdown.Item>
                        );
                    })}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
}

export default BasicDropdown;
