import { rgba } from "color2k";
import uniqolor from "uniqolor";

export const generateColor = (name: string, alpha?: number) => {
    const isHex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(name);

    if (isHex) {
        const hex = name.slice(1);

        const normalizedHex =
            hex.length === 3
                ? hex
                      .split("")
                      .map((char) => char + char)
                      .join("")
                : hex;

        if (alpha === undefined) {
            return `#${normalizedHex}`;
        }

        const alphaHex = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
            .toString(16)
            .padStart(2, "0");

        return `#${normalizedHex}${alphaHex}`;
    }

    if (alpha !== undefined) {
        const [r, g, b] = uniqolor(name, {
            format: "rgb",
        })
            .color.replace("rgb(", "")
            .replace(")", "")
            .split(",")
            .map(Number) as [number, number, number];

        return rgba(r, g, b, alpha);
    }

    return uniqolor(name).color;
};
