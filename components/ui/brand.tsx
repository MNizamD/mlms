import { GraduationCap } from "lucide-react";

function Brand() {
    return (
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-semibold text-foreground">MaLearn</span>
        </div>
    );
}

export default Brand;
