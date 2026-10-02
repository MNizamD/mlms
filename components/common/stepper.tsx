// components/Stepper.tsx
"use client";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Button, ScrollShadow } from "@heroui/react";
import { cn } from "@heroui/theme";
import { truncate } from "lodash";

export type StepProps = {
    name: string;
    description: string;
    component: ReactNode; // Put this step's content here
    icon?: string | ReactNode; // Shows the step number when omitted

    /**
     * Return true when the step is valid.
     * If a field is missing, scroll/focus it inside this function, then return false.
     */
    onNext: () => boolean | Promise<boolean>;
};

type StepperProps = {
    steps: StepProps[];
    onComplete?: () => void | Promise<void>;
    finishLabel?: string;
};

export default function Stepper({ steps, onComplete, finishLabel = "Finish" }: StepperProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isChecking, setIsChecking] = useState(false);

    const stepButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    useEffect(() => {
        stepButtonRefs.current[currentStep]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }, [currentStep]);

    const step = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    async function handleNext() {
        setIsChecking(true);

        const isValid = await step.onNext();
        setIsChecking(false);

        if (!isValid) return;

        const isLastStep = currentStep === steps.length - 1;

        if (isLastStep) {
            await onComplete?.();
            return;
        }

        setCurrentStep((previous) => previous + 1);
    }

    return (
        <div className="w-full h-full flex flex-col max-w-2xl mx-auto p-5">
            <div className="space-y-1">
                <ScrollShadow
                    orientation="horizontal"
                    className="overflow-x-auto scrollbar-thin scrollbar-thumb-default"
                    size={100}
                >
                    <div className="flex w-max items-center justify-start mx-auto gap-2">
                        {steps.map((item, index) => {
                            const isActive = index === currentStep;
                            const isCompleted = index < currentStep;

                            return (
                                <Fragment key={index}>
                                    <button
                                        ref={(element) => {
                                            stepButtonRefs.current[index] = element;
                                        }}
                                        type="button"
                                        disabled={index > currentStep}
                                        onClick={() => setCurrentStep(index)}
                                        className="flex min-w-20 max-w-fit flex-1 flex-col items-center gap-2 disabled:cursor-not-allowed"
                                    >
                                        <span
                                            className={cn(
                                                "mt-1 flex size-9 items-center justify-center border border-gray-500 rounded-full text-sm text-white",
                                                isActive
                                                    ? "bg-accent border-accent font-semibold text-lg size-11 -mt-2"
                                                    : isCompleted
                                                      ? "bg-success border-success cursor-pointer"
                                                      : "text-foreground",
                                            )}
                                        >
                                            {item.icon ?? index + 1}
                                        </span>

                                        <span
                                            className={[
                                                "text-center text-muted text-xs",
                                                isActive ? "font-semibold text-foreground" : "text-default-500",
                                            ].join(" ")}
                                        >
                                            {index != currentStep && truncate(item.name, { length: 10 })}
                                        </span>
                                    </button>
                                    {index < steps.length - 1 && (
                                        // line indicator
                                        <div
                                            className={cn(
                                                "h-1 min-w-10 w-auto -mt-4 -mx-4",
                                                isCompleted ? "bg-success" : "bg-default",
                                            )}
                                        />
                                    )}
                                </Fragment>
                            );
                        })}
                    </div>
                </ScrollShadow>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">{step.name}</h2>
                    <p className="mt-1 text-sm text-default-500">{step.description}</p>
                </div>

                <ScrollShadow className="flex-1 p-1">{step.component}</ScrollShadow>
            </div>

            <div className="flex justify-between gap-3">
                <Button
                    variant="tertiary"
                    onPress={() => setCurrentStep((previous) => previous - 1)}
                    isDisabled={currentStep === 0 || isChecking}
                    fullWidth
                >
                    Back
                </Button>

                <Button variant="primary" onPress={handleNext} isDisabled={isChecking} fullWidth>
                    {currentStep === steps.length - 1 ? finishLabel : "Next"}
                </Button>
            </div>
        </div>
    );
}
