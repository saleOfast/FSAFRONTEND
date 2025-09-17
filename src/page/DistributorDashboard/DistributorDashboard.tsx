import {
    ArrowLeftOutlined,
    DownloadOutlined,
    ShoppingOutlined,
    DollarOutlined,
    StarFilled,
    AimOutlined,
    ShoppingCartOutlined,
    PlusOutlined,
    BarChartOutlined,
    LineChartOutlined,
    MessageOutlined,
    NotificationOutlined,
    BellOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { Progress } from "antd";
import previousPage from "utils/previousPage";
import "../../style/DistributorDashboard.css";

function DistributorDashboard() {
    // Mock data for the dashboard
    const [dashboardData, setDashboardData] = useState({
        monthlySales: 25000,
        salesChange: 31.6,
        orders: 48,
        ordersChange: 12.5,
        commission: 3750,
        commissionRate: 15,
        rating: 4.8,
        reviews: 156,
        targetProgress: 125.0,
        yearToDateCommission: 18450,
        yearToDateChange: 28,
        nextPaymentDate: "Sept 15",
        nextPaymentAmount: 3750,
    });

    // Data for the charts (from the image)
    const salesData = [
        { month: 'Jan', sales: 18000, target: 15000 },
        { month: 'Feb', sales: 21000, target: 16000 },
        { month: 'Mar', sales: 19500, target: 17000 },
        { month: 'Apr', sales: 22000, target: 18000 },
        { month: 'May', sales: 24000, target: 19000 },
        { month: 'Jun', sales: 25000, target: 20000 },
    ];

    const ordersData = [
        { month: 'Jan', orders: 35 },
        { month: 'Feb', orders: 42 },
        { month: 'Mar', orders: 38 },
        { month: 'Apr', orders: 45 },
        { month: 'May', orders: 50 },
        { month: 'Jun', orders: 48 },
    ];

    // Data for top performing products
    const topProducts = [
        { id: 1, name: "Smart TV 55\"", unitsSold: 45, revenue: 22500, margin: 15 },
        { id: 2, name: "Gaming Console", unitsSold: 32, revenue: 16000, margin: 12 },
        { id: 3, name: "Wireless Headphones", unitsSold: 78, revenue: 11700, margin: 20 },
        { id: 4, name: "Laptop Pro", unitsSold: 18, revenue: 21600, margin: 8 },
        { id: 5, name: "Smartphone X", unitsSold: 52, revenue: 31200, margin: 18 },
    ];

    // Data for recent orders
    const recentOrders = [
        { id: 1, orderId: "ORD-2024-001", date: "2024-09-08", items: 15, amount: 4500, status: "delivered" },
        { id: 2, orderId: "ORD-2024-002", date: "2024-09-07", items: 8, amount: 2100, status: "shipped" },
        { id: 3, orderId: "ORD-2024-003", date: "2024-09-06", items: 22, amount: 6700, status: "processing" },
        { id: 4, orderId: "ORD-2024-004", date: "2024-09-05", items: 12, amount: 3200, status: "delivered" },
    ];

    // Data for quick actions
    const quickActions = [
        { id: 1, name: "Place Order", icon: <ShoppingCartOutlined />, action: () => handleNewOrder() },
        { id: 2, name: "Check Inventory", icon: <BarChartOutlined />, action: () => console.log("Checking inventory...") },
        { id: 3, name: "View Payments", icon: <DollarOutlined />, action: () => console.log("Viewing payments...") },
        { id: 4, name: "Support Chat", icon: <MessageOutlined />, action: () => console.log("Opening support chat...") },
    ];

    // Data for notifications with types for different colors
    const notifications = [
        {
            id: 1,
            message: "Payment of $4,500 has been processed",
            time: "2 hours ago",
            read: false,
            type: "payment"
        },
        {
            id: 2,
            message: "New product catalog available for download",
            time: "1 day ago",
            read: false,
            type: "download"
        },
        {
            id: 3,
            message: "Low inventory alert: Gaming Console",
            time: "2 days ago",
            read: true,
            type: "alert"
        },
        {
            id: 4,
            message: "Monthly commission report ready",
            time: "3 days ago",
            read: true,
            type: "report"
        },
    ];

    const monthlyTarget = 20000;

    const handleDownloadReport = () => {
        console.log("Downloading report...");
    };

    const handleNewOrder = () => {
        console.log("Creating new order...");
    };

    // Y-axis values from the image
    const salesYAxisValues = [26000, 19500, 13000, 6500, 0];
    const ordersYAxisValues = [60, 45, 30, 15, 0];

    return (
        <div className="store-v1 storeBgC admin-dashboard">
            <header
                className="heading heading-container"
                style={{ backgroundColor: "#8488BF" }}
            >
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Distributor Dashboard</h1>
            </header>

            <div className="dashboard-container1">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <div className="welcome-header">
                        <div className="welcome-text">
                            <h1>Welcome back, ABC Electronics</h1>
                            <p>Here's your business overview for June 2024</p>
                        </div>
                        <div className="button-group">
                            <button
                                className="download-report-btn"
                                onClick={handleDownloadReport}
                            >
                                <DownloadOutlined />
                                Download Report
                            </button>
                            <button className="new-order-btn" onClick={handleNewOrder}>
                                <ShoppingCartOutlined />
                                New Order
                            </button>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="metrics-grid">
                    {/* Monthly Sales Card */}
                    <div className="metric-card">
                        <div className="metric-header">
                            <span>Monthly Sales</span>
                            <DollarOutlined className="metric-icon" />
                        </div>
                        <div className="metric-value">
                            ${dashboardData.monthlySales.toLocaleString()}
                        </div>
                        <div className="metric-change positive">
                            +{dashboardData.salesChange}% from last month
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="metric-card">
                        <div className="metric-header">
                            <span>Orders This Month</span>
                            <ShoppingCartOutlined className="metric-icon" />
                        </div>
                        <div className="metric-value">{dashboardData.orders}</div>
                        <div className="metric-change positive">
                            +{dashboardData.ordersChange}% from last month
                        </div>
                    </div>

                    {/* Commission Card */}
                    <div className="metric-card">
                        <div className="metric-header">
                            <span>Commission Earned</span>
                            <AimOutlined className="metric-icon" />
                        </div>
                        <div className="metric-value">
                            ${dashboardData.commission.toLocaleString()}
                        </div>
                        <div className="metric-change positive">
                            +{dashboardData.commissionRate}% commission rate
                        </div>
                    </div>

                    {/* Customer Rating Card */}
                    <div className="metric-card">
                        <div className="metric-header">
                            <span>Customer Rating</span>
                            <StarFilled className="metric-icon" />
                        </div>
                        <div className="metric-value">
                            {dashboardData.rating}
                            <StarFilled className="metric-icons" />
                        </div>
                        <div className="metric-subtext">
                            Based on {dashboardData.reviews} reviews
                        </div>
                    </div>
                </div>

               

                {/* Sales Target Progress Section */}
                <div className="target-section">
                    <h2>Sales Target Progress</h2>
                    <p>Your progress towards monthly sales goals</p>

                    <div className="progress-container">
                        <div className="progress-header">
                            <span>Monthly Target</span>
                            <span>
                                ${dashboardData.monthlySales.toLocaleString()} / $
                                {monthlyTarget.toLocaleString()}
                            </span>
                        </div>
                        <Progress
                            percent={dashboardData.targetProgress}
                            status="active"
                            strokeColor={{
                                "0%": "#8488BF",
                                "100%": "#5e64b1",
                            }}
                        />
                        <div className="progress-achieved">
                            <span>{dashboardData.targetProgress}% achieved</span>
                            <span
                                className={
                                    dashboardData.monthlySales >= monthlyTarget
                                        ? "over-target"
                                        : "under-target"
                                }
                            >
                                {dashboardData.monthlySales >= monthlyTarget
                                    ? `+$${(
                                        dashboardData.monthlySales - monthlyTarget
                                    ).toLocaleString()} over target!`
                                    : `-$${(
                                        monthlyTarget - dashboardData.monthlySales
                                    ).toLocaleString()} remaining`}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Charts Section - Both charts in one row */}
                <div className="charts-row">
                    {/* Sales Performance Chart */}
                    <div className="chart-section">
                        <div className="chart-header">
                            <LineChartOutlined className="chart-icon" />
                            <h2>Sales Performance</h2>
                        </div>
                        <p>Monthly sales vs targets over time</p>

                        <div className="chart-container">
                            <div className="chart-y-axis">
                                {salesYAxisValues.map((value, index) => (
                                    <div key={index} className="y-axis-label">${value.toLocaleString()}</div>
                                ))}
                            </div>

                            <div className="chart-content">
                                <div className="chart-grid-lines">
                                    {salesYAxisValues.map((_, index) => (
                                        <div key={index} className="grid-line"></div>
                                    ))}
                                </div>
                                <div className="chart-bars">
                                    {salesData.map((item, index) => (
                                        <div key={index} className="chart-bar-group">
                                            <div
                                                className="chart-bar target-bar"
                                                style={{ height: `${(item.target / 26000) * 100}%` }}
                                            ></div>
                                            <div
                                                className="chart-bar sales-bar"
                                                style={{ height: `${(item.sales / 26000) * 100}%` }}
                                            ></div>
                                            <div className="chart-label">{item.month}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="chart-legend">
                            <div className="legend-item">
                                <div className="legend-color sales-color"></div>
                                <span>Actual Sales</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color target-color"></div>
                                <span>Target</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Trends Chart */}
                    <div className="chart-section">
                        <div className="chart-header">
                            <BarChartOutlined className="chart-icon" />
                            <h2>Order Trends</h2>
                        </div>
                        <p>Number of orders placed each month</p>

                        <div className="chart-container">
                            <div className="chart-y-axis">
                                {ordersYAxisValues.map((value, index) => (
                                    <div key={index} className="y-axis-label">{value}</div>
                                ))}
                            </div>

                            <div className="chart-content">
                                <div className="chart-grid-lines">
                                    {ordersYAxisValues.map((_, index) => (
                                        <div key={index} className="grid-line"></div>
                                    ))}
                                </div>
                                <div className="chart-bars">
                                    {ordersData.map((item, index) => (
                                        <div key={index} className="chart-bar-group">
                                            <div
                                                className="chart-bar orders-bar"
                                                style={{ height: `${(item.orders / 60) * 100}%` }}
                                            ></div>
                                            <div className="chart-label">{item.month}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Performing Products and Recent Orders Section */}
                <div className="info-cards-row">
                    {/* Top Performing Products */}
                    <div className="info-card">
                        <div className="info-card-header">
                            <h2>Top Performing Products</h2>
                            <p>Your best-selling products this month</p>
                        </div>
                        <div className="products-list">
                            {topProducts.map((product, index) => (
                                <div key={product.id} className="product-item">
                                    <div className="product-rank">{index + 1}</div>
                                    <div className="product-info">
                                        <div className="product-name">{product.name}</div>
                                        <div className="product-stats">
                                            <span className="units-sold">{product.unitsSold} units sold</span>
                                        </div>
                                    </div>
                                    <div className="product-financial">
                                        <div className="product-revenue">${product.revenue.toLocaleString()}</div>
                                        <div className="product-margin">{product.margin}% margin</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="info-card">
                        <div className="info-card-header">
                            <h2>Recent Orders</h2>
                            <p>Your latest order history</p>
                        </div>
                        <div className="orders-list">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="order-item">
                                    <div className="order-info">
                                        <div className="order-id">{order.orderId}</div>
                                        <div className="order-date-items">
                                            {order.date} - {order.items} items
                                        </div>
                                    </div>
                                    <div className="order-details">
                                        <div className="order-amount">${order.amount.toLocaleString()}</div>
                                        <div className={`order-status ${order.status}`}>{order.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Quick Actions and Notifications Row */}
                <div className="actions-notifications-row">
                    {/* Quick Actions Section */}
                    <div className="quick-actions-section">
                        <div className="section-header">
                            <h2>Quick Actions</h2>
                            <p>Frequently used actions and tools</p>
                        </div>
                        <div className="quick-actions-grid">
                            {quickActions.map((action) => (
                                <div
                                    key={action.id}
                                    className="quick-action-item"
                                    onClick={action.action}
                                >
                                    <div className="action-icon">
                                        {action.icon}
                                    </div>
                                    <span className="action-name">{action.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="notifications-section">
                        <div className="section-header">
                            <h2>Notifications</h2>
                            <p>Recent updates and alerts</p>
                        </div>
                        <div className="notifications-list">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`}
                                >
                                    <div className={`notification-bullet ${notification.type}`}>•</div>
                                    <div className="notification-content">
                                        <div className="notification-message">
                                            {notification.message}
                                        </div>
                                        <div className="notification-time">
                                            {notification.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="view-all-notifications">
                            <span><BellOutlined /> View All Notifications</span>
                        </div>
                    </div>
                </div>
                 {/* Commission Summary Section */}
                <div className="commission-summary-section">
                    <div className="section-header">
                        <h2>Commission Summary</h2>
                        <p>Your earnings and payment schedule</p>
                    </div>
                    
                    <div className="commission-grid">
                        <div className="commission-card">
                            <div className="commission-header">
                                {/* <DollarOutlined className="commission-icon" /> */}
                                <h3>This Month</h3>
                            </div>
                            <div className="commission-value">${dashboardData.commission.toLocaleString()}</div>
                            <div className="commission-subtext">
                                {dashboardData.commissionRate}% avg. commission
                            </div>
                        </div>
                        
                        <div className="commission-card">
                            <div className="commission-header">
                                {/* <CalendarOutlined className="commission-icon" /> */}
                                <h3>Year to Date</h3>
                            </div>
                            <div className="commission-value">${dashboardData.yearToDateCommission.toLocaleString()}</div>
                            <div className="commission-subtext positive">
                                +{dashboardData.yearToDateChange}% vs last year
                            </div>
                        </div>
                        
                        <div className="commission-card">
                            <div className="commission-header">
                                {/* <BellOutlined className="commission-icon" /> */}
                                <h3>Next Payment</h3>
                            </div>
                            <div className="commission-value">{dashboardData.nextPaymentDate}</div>
                            <div className="commission-subtext">
                                ${dashboardData.nextPaymentAmount.toLocaleString()} pending
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DistributorDashboard;