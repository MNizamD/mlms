import BasicCard from "@/components/heroui/basic-card";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";

function page() {
    return (
        <div>
            <h3>Classes</h3>
            <ResponsiveGrid lgcols={3}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <BasicCard key={i} title={`Test ${i}`} description={`testing ${i}`} />
                ))}
            </ResponsiveGrid>
        </div>
    );
}

export default page;
