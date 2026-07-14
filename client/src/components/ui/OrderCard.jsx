import Badge from "./common/Badge";
import Button from "./common/Button";
import Card from "./common/Card";

export default function OrderCard({order}){
    const { id, build, date, status } = order;
    const statusVariant = {
        Delivered: "success",
        Processing: "warning",
        Cancelled: "danger",
    };
    return(
        <Card>
            <h3 className="mt-2 text-xl font-semibold text-white">
                {build}
            </h3>

            <p className="mt-3 text-base text-white">
                {id} • {date}
            </p>

            <Badge variant={statusVariant[status]}>
                {status}
            </Badge>

            <div className="mt-4">
            <Button variant="outline">
                Track Order →
            </Button>
            </div>
        </Card>
    );
}