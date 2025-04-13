"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Jan", revenue: 4000, orders: 240 },
  { name: "Feb", revenue: 3000, orders: 198 },
  { name: "Mar", revenue: 5000, orders: 300 },
  { name: "Apr", revenue: 2780, orders: 190 },
  { name: "May", revenue: 1890, orders: 130 },
  { name: "Jun", revenue: 2390, orders: 150 },
  { name: "Jul", revenue: 3490, orders: 210 },
  { name: "Aug", revenue: 4000, orders: 240 },
  { name: "Sep", revenue: 2780, orders: 190 },
  { name: "Oct", revenue: 1890, orders: 130 },
  { name: "Nov", revenue: 2390, orders: 150 },
  { name: "Dec", revenue: 3490, orders: 210 },
]

export function SalesChart() {
  const isDark = false

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
        <XAxis dataKey="name" stroke={isDark ? "#888" : "#333"} />
        <YAxis stroke={isDark ? "#888" : "#333"} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#333" : "#fff",
            color: isDark ? "#fff" : "#333",
            border: `1px solid ${isDark ? "#444" : "#ddd"}`,
          }}
        />
        <Legend />
        <Bar dataKey="revenue" name="Revenue (₹)" fill="#8884d8" radius={[4, 4, 0, 0]} />
        <Bar dataKey="orders" name="Orders" fill="#82ca9d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
