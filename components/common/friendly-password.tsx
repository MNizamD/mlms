
const requirements = [
    { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
    { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
    { label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
    { label: "One number", test: (value: string) => /\d/.test(value) },
    {
        label: "One special character",
        test: (value: string) => /[^A-Za-z0-9]/.test(value),
    },
];
function FriendlyPassword({ password }: { password: string }) {
    return (
        <ul id="password-requirements" className="space-y-1.5 text-sm text-muted mt-5">
            {requirements.map(({ label, test }) => {
                const met = test(password);

                return (
                    <li key={label} className={`flex items-center gap-2 ${met ? "text-success" : "text-default-500"}`}>
                        <span
                            aria-hidden="true"
                            className={`flex size-4 items-center justify-center rounded-full text-xs ${
                                met ? "bg-success text-white" : "border border-default-400"
                            }`}
                        >
                            {met && "✓"}
                        </span>
                        {label}
                    </li>
                );
            })}
        </ul>
    );
}

export default FriendlyPassword;
