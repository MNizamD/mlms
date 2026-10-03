import { Button, Card, cn } from "@heroui/react";
import { ComponentProps } from "react";

type BasicCardType = Omit<ComponentProps<typeof Card>, "children"> & {
    background?: {
        alt: string;
        className?: string;
        src: string;
    };
    title: string;
    description?: string;
};

function BasicCard({ title, description, background, ...props }: BasicCardType) {
    return (
        <Card {...props} className={cn("overflow-hidden rounded-3xl", props.className)}>
            {/* Background image */}
            {background && (
                <img
                    alt={background.alt}
                    aria-hidden="true"
                    className={cn("absolute inset-0 h-full w-full object-cover", background.className ?? "")}
                    src={background.src}
                />
            )}
            {/* Header */}
            <Card.Header className="z-10 text-white">
                <Card.Title className="text-xs font-semibold tracking-wide">{title}</Card.Title>
                {description && (
                    <Card.Description className="text-sm leading-5 font-medium text-muted">
                        {description}
                    </Card.Description>
                )}
            </Card.Header>
            {/* Content */}
            <Card.Content>
                test111
            </Card.Content>
            {/* Footer */}
            <Card.Footer className="z-10 mt-auto flex items-center justify-between">
                <div>
                    <div className="text-sm font-medium text-black">Available soon</div>
                    <div className="text-xs text-black/60">Get notified</div>
                </div>
                <Button className="bg-white text-black" size="sm" variant="tertiary">
                    Notify me
                </Button>
            </Card.Footer>
        </Card>
    );
}

export default BasicCard;
