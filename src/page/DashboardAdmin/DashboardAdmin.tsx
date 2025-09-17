import {
    ArrowLeftOutlined,
    PlusOutlined,
    DashboardOutlined,
    LoadingOutlined,
    WarningOutlined,
    UsergroupDeleteOutlined,
    DollarOutlined,
    InboxOutlined,
    AreaChartOutlined
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
} from 'chart.js';
import previousPage from "utils/previousPage";
import "../../style/DashboardAdmin1.css";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Define TypeScript interfaces for our data
interface DashboardMetrics {
    totalRevenue: number;
    activeDistributors: number;
    totalOrders: number;
    pendingApproval: number;
    revenueChange: number;
    distributorsChange: number;
    ordersChange: number;
}

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string | string[];
        borderColor: string | string[];
        borderWidth: number;
    }[];
}

interface DistributorStatus {
    active: number;
    inactive: number;
    pending: number;
}

interface RegionData {
    name: string;
    distributors: number;
    sales: number;
    growth: number;
}

interface TopDistributor {
    name: string;
    revenue: number;
    region: string;
    orders: number;
    growth: number;
}

interface SystemActivity {
    message: string;
    timestamp: string;
    status: 'pending' | 'success' | 'warning';
}

interface DashboardData {
    metrics: DashboardMetrics;
    revenueData: ChartData;
    distributorStatus: DistributorStatus;
    regionalData: RegionData[];
    topDistributors: TopDistributor[];
    systemActivities: SystemActivity[];
    lastUpdated: string;
}
interface DashboardMetrics {
    totalRevenue: number;
    activeDistributors: number;
    totalOrders: number;
    pendingApproval: number;
    revenueChange: number;
    distributorsChange: number;
    ordersChange: number;
    // Add these for full dynamic functionality
    revenueTarget?: number;
    distributorTarget?: number;
    orderFulfillmentRate?: number;
    customerSatisfaction?: number;
}

function DashboardAdmin() {
    // State for dashboard data
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data from API (to be implemented)
    useEffect(() => {
        // This will be replaced with actual API call
        fetchDashboardData();
    }, []);

    // Mock function to simulate API call
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // This data would come from your API
            const mockData: DashboardData = {
                metrics: {
                    totalRevenue: 670000,
                    activeDistributors: 178,
                    totalOrders: 1780,
                    pendingApproval: 23,
                    revenueChange: 21.8,
                    distributorsChange: 6,
                    ordersChange: 17
                },
                revenueData: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Revenue',
                            data: [320000, 380000, 450000, 520000, 550000, 670000],
                            backgroundColor: '#b7b5e7',
                            borderColor: '#b7b5e7',
                            borderWidth: 1,
                        },
                    ],
                },
                distributorStatus: {
                    active: 148,
                    inactive: 7,
                    pending: 23
                },
                regionalData: [
                    {
                        name: "North America",
                        distributors: 68,
                        sales: 245000,
                        growth: 12.5
                    },
                    {
                        name: "Europe",
                        distributors: 42,
                        sales: 189000,
                        growth: 8.7
                    },
                    {
                        name: "Asia Pacific",
                        distributors: 42,
                        sales: 156000,
                        growth: 15.2
                    },
                    {
                        name: "Latin America",
                        distributors: 26,
                        sales: 98000,
                        growth: 9.4
                    }
                ],
                topDistributors: [
                    {
                        name: "ABC Electronics",
                        revenue: 125000,
                        region: "North America",
                        orders: 45,
                        growth: 12.5
                    },
                    {
                        name: "Tech Solutions Ltd",
                        revenue: 98000,
                        region: "Europe",
                        orders: 38,
                        growth: 8.2
                    },
                    {
                        name: "Smart Devices Co",
                        revenue: 76000,
                        region: "North America",
                        orders: 29,
                        growth: 15.3
                    },
                    {
                        name: "Future Tech",
                        revenue: 65000,
                        region: "Europe",
                        orders: 25,
                        growth: 5.7
                    }
                ],
                systemActivities: [
                    {
                        message: "New distributor application from TechMax Solutions",
                        timestamp: "2 hours ago",
                        status: "pending"
                    },
                    {
                        message: "Large order processed: $45,000 from ABC Electronics",
                        timestamp: "4 hours ago",
                        status: "success"
                    },
                    {
                        message: "Commission payment processed for 25 distributors",
                        timestamp: "6 hours ago",
                        status: "success"
                    },
                    {
                        message: "Low inventory alert: Gaming Console XL",
                        timestamp: "8 hours ago",
                        status: "warning"
                    }
                ],
                lastUpdated: new Date().toISOString()
            };

            setDashboardData(mockData);
            setError(null);
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Prepare doughnut chart data from API data
    const getDoughnutChartData = () => {
        if (!dashboardData) return null;

        return {
            labels: ['Active', 'Inactive', 'Pending'],
            datasets: [
                {
                    data: [
                        dashboardData.distributorStatus.active,
                        dashboardData.distributorStatus.inactive,
                        dashboardData.distributorStatus.pending
                    ],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    // Chart options with proper typing
    const barChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Revenue',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value: string | number) {
                        const v = typeof value === 'number' ? value : Number(value);
                        if (Number.isNaN(v)) return String(value);
                        return '$' + v.toLocaleString();
                    },
                },
            },
        },
    };

    const doughnutChartOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get status icon based on activity status
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <div className="status-indicator pending"><LoadingOutlined /></div>;
            case 'success':
                return <div className="status-indicator success"><DashboardOutlined /></div>;
            case 'warning':
                return <div className="status-indicator warning"><WarningOutlined /></div>;
            default:
                return <div className="status-indicator"><DashboardOutlined /></div>;
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="store-v1 storeBgC admin-dashboard">
                <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }} >
                    <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                    <h1 className="page-title pr-18">Admin Dashboard</h1>
                </header>
                <div className="admin-dashboard-content loading-state">
                    <LoadingOutlined style={{ fontSize: 48 }} />
                    <p>Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="store-v1 storeBgC admin-dashboard">
                <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }} >
                    <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                    <h1 className="page-title pr-18">Admin Dashboard</h1>
                </header>
                <div className="admin-dashboard-content error-state">
                    <p className="error-message">{error}</p>
                    <button onClick={fetchDashboardData} className="retry-button">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="store-v1 storeBgC admin-dashboard">
            <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }} >
                <ArrowLeftOutlined onClick={previousPage} className="back-button" />
                <h1 className="page-title pr-18">Admin Dashboard</h1>
            </header>

            {/* Dashboard content */}
            <div className="admin-dashboard-content">
                <div className="dashboard-header">
                    <div className="dashboard-header-left">
                        <h2>Admin Dashboard</h2>
                        <p>System overview and management for June 2024</p>
                        {dashboardData && (
                            <small className="last-updated">
                                {/* Last updated: {new Date(dashboardData.lastUpdated).toLocaleString()} */}
                            </small>
                        )}
                    </div>
                    <div className="dashboard-header-right">
                        <button className="header-button system-health-btn">
                            <AreaChartOutlined />
                            <span className="button-text">System Health</span>
                        </button>
                        <button className="header-button add-distributor-btn">
                            <PlusOutlined />
                            <span className="button-text">Add Distributor</span>
                        </button>
                    </div>
                </div>

                {/* Metrics - Responsive grid */}
                {dashboardData && (
                    <>
                        <div className="metrics-grid">
                            <div className="metric-card total-revenue">
                                <div className="metric-card-header">
                                    <h3>Total Revenue</h3>
                                    <DollarOutlined style={{ color: "black", fontSize: 22 }} />
                                </div>
                                <div className="metric-value">
                                    {formatCurrency(dashboardData.metrics.totalRevenue)}
                                </div>
                                <div className="metric-change">
                                    +{dashboardData.metrics.revenueChange}% from last month
                                </div>
                            </div>


                            <div className="metric-card active-distributors">
                                <div className="metric-card-header">
                                    <h3>Active Distributors</h3>
                                    <UsergroupDeleteOutlined style={{ color: "black", fontSize: 22 }} />
                                </div>
                                <div className="metric-value">{dashboardData.metrics.activeDistributors}</div>
                                <div className="metric-change">
                                    +{dashboardData.metrics.distributorsChange} new this month
                                </div>
                            </div>


                            <div className="metric-card">
                                <div className="metric-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <h3>Total Orders</h3>
                                    <InboxOutlined style={{ color: "black", fontSize: 22 }} />
                                </div>
                                <div className="metric-value">
                                    {dashboardData.metrics.totalOrders.toLocaleString()}
                                </div>
                                <div className="metric-change">
                                    +{dashboardData.metrics.ordersChange}% from last month
                                </div>
                            </div>

                            <div className="metric-card pending-approval">
                                <div className="metric-card-header">
                                    <h3>Pending Approval</h3>
                                    <WarningOutlined
                                        style={{ color: "black", fontSize: 22 }}
                                    />
                                </div>
                                <div className="metric-value">{dashboardData.metrics.pendingApproval}</div>
                                <div className="metric-alert">Requires immediate attention</div>
                            </div>

                        </div>



                        {/* Charts */}
                        <div className="charts-container">
                            <div className="chart-card">
                                <h3>Revenue & Growth Trends</h3>
                                <p>Monthly revenue and distributor growth over time</p>
                                <div className="chart-wrapper">
                                    <Bar data={dashboardData.revenueData} options={barChartOptions} />
                                </div>
                            </div>

                            <div className="chart-card">
                                <h3>Distributor Status Distribution</h3>
                                <p>Current status breakdown of all distributors</p>
                                <div className="chart-wrapper">
                                    {getDoughnutChartData() && (
                                        <Doughnut
                                            data={getDoughnutChartData()!}
                                            options={doughnutChartOptions}
                                        />
                                    )}
                                </div>
                                <div className="status-labels">
                                    <div className="status-item">
                                        <span className="status-dot active"></span>
                                        <span>Active: {dashboardData.distributorStatus.active}</span>
                                    </div>
                                    <div className="status-item">
                                        <span className="status-dot inactive"></span>
                                        <span>Inactive: {dashboardData.distributorStatus.inactive}</span>
                                    </div>
                                    <div className="status-item">
                                        <span className="status-dot pending"></span>
                                        <span>Pending: {dashboardData.distributorStatus.pending}</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Regional Performance Section */}
                        <div className="regional-performance-section">
                            <h3>Regional Performance Overview</h3>
                            <p>Performance metrics by geographic region</p>
                            <div className="regional-grid">
                                {dashboardData.regionalData.map((region, index) => (
                                    <div key={index} className="region-card">
                                        <div className="region-header">
                                            <h4>{region.name}</h4>
                                            <span className={`region-dot region-dot-${index + 1}`}></span>
                                        </div>
                                        <div className="region-metrics">
                                            <div className="region-metric">
                                                <span className="metric-label">Distributors</span>
                                                <span className="metric-value">{region.distributors}</span>
                                            </div>
                                            <div className="region-metric">
                                                <span className="metric-label">Sales</span>
                                                <span className="metric-value">{formatCurrency(region.sales)}</span>
                                            </div>
                                            <div className="region-metric">
                                                <span className="metric-label">Growth</span>
                                                <span className="metric-value positive">+{region.growth}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* New Sections: Top Performing Distributors and Recent System Activities */}
                        <div className="additional-sections-grid">
                            {/* Top Performing Distributors */}
                            <div className="section-card">
                                <h3>Top Performing Distributors</h3>
                                <p>Highest revenue distributors this month</p>
                                <div className="distributors-list">
                                    {dashboardData.topDistributors.map((distributor, index) => (
                                        <div key={index} className="distributor-item">
                                            <div className="distributor-rank">{index + 1}</div>
                                            <div className="distributor-info">
                                                <div className="distributor-name-container">
                                                    <span className="distributor-name">{distributor.name}</span>
                                                    <span className="distributor-revenue">{formatCurrency(distributor.revenue)}</span>
                                                </div>
                                                <div className="distributor-details">
                                                    {distributor.region} · {distributor.orders} orders
                                                    <span className="distributor-growth">+{distributor.growth}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent System Activities */}
                            <div className="section-card">
                                <h3>Recent System Activities</h3>
                                <p>Latest events and notifications</p>
                                <div className="activities-list">
                                    {dashboardData.systemActivities.map((activity, index) => (
                                        <div key={index} className="activity-item">
                                            {/* Status indicator dot */}
                                            <div className={`status-dot-indicator ${activity.status}`}></div>

                                            <div className="activity-content">
                                                <div className="activity-message">{activity.message}</div>
                                                <div className="activity-timestamp">{activity.timestamp}</div>
                                            </div>

                                            {/* Status text at the end */}
                                            <div className={`activity-status ${activity.status}`}>
                                                {activity.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <div className="monthly-performance-section">
                            <h3>Monthly Performance Summary</h3>
                            <p>Key metrics and achievements for the current month</p>

                            <div className="performance-metrics-grid-full">
                                {/* Revenue Target Card */}
                                <div className="performance-metric-full">
                                    <div className="metric-header-full">
                                        <span className="metric-title-full">Revenue Target</span>
                                        <div className="metric-values-container">
                                            <div className="metric-values-full">
                                                <span className="metric-achieved-full">
                                                    {dashboardData ? formatCurrency(dashboardData.metrics.totalRevenue) : "$0"}
                                                </span>
                                                <span className="metric-target-full">
                                                    {dashboardData ? ` / ${formatCurrency(600000)}` : " / $0"}
                                                </span>
                                            </div>
                                            <div className="metric-percentage-full positive-full">
                                                {dashboardData ? `${Math.round((dashboardData.metrics.totalRevenue / 600000) * 100)}%` : "0%"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="progress-bar-full">
                                        <div
                                            className="progress-fill-full"
                                            style={{
                                                width: `${dashboardData ? Math.min(100, (dashboardData.metrics.totalRevenue / 600000) * 100) : 0}%`,
                                                backgroundColor: dashboardData ?
                                                    (dashboardData.metrics.totalRevenue >= 600000 ? '#52c41a' : '#1890ff') : '#d9d9d9'
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* New Distributors Card */}
                                <div className="performance-metric-full">
                                    <div className="metric-header-full">
                                        <span className="metric-title-full">New Distributors</span>
                                        <div className="metric-values-container">
                                            <div className="metric-values-full">
                                                <span className="metric-achieved-full">
                                                    {dashboardData ? dashboardData.metrics.distributorsChange : "0"}
                                                </span>
                                                <span className="metric-target-full"> / 5</span>
                                            </div>
                                            <div className="metric-percentage-full positive-full">
                                                {dashboardData ? `${Math.round((dashboardData.metrics.distributorsChange / 5) * 100)}%` : "0%"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="progress-bar-full">
                                        <div
                                            className="progress-fill-full"
                                            style={{
                                                width: `${dashboardData ? Math.min(100, (dashboardData.metrics.distributorsChange / 5) * 100) : 0}%`,
                                                backgroundColor: dashboardData ?
                                                    (dashboardData.metrics.distributorsChange >= 5 ? '#52c41a' : '#1890ff') : '#d9d9d9'
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Order Fulfillment Card */}
                                <div className="performance-metric-full">
                                    <div className="metric-header-full">
                                        <span className="metric-title-full">Order Fulfillment</span>
                                        <div className="metric-values-container">
                                            <div className="metric-values-full">
                                                <span className="metric-achieved-full">
                                                    {dashboardData ? "97.8%" : "0%"}
                                                </span>
                                            </div>
                                            <div className="metric-rating-full excellent-full">
                                                Excellent
                                            </div>
                                        </div>
                                    </div>
                                    <div className="progress-bar-full">
                                        <div
                                            className="progress-fill-full"
                                            style={{
                                                width: `${dashboardData ? "97.8" : "0"}%`,
                                                backgroundColor: '#faad14'
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Customer Satisfaction Card */}
                                <div className="performance-metric-full">
                                    <div className="metric-header-full">
                                        <span className="metric-title-full">Customer Satisfaction</span>
                                        <div className="metric-values-container">
                                            <div className="metric-values-full">
                                                <span className="metric-achieved-full">
                                                    4.7
                                                </span>
                                                <span className="metric-target-full"> / 5.0</span>
                                            </div>
                                            <div className="metric-percentage-full positive-full">
                                                94%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="progress-bar-full">
                                        <div
                                            className="progress-fill-full"
                                            style={{
                                                width: '94%',
                                                backgroundColor: '#f5222d'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
export default DashboardAdmin;