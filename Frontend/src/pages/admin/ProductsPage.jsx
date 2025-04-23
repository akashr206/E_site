import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddProduct from "../../components/Admin/AddProduct";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronLeft,
    ChevronRight,
    Edit,
    MoreHorizontal,
    Search,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { API_URL } from "../../config/api";
import DeleteProduct from "../../components/Admin/DeleteProduct";
import { Skeleton } from "../../components/ui/skeleton";
import { useSearchParams } from "react-router-dom";

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [gettingProducts, setGettingProducts] = useState(false);
    const [max, setMax] = useState(1);
    const [products, setProducts] = useState([
        {
            id: "",
            name: "",
            price: 0,
            mrp: 0,
            category: [],
            material: "",
            variants: [
                { color: "", size: "", stock: 0 },
                { color: "", size: "", stock: 0 },
            ],
        },
    ]);
    const [editProduct, setEditProduct] = useState({});
    const page = searchParams.get("page");
    const limit = 10;

    const filteredProducts =
        products?.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.id.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory =
                categoryFilter === "all" ||
                product.category.some(
                    (cat) => cat.toLowerCase() === categoryFilter.toLowerCase()
                );

            return matchesSearch && matchesCategory;
        }) || [];

    const getTotalStock = (variants) => {
        return variants.reduce(
            (total, variant) => Number(total) + Number(variant.stock),
            0
        );
    };

    const getUniqueCategories = () => {
        const categories = new Set();
        products?.forEach((product) => {
            product.category.forEach((cat) => categories.add(cat));
        });
        return Array.from(categories);
    };

    async function fetchProducts(page = page, limit = limit) {
        setGettingProducts(true);
        const res = await fetch(
            `${API_URL}/api/products/all?page=${page}&limit=${limit}`
        );
        const data = await res.json();
        if (res.ok) {
            setProducts(data.products);
            setMax(data.pagination.totalPages);
            setGettingProducts(false);
        }
    }
    const handleNext = () => {
        const page = searchParams.get("page");
        if (Number(page) + 1 <= max) {
            searchParams.set("page", Number(page) + 1);
            setSearchParams(searchParams);
        }
    };
    const handlePrev = () => {
        const page = searchParams.get("page");
        if (Number(page) - 1 > 0) {
            searchParams.set("page", Number(page) - 1);
            setSearchParams(searchParams);
        }
    };

    useEffect(() => {
        fetchProducts(page, limit);
    }, [page]);

    return (
        <div className="flex flex-col gap-6">
            {editProduct && (
                <AddProduct
                    getUniqueCategories={getUniqueCategories}
                    tab={{ type: "edit", data: editProduct }}
                    fetchProducts={fetchProducts}
                    EditOpen={editProduct.name}
                    setEditOpen={setEditProduct}
                />
            )}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <p className="text-muted-foreground">
                    Manage your product inventory, add new products, and update
                    existing ones.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Categories
                                </SelectItem>
                                {getUniqueCategories().map((category) => (
                                    <SelectItem
                                        key={category}
                                        value={category.toLowerCase()}
                                    >
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <AddProduct
                        getUniqueCategories={getUniqueCategories}
                        fetchProducts={fetchProducts}
                    ></AddProduct>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>MRP</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Material</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Variants</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {gettingProducts
                                    ? Array.from({ length: 10 }).map(
                                          (_, idx) => (
                                              <TableRow key={idx}>
                                                  <TableCell>
                                                      <Skeleton className="h-4 w-16" />
                                                  </TableCell>
                                                  <TableCell>
                                                      <Skeleton className="h-4 w-32" />
                                                  </TableCell>
                                                  <TableCell>
                                                      <Skeleton className="h-4 w-10" />
                                                  </TableCell>
                                                  <TableCell>
                                                      <Skeleton className="h-4 w-10" />
                                                  </TableCell>
                                                  <TableCell>
                                                      <div className="inline-flex px-2 py-1 text-xs font-medium rounded-full">
                                                          <Skeleton className="h-4 w-12 rounded-full" />
                                                      </div>
                                                  </TableCell>
                                                  <TableCell>
                                                      <Skeleton className="h-4 w-20" />
                                                  </TableCell>
                                                  <TableCell>
                                                      <Skeleton className="h-4 w-12" />
                                                  </TableCell>
                                                  <TableCell>
                                                      <Skeleton className="h-4 w-24" />
                                                  </TableCell>
                                                  <TableCell className="text-right">
                                                      <Skeleton className="h-4 w-16 ml-auto" />
                                                  </TableCell>
                                              </TableRow>
                                          )
                                      )
                                    : filteredProducts.map((product) => (
                                          <TableRow key={product.id}>
                                              <TableCell className="font-medium">
                                                  {product.id.substring(0, 8)}
                                              </TableCell>
                                              <TableCell>
                                                  {product.name}
                                              </TableCell>
                                              <TableCell>
                                                  {formatCurrency(
                                                      product.price
                                                  )}
                                              </TableCell>
                                              <TableCell>
                                                  {formatCurrency(product.mrp)}
                                              </TableCell>
                                              <TableCell>
                                                  <div className="flex flex-wrap gap-1">
                                                      {product.category.map(
                                                          (cat, index) => (
                                                              <Badge
                                                                  key={index}
                                                                  variant="outline"
                                                              >
                                                                  {cat}
                                                              </Badge>
                                                          )
                                                      )}
                                                  </div>
                                              </TableCell>
                                              <TableCell>
                                                  {product.material}
                                              </TableCell>
                                              <TableCell>
                                                  {getTotalStock(
                                                      product.variants
                                                  )}
                                              </TableCell>
                                              <TableCell>
                                                  {product.variants.length}
                                              </TableCell>
                                              <TableCell className="text-right">
                                                  <DropdownMenu>
                                                      <DropdownMenuTrigger
                                                          asChild
                                                      >
                                                          <Button
                                                              variant="ghost"
                                                              size="icon"
                                                          >
                                                              <MoreHorizontal className="h-4 w-4" />
                                                              <span className="sr-only">
                                                                  Open menu
                                                              </span>
                                                          </Button>
                                                      </DropdownMenuTrigger>
                                                      <DropdownMenuContent align="end">
                                                          <DropdownMenuLabel>
                                                              Actions
                                                          </DropdownMenuLabel>
                                                          <DropdownMenuItem
                                                              onClick={() =>
                                                                  setEditProduct(
                                                                      product
                                                                  )
                                                              }
                                                          >
                                                              <Edit className="h-4 w-4" />
                                                              Edit
                                                          </DropdownMenuItem>
                                                          <DropdownMenuItem
                                                              asChild
                                                          >
                                                              <DeleteProduct
                                                                  id={
                                                                      product.id
                                                                  }
                                                                  publicIds={
                                                                      product.imageIds
                                                                  }
                                                                  fetchProducts={
                                                                      fetchProducts
                                                                  }
                                                              ></DeleteProduct>
                                                          </DropdownMenuItem>
                                                      </DropdownMenuContent>
                                                  </DropdownMenu>
                                              </TableCell>
                                          </TableRow>
                                      ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-end space-x-2">
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
        </div>
    );
}
