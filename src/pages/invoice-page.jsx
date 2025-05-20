import { useEffect, useState } from "react";

// interface InvoiceItem {
//   barcode: string;
//   productName: string;
//   quantity: number;
//   discount: number;
//   unitPrice: string;
//   lineTotalNet: string;
// }

function InvoiceDetail() {
    const [invoiceImg, setInvoiceImg] = useState("");
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [total, setTotal] = useState(0);
    const [supperMarketName, setSupperMarketName] = useState();
    const [productItems, setProductItems] = useState([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const data = sessionStorage.getItem("imgData");
            setInvoiceImg(data);
        }

        let invoiceJsonData = JSON.parse(
            sessionStorage.getItem("invoice_data")?.toString() ?? "{}"
        ).data.invoices[0];

        console.log(invoiceJsonData);

        setTotalQuantity(invoiceJsonData.total_quantity);
        setTotal(invoiceJsonData.grand_total);

        let dataItems = invoiceJsonData.items;

        let items = dataItems.map((el) => {
            return {
                barcode: el.code,
                productName: el.name,
                quantity: el.quantity,
                discount: el.discount,
                unitPrice: el.unit_price,
                lineTotalNet: el.total_price,
            };
        });

        setProductItems(items);
        setSupperMarketName(invoiceJsonData.supermarket_name);
    }, []);

    return (
        <div className="h-screen ph-[2dvh] flex items-start justify-center">
            {/* Container with fixed height and no overflow on left */}
            <div className="h-screen w-[90dvw] flex flex-col md:flex-row md:space-x-[2dvw] space-y-6 md:space-y-0 overflow-hidden">
                <div className="w-screen h-screen flex flex-col items-center space-y-6 overflow-y-auto pr-2 pt-[2dvh]">
                    <h2 className="text-2xl font-bold">Invoice Details</h2>

                    <h3 className="text-xl text-center font-bold mb-4">
                        {supperMarketName}
                    </h3>

                    {/* Items List */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-2 py-1 text-left text-sm">
                                        Barcode
                                    </th>
                                    <th className="border px-2 py-1 text-left text-sm">
                                        Product Name
                                    </th>
                                    <th className="border px-2 py-1 text-right text-sm">
                                        Unit Price
                                    </th>
                                    <th className="border px-2 py-1 text-right text-sm">Qty</th>

                                    <th className="border px-2 py-1 text-right text-sm">
                                        Discount
                                    </th>

                                    <th className="border px-2 py-1 text-right text-sm">
                                        Line Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {productItems.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                    >
                                        <td className="border px-2 py-1 text-sm">{item.barcode}</td>
                                        <td className="border px-2 py-1 text-sm">
                                            {item.productName}
                                        </td>
                                        <td className="border px-2 py-1 text-right text-sm">
                                            {item.unitPrice == null ? "N/A" : item.unitPrice}
                                        </td>
                                        <td className="border px-2 py-1 text-right text-sm">
                                            {item.quantity == null ? "N/A" : item.quantity}
                                        </td>

                                        <td className="border px-2 py-1 text-right text-sm">
                                            {item.discount == null ? "N/A" : item.discount}
                                        </td>

                                        <td className="border px-2 py-1 text-right text-sm">
                                            {item.lineTotalNet == null ? "N/A" : item.unitPrice}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Fields */}
                    <div className="flex justify-between w-[50dvw] pt-4 border-t">
                        <p className="text-sm">Total Qty: {totalQuantity}</p>
                        <p className="text-sm">Total Net: {total}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvoiceDetail;
