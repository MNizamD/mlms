"use client";
import React, { useEffect} from "react";

const Debug: React.FC = () => {
    let active = false;
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.code === "Space") {
                e.preventDefault();
                const allElements = document.querySelectorAll<HTMLElement>("*");
                allElements.forEach((element) => {
                    element.classList.toggle("outline", active);
                });
                active = !active
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []); // Empty dependency array to ensure the effect runs once when the component mounts

    return null; // Since this is just an effect, return null as there's no UI to render
};

function DebugOutline() {
    if (process.env.NODE_ENV === "production") return;
    return <Debug />;
}

export default DebugOutline;
