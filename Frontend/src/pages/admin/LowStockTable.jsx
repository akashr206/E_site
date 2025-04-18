import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { useState, useEffect } from "react";
import { API_URL } from "../../config/api";
import { Button } from "../../components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

const getStockBadge = (stock) => {
    if (stock <= 1) {
        return <Badge className="bg-red-500">Critical</Badge>;
    } else if (stock <= 3) {
        return <Badge className="bg-yellow-500">Low</Badge>;
    } else {
        return <Badge className="bg-green-500">OK</Badge>;
    }
};

export function LowStockTable() {
    const [allLowStock, setAllLowStock] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 6;
    const [max, setMax] = useState(1);

    const fetchLowStock = async () => {
        const res = await fetch(`${API_URL}/api/products/low`);
        const data = await res.json();
        setAllLowStock(data.products);
        setMax(Math.ceil(data.products.length / limit));
        setLowStockProducts(
            data.poducts.slice((page - 1) * limit, page * limit)
        );
    };

    const handleNext = () => {
        if (page + 1 <= max) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
      if (page - 1 > 0) {
        setPage((prev) => prev - 1);
    }
    };

    useEffect(() => {
        fetchLowStock();
    }, []);

    useEffect(() => {
        setLowStockProducts(
            allLowStock.slice((page - 1) * limit, page * limit)
        );
    }, [page]);

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Variant</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {lowStockProducts.map((product, index) => (
                        <TableRow key={product.id + index}>
                            <TableCell className="font-medium">
                                {product.name}
                            </TableCell>
                            <TableCell>{`${product.variant?.color} / ${product.variant?.size}`}</TableCell>
                            <TableCell>{product.variant.stock}</TableCell>
                            <TableCell>
                                {getStockBadge(product.variant.stock)}
                            </TableCell>
                            <TableCell className="text-right">
                                {formatCurrency(product.price)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between p-4">
                <Button
                    onClick={handlePrev}
                    disabled={page == 1}
                    variant="outline"
                    size="sm"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={page == max}
                    variant="outline"
                    size="sm"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
