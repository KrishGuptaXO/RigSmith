import Card from "../../../../components/common/Card";

export default function BuildImage({ build }) {
    return (
        <Card className="overflow-hidden p-0 aspect-square lg:aspect-auto min-h-[340px]">
            <img
                src={build.image}
                alt={build.name}
                className="h-full w-full object-cover rounded-xl"
            />
        </Card>
    );
}