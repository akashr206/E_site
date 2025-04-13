import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate, formatCurrency } from "@/lib/utils"

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: new Date("2023-04-10"),
    total: 2500,
    status: "delivered",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: new Date("2023-04-09"),
    total: 1800,
    status: "shipped",
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    date: new Date("2023-04-09"),
    total: 3200,
    status: "confirmed",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    date: new Date("2023-04-08"),
    total: 950,
    status: "pending",
  },
  {
    id: "ORD-005",
    customer: "Michael Wilson",
    date: new Date("2023-04-07"),
    total: 1650,
    status: "cancelled",
  },
]

const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return <Badge className="bg-yellow-500">Pending</Badge>
    case "confirmed":
      return <Badge className="bg-blue-500">Confirmed</Badge>
    case "shipped":
      return <Badge className="bg-purple-500">Shipped</Badge>
    case "delivered":
      return <Badge className="bg-green-500">Delivered</Badge>
    case "cancelled":
      return <Badge className="bg-red-500">Cancelled</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export function RecentOrdersTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{formatDate(order.date)}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
