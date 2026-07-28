import orders from "../../../data/orders";
import Card from "../../common/Card";
import OrderCard from "../RecentOrders/OrderCard";
export default function RecentOrders () {
    return (
        <Card>
            <h2 className="text-xl font-semibold text-white">
                Recent Orders
            </h2>

            {orders.map((order)=>(
                <OrderCard
                    key={order.id}
                    order = {order}
                />
            ))}
        </Card>
    );

}