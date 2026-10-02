"use client";
import Stepper, { StepProps } from "@/components/common/stepper";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFields } from "@/components/common/input-fields";
import { userProfileSchema } from "@/types/UserProfile";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import axios from "axios";
import { FaUserGraduate, FaUserTie } from "react-icons/fa";
import { toast } from "@heroui/react/toast";
import { IoEarthSharp } from "react-icons/io5";
import { useIsMobile } from "@/util/hooks/isMobile";

function Onboarding() {
    const isMobile = useIsMobile();
    const { user } = useUser();
    type UserProfileSchema = z.infer<typeof userProfileSchema>;
    const form = useForm<UserProfileSchema>({ resolver: zodResolver(userProfileSchema) });
    const { trigger, getValues, setError, setValues, watch } = form;
    useEffect(() => {
        if (user) {
            setValues({
                first_name: user?.firstName ?? "",
                last_name: user?.lastName ?? "",
                middle_name: "",
                extension: "",
                prefix: "",
                program_id: 1,
                college_id: 1,
                organization_id: 1,
            });
        }
    }, [user]);
    const steps: StepProps[] = [
        {
            name: "About You",
            description: "Enter your neccessary information",
            component: (
                <FormFields
                    form={form}
                    columns={isMobile ? 1 : 2}
                    fields={[
                        {
                            name: "first_name",
                            label: "Firstname",
                            isRequired: true,
                        },
                        {
                            name: "middle_name",
                            label: "Middlename",
                        },
                        {
                            name: "last_name",
                            label: "Lastname",
                            isRequired: true,
                        },
                        {
                            name: "prefix",
                            label: "Prefix",
                        },
                        {
                            name: "extension",
                            label: "Extension",
                        },
                    ]}
                />
            ),
            onNext: async () => {
                return await trigger(["first_name", "last_name"]);
            },
        },

        {
            name: "Who are you?",
            description: "Select your role",
            component: (
                <FormFields
                    form={form}
                    fields={[
                        {
                            name: "roles",
                            label: " ",
                            type: "radio",
                            options: [
                                {
                                    value: "teacher",
                                    label: "Teacher",
                                    description: "Teacher",
                                    icon: <FaUserTie size={40} />,
                                },
                                {
                                    value: "student",
                                    label: "Student",
                                    description: "Student",
                                    icon: <FaUserGraduate size={40} />,
                                },
                            ],
                        },
                    ]}
                />
            ),
            onNext() {
                return true;
            },
        },
    ];

    async function handleComplete(data: UserProfileSchema) {
        try {
            const result = await axios.post("/api/onboarding", data);
            alert(JSON.stringify(result));

            if (result.status != 200) {
                const id = toast.danger("Test", {
                    actionProps: { children: "Remove", onPress: () => toast.close(id), variant: "danger" },
                    description: result.statusText,
                    indicator: <IoEarthSharp />,
                });
            }
        } catch (e) {
            const id = toast.danger("Test", {
                actionProps: { children: "Remove", onPress: () => toast.close(id), variant: "danger" },
                description: String(e),
                indicator: <IoEarthSharp />,
            });
        }
    }

    return <Stepper steps={steps} onComplete={form.handleSubmit(handleComplete)} />;
}

export default Onboarding;
// const userProfileSchema = ups
//     .extend({
//         pw: z
//             .string()
//             .min(8, "Password should be atleast eight (8) characters long")
//             .regex(
//                 /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
//                 "Password must include an uppercase letter, lowercase letter, number, and symbol.",
//             ),
//         confirm_pw: z.string(),
//     })
//     .refine((data) => data.pw === data.confirm_pw, {
//         message: "Passwords do not match.",
//         path: ["confirm_pw"], // shows the error under confirm_pw
//     });
// {
//     name: "Password",
//     description: "Setup an unforgettable password",
//     component: (
//         <div className="mt-10">
//             <FormFields
//                 form={form}
//                 fields={[
//                     {
//                         name: "pw",
//                         label: "Password",
//                         inputType: "password",
//                         isRequired: true,
//                     },
//                     {
//                         name: "confirm_pw",
//                         label: "Confirm Password",
//                         inputType: "password",
//                         isRequired: true,
//                     },
//                 ]}
//             />
//             <FriendlyPassword password={watch("pw")} />
//         </div>
//     ),
//     onNext: async () => {
//         const isPasswordValid = await trigger(["pw", "confirm_pw"]);
//         if (isPasswordValid) {
//             const pw = getValues("pw");
//             const cpw = getValues("confirm_pw");
//             if (pw === cpw) {
//                 return true;
//             } else {
//                 setError("confirm_pw", { message: "Password does not match" }, { shouldFocus: true });
//                 return false;
//             }
//         }
//         return false;
//     },
// },
