import { useState, useEffect } from "react";
import AdminSidebar from "../../components/Admin/Sidebar";
import DashboardOverview from "./DashboardOverview";
import ProductsPage from "./ProductsPage";
import OrdersPage from "./OrdersPage";
import UsersPage from "./UsersPage";
import AnalyticsPage from "./AnalyticsPage";
import SettingsPage from "./Settings";
import { useParams } from "react-router-dom";

export default function Dashboard() {
    const { page } = useParams();
    const [activePage, setActivePage] = useState(page);

    useEffect(() => {
        setActivePage(page);
    }, [page]);

    const renderPage = () => {
        switch (activePage) {
            case "dashboard":
                return <DashboardOverview />;
            case "products":
                return <ProductsPage />;
            case "orders":
                return <OrdersPage />;
            case "users":
                return <UsersPage />;
            case "analytics":
                return <AnalyticsPage />;
            case "settings":
                return <SettingsPage />;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <div className="flex  w-full overflow-hidden bg-background">
            <AdminSidebar
                renderPage={renderPage}
                setActivePage={setActivePage}
                activePage={activePage}
            />
        </div>
    );
}
