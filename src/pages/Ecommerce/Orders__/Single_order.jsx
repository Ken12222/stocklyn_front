import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow
} from "../../../components/ui/table";
import Button from "@/components/ui/button/Button";
const tableData = [
    {
        id: 1,
        quantity: "5",
        name: "Wireless Mouse",
        price: "25.99",
        discount: "10"
    },
    {
        id: 2,
        quantity: "12",
        name: "Mechanical Keyboard",
        price: "79.50",
        discount: "5"
    },
    {
        id: 3,
        quantity: "8",
        name: "HD Monitor",
        price: "149.99",
        discount: "15"
    },
    { id: 4, quantity: "20", name: "USB-C Cable", price: "9.99", discount: "0" },
    {
        id: 5,
        quantity: "3",
        name: "Gaming Chair",
        price: "199.00",
        discount: "20"
    }
];
function SingleInvoice() {
    return <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h1 className="m-4">Invoice</h1>
        <hr className="my-4" />
        <div className="p-4 flex justify-between">
            <div>
                <p>From</p>
                <p className="text-gray-400 text-sm">Central Store</p>
                <p className="text-gray-400 text-sm">Location</p>

                <p>Issued On</p>
                <p className="text-gray-400 text-sm">19 Aug, 2025</p>
            </div>
            <div>
                <p>To</p>
                <p className="text-gray-400 text-sm">Christian Ansah</p>
                <p className="text-gray-400 text-sm">Location</p>

                <p>Due On</p>
                <p className="text-gray-400 text-sm">19 Aug, 2025</p>
            </div>
        </div>
        <hr className="my-4" />
        <div className="max-w-full overflow-x-auto">
            <Table>
                {
                    /* Table Header */
                }
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                        <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                            S.NO
                        </TableCell>
                        <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                            Product
                        </TableCell>
                        <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                            Quantity
                        </TableCell>
                        <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                            Unit Cost
                        </TableCell>
                        <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                            Discount
                        </TableCell>
                        <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                            Total
                        </TableCell>
                    </TableRow>
                </TableHeader>

                {
                    /* Table Body */
                }
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {tableData.map((order) => <TableRow key={order.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                            <div className="flex items-center gap-3">
                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                    {order.id}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                            <div className="flex items-center gap-3">
                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                    {order.name}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                            <div className="flex items-center gap-3">
                                <div>
                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {order.quantity}
                                    </span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {order.price}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {order.discount}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <div className="flex -space-x-2">
                                {(order.price * order.quantity - order.price * order.quantity * order.discount / 100).toFixed(2)}
                            </div>
                        </TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
            <div className="p-4 flex justify-end m-4">
                <div>
                    <p className="text-gray-400 text-sm">Sub Total</p>
                    <p className="text-gray-400 text-sm">Location</p>
                </div>
            </div>
            <form action="" className="flex justify-end gap-4 m-4">
                <Button
                    className="my-4"
                    variant="outline"
                    type="button"
                    children={"Share"}
                />
                <Button className="my-4" type="button" children={"Print"} />
            </form>
        </div>
    </div>;
}
export {
    SingleInvoice as default
};
