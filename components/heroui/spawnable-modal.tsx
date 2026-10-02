"use client";
import { useEffect, useMemo, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { Button, Modal } from "@heroui/react";
import ReactDOM from "react-dom/client";

interface ShowDialogProps<T> extends Omit<ComponentProps<typeof Modal>, "title"> {
    body: (props: {
        setTagValue: (tagValue: T) => void;
        tagValue?: T;
    }) => ReactNode;

    initialTagValue?: T;

    canSubmit?: (tagValue: T | undefined) => boolean;
    title: ReactNode;
    icon?: ReactNode;
    withCancel?: boolean;
    choices?: {
        yes: string;
        no: string;
        cancel?: string;
    };
    isLoading?: boolean;
    isDismissable?: boolean;
    preferredAnswer?: "yes" | "no" | "cancel";
    size?: "xs" | "sm" | "md" | "lg" | "cover" | "full";
}

const showDialog = async <T,>({
    body,
    initialTagValue,
    canSubmit,
    title,
    icon,
    withCancel = false,
    choices,
    preferredAnswer = "yes",
    isLoading,
    isDismissable = false,
    size = "sm",
    ...rest
}: Omit<ShowDialogProps<T>, "children">): Promise<{
    answer: "yes" | "no" | "cancel";
    tagValue: T | undefined;
}> => {
    return new Promise((resolve) => {
        const Dialog = () => {
            const [isOpen, setIsOpen] = useState(true);
            const buttonRef = useRef<HTMLButtonElement | null>(null);
            const [tagValue, setTagValue] = useState<T | undefined>(initialTagValue);
            const [isValid, setIsValid] = useState<boolean>(true);

            const isSubmittable = useMemo(() => {
                if (canSubmit && !canSubmit(tagValue)) return false
                return true;
            }, [canSubmit, tagValue]);

            useEffect(() => {
                if (isOpen && buttonRef.current) {
                    buttonRef.current.focus(); // Set focus to the button when modal opens
                }
            }, [isOpen]);

            const handleYes = () => {
                if (!isSubmittable) return;
                setIsOpen(false);
                resolve({
                    answer: "yes",
                    tagValue: tagValue as T,
                });
            };

            const handleNo = () => {
                setIsOpen(false);
                resolve({
                    answer: "no",
                    tagValue: tagValue as T,
                });
            };

            const handleCancel = () => {
                setIsOpen(false);
                resolve({
                    answer: "cancel",
                    tagValue: tagValue as T,
                });
            };

            const handleOpenChange = (open: boolean) => {
                // Modal is closing
                if (!open) {
                    handleCancel();
                    // onClose();
                }
            };

            return (
                <Modal
                    {...rest}
                    isOpen={isOpen}
                    onOpenChange={handleOpenChange}
                    // closeButton={false}
                    // style={{
                    //     zIndex: "9999 !important",
                    // }}
                >
                    <Modal.Backdrop isDismissable={isDismissable}>
                        <Modal.Container size={size}>
                            <Modal.Dialog>
                                <Modal.CloseTrigger /> {/* Optional: Close button */}
                                <Modal.Header>
                                    {icon && <Modal.Icon>{icon}</Modal.Icon>}
                                    <Modal.Heading>{title}</Modal.Heading>
                                </Modal.Header>
                                <Modal.Body>{body?.({ setTagValue, tagValue })}</Modal.Body>
                                <Modal.Footer>
                                    {withCancel && (
                                        <Button
                                            variant={preferredAnswer == "cancel" ? "primary" : "ghost"}
                                            onPress={handleCancel}
                                        >
                                            {choices ? choices.cancel : "Cancel"}
                                        </Button>
                                    )}
                                    <Button
                                        variant={preferredAnswer == "no" ? "danger" : "ghost"}
                                        ref={preferredAnswer == "no" ? buttonRef : null}
                                        onPress={handleNo}
                                    >
                                        {choices ? choices.no : "No"}
                                    </Button>
                                    <Button
                                        variant={preferredAnswer == "yes" ? "primary" : "ghost"}
                                        ref={preferredAnswer == "yes" ? buttonRef : null}
                                        onPress={handleYes}
                                        isPending={isLoading}
                                        isDisabled={!isSubmittable}
                                    >
                                        {choices ? choices.yes : "Yes"}
                                    </Button>
                                </Modal.Footer>
                            </Modal.Dialog>
                        </Modal.Container>
                    </Modal.Backdrop>
                </Modal>
            );
        };

        // Render the dialog inside a React portal to ensure it displays over other content
        const modalContainer = document.createElement("div");
        document.body.appendChild(modalContainer);

        const removeDialog = () => {
            document.body.removeChild(modalContainer);
        };

        const dialogJSX = <Dialog />;
        const renderDialog = () => {
            const root = ReactDOM.createRoot(modalContainer);
            root.render(dialogJSX);
        };

        renderDialog();

        // Clean up after modal closes
        const observer = new MutationObserver(() => {
            if (!modalContainer.innerHTML) {
                removeDialog();
                observer.disconnect();
            }
        });
        observer.observe(modalContainer, { childList: true });
    });
};

export default showDialog;
