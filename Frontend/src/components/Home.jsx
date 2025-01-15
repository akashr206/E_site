import {useState, useEffect} from 'react'
import ProductsGrid from './ProductsGrid';
import Loading from './Loading';
const Home = () => {
  const[products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  async function fetchProducts() {
    try {
      const response = await fetch(`${import.meta.env.VITE_APIURL}/api/products/all`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const products = await response.json();
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  }

  useEffect(() => {
    async function loadData() {
      await fetchProducts();
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <ProductsGrid products={products}></ProductsGrid>
    </div>
  )
}

export default Home
