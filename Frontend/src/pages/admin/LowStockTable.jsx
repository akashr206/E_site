import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

const lowStockProducts = [
  {
    id: "PRD-001",
    name: "Cotton T-Shirt",
    variant: { color: "Black", size: "M" },
    stock: 3,
    price: 599,
  },
  {
    id: "PRD-002",
    name: "Denim Jeans",
    variant: { color: "Blue", size: "L" },
    stock: 2,
    price: 1299,
  },
  {
    id: "PRD-003",
    name: "Leather Jacket",
    variant: { color: "Brown", size: "XL" },
    stock: 1,
    price: 2499,
  },
  {
    id: "PRD-004",
    name: "Silk Scarf",
    variant: { color: "Red", size: "Free Size" },
    stock: 4,
    price: 899,
  },
]

const getStockBadge = (stock) => {
  if (stock <= 1) {
    return <Badge className="bg-red-500">Critical</Badge>
  } else if (stock <= 3) {
    return <Badge className="bg-yellow-500">Low</Badge>
  } else {
    return <Badge className="bg-green-500">OK</Badge>
  }
}

export function LowStockTable() {
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
          {lowStockProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{`${product.variant.color} / ${product.variant.size}`}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{getStockBadge(product.stock)}</TableCell>
              <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
