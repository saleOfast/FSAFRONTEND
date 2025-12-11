import React, { useEffect, useState } from 'react'
import { IOrderSummaryData } from 'types/Order'
import { getOrderSummaryByOrderIdService } from 'services/orderService';
import { Link, useParams } from 'react-router-dom';
import FullPageLoaderWithState from 'component/FullPageLoaderWithState';
import { dateFormatter } from 'utils/common';
import RupeeSymbol from 'component/RupeeSymbol';
import { ArrowLeftOutlined, CheckCircleFilled, DownloadOutlined, PhoneFilled, ClockCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { format } from 'date-fns';
import "../style/orderSummary.css"
import previousPage from 'utils/previousPage';
import { AppDispatch } from 'redux-store/store';
import { useDispatch } from 'react-redux';
import { getPaymentRecordByOrderIdService } from 'services/paymentService';
import { setLoaderAction } from 'redux-store/action/appActions';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Button, Steps, Row, Col, Modal, Skeleton, Table, Tag } from 'antd';
import { InvoiceTemplate } from './invoiceTemplate';
import { OrderStatus } from 'enum/order';
import ReactDOM from 'react-dom';
import { VisitTypeEnum } from 'enum/common';
import { ReturnOfObjet } from './returnOfOrder';
import { getSizeService } from 'services/productService';

export default function OrderSummary() {
	const dispatch = useDispatch<AppDispatch>();
	const params = useParams<{ orderId: string }>();
	const [orderSummaryData, setOrderSummaryData] = useState<IOrderSummaryData | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		async function getOrderSummaryData() {
			try {
				if (params.orderId) {
					setIsLoading(true);
					const res = await getOrderSummaryByOrderIdService(params.orderId);
					setIsLoading(false);
					setOrderSummaryData(res.data.data);
				}
			} catch (error) {
				setIsLoading(false);
			}
		}
		getOrderSummaryData();
	}, [params.orderId]);

	const [paymentRecord, setPaymentRecord] = useState<any>(null);
	const [isNoRecord, setIsNoRecord] = useState<boolean>(false);

	const getPaymentRecordByOrderId = async () => {
		try {
			dispatch(setLoaderAction(true));
			const response = await getPaymentRecordByOrderIdService(String(params?.orderId));
			dispatch(setLoaderAction(false));
			setIsNoRecord(true)
			if (response && response.status === 200) {
				let { data } = response.data;
				setPaymentRecord(data);
			}
		} catch (error) {
			dispatch(setLoaderAction(false));
		}
	};
	useEffect(() => {
		if (params?.orderId) {
			getPaymentRecordByOrderId();
		}
	}, [params?.orderId]);

	const orderTrack = (status: any) => {
		if (OrderStatus.ORDERPLACED === status) {
			return 0
		} else if (OrderStatus.SHIPPED === status) {
			return 1
		}
		else if (OrderStatus.OUTFORDELIVERY === status) {
			return 2
		}
		else if (OrderStatus.DELIVERED === status) {
			return 3
		}else{
			return -1
		}
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return format(date, "eee, do MMM yyyy");
	};
	
	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return format(date, "h:mm a");
	};

	const getLatestStatuses = (statusHistory: any) => {
		const statusMap = new Map();

		if (!statusHistory) {
			return [];
		}

		statusHistory.forEach((statusEntry: any) => {
			const { status, timestamp } = statusEntry;
			if (!statusMap.has(status) || new Date(statusMap.get(status).timestamp) < new Date(timestamp)) {
				statusMap.set(status, statusEntry);
			}
		});

		return Array.from(statusMap.values());
	};

	const latestStatuses = orderSummaryData ? getLatestStatuses(orderSummaryData.statusHistory) : [];
    
	const stepItems = [
		{
			title: 'Order Confirmed',
			description: latestStatuses.find(item => item.status === OrderStatus.ORDERPLACED) ?
				`${formatDate(latestStatuses.find(item => item.status === OrderStatus.ORDERPLACED)?.timestamp)}` : null,
		},
		{
			title: 'Shipped',
			description: latestStatuses.find(item => item.status === OrderStatus.SHIPPED) ?
				`${formatDate(latestStatuses.find(item => item.status === OrderStatus.SHIPPED)?.timestamp)}` : null,
		},
		{
			title: 'Out For Delivery',
			description: latestStatuses.find(item => item.status === OrderStatus.OUTFORDELIVERY) ?
				`${formatDate(latestStatuses.find(item => item.status === OrderStatus.OUTFORDELIVERY)?.timestamp)}` : null,
		},
		{
			title: 'Delivered',
			description: latestStatuses.find(item => item.status === OrderStatus.DELIVERED) ?
				`${formatDate(latestStatuses.find(item => item.status === OrderStatus.DELIVERED)?.timestamp)}` : null,
		},
	];

	// Enhanced Delivery Status Component
	const DeliveryStatus = ({ status, currentStep }: { status: string, currentStep: number }) => {
		const getStatusColor = (status: string) => {
			switch (status) {
				case OrderStatus.DELIVERED:
					return '#8488BF';
				case OrderStatus.CANCELLED:
					return '#ef4444';
				case OrderStatus.OUTFORDELIVERY:
					return '#f59e0b';
				case OrderStatus.SHIPPED:
					return '#3b82f6';
				case OrderStatus.ORDERPLACED:
					return '#8b5cf6';
				default:
					return '#6b7280';
			}
		};

		const getStatusIcon = (status: string) => {
			const iconStyle = { fontSize: '24px' };
			switch (status) {
				case OrderStatus.DELIVERED:
					return <CheckCircleFilled style={{ ...iconStyle, color: '#8488BF' }} />;
				case OrderStatus.CANCELLED:
					return <CloseCircleFilled style={{ ...iconStyle, color: '#ef4444' }} />;
				default:
					return <ClockCircleFilled style={{ ...iconStyle, color: getStatusColor(status) }} />;
			}
		};

		const getStatusText = (status: string) => {
			switch (status) {
				case OrderStatus.ORDERPLACED:
					return 'Order Confirmed';
				case OrderStatus.SHIPPED:
					return 'Shipped';
				case OrderStatus.OUTFORDELIVERY:
					return 'Out for Delivery';
				case OrderStatus.DELIVERED:
					return 'Delivered Successfully';
				case OrderStatus.CANCELLED:
					return 'Order Cancelled';
				default:
					return status;
			}
		};

		const getStatusDescription = (status: string) => {
			switch (status) {
				case OrderStatus.ORDERPLACED:
					return 'Your order has been confirmed and is being processed';
				case OrderStatus.SHIPPED:
					return 'Your order has been shipped and is on its way';
				case OrderStatus.OUTFORDELIVERY:
					return 'Your order is out for delivery today';
				case OrderStatus.DELIVERED:
					return 'Your order has been delivered successfully';
				case OrderStatus.CANCELLED:
					return 'Your order has been cancelled';
				default:
					return 'Tracking your order status';
			}
		};

		const steps = [
			{ 
				title: 'Order Confirmed', 
				status: OrderStatus.ORDERPLACED,
				completed: currentStep >= 0,
				active: currentStep === 0,
				date: latestStatuses.find(item => item.status === OrderStatus.ORDERPLACED)?.timestamp,
				description: 'Order confirmed and processing started'
			},
			{ 
				title: 'Shipped', 
				status: OrderStatus.SHIPPED,
				completed: currentStep >= 1,
				active: currentStep === 1,
				date: latestStatuses.find(item => item.status === OrderStatus.SHIPPED)?.timestamp,
				description: 'Items shipped from warehouse'
			},
			{ 
				title: 'Out for Delivery', 
				status: OrderStatus.OUTFORDELIVERY,
				completed: currentStep >= 2,
				active: currentStep === 2,
				date: latestStatuses.find(item => item.status === OrderStatus.OUTFORDELIVERY)?.timestamp,
				description: 'Out for delivery in your area'
			},
			{ 
				title: 'Delivered', 
				status: OrderStatus.DELIVERED,
				completed: currentStep >= 3,
				active: currentStep === 3,
				date: latestStatuses.find(item => item.status === OrderStatus.DELIVERED)?.timestamp,
				description: 'Package delivered successfully'
			},
		];

		const activeStep = steps.find(step => step.active) || steps[Math.max(0, currentStep)];

		return (
			<div className="delivery-section-enhanced">
				{/* Header Section */}
				<div className="delivery-header-enhanced">
					<div className="status-overview">
						<div className="status-icon-title">
							{getStatusIcon(status)}
							<div className="status-text-container">
								<h2 className="status-title">{getStatusText(status)}</h2>
								<p className="status-description">{getStatusDescription(status)}</p>
							</div>
						</div>
						<Tag 
							color={status === OrderStatus.CANCELLED ? 'red' : 
								   status === OrderStatus.DELIVERED ? 'green' : 
								   status === OrderStatus.OUTFORDELIVERY ? 'orange' : 
								   status === OrderStatus.SHIPPED ? 'blue' : 'purple'}
							className="status-badge-large"
						>
							{getStatusText(status)}
						</Tag>
					</div>

					{/* Estimated Delivery Card */}
					{(orderSummaryData as any)?.estimatedDeliveryDate && status !== OrderStatus.CANCELLED && (
						<div className="delivery-info-card">
							<div className="info-card-header">
								<ClockCircleFilled className="info-card-icon" />
								<span>Estimated Delivery</span>
							</div>
							<div className="estimated-date-highlight">
								{formatDate((orderSummaryData as any).estimatedDeliveryDate)}
							</div>
							{status === OrderStatus.OUTFORDELIVERY && (
								<div className="delivery-today-badge">Delivering Today</div>
							)}
						</div>
					)}
				</div>

				{/* Progress Tracking */}
				{status !== OrderStatus.CANCELLED && (
					<div className="progress-tracking-section">
						<div className="progress-header">
							<h4>Delivery Progress</h4>
							<div className="progress-text">
								Step {currentStep + 1} of {steps.length}
							</div>
						</div>
						
						{/* Progress Bar */}
						<div className="progress-container-enhanced">
							<div className="progress-bar-enhanced">
								<div 
									className="progress-fill-enhanced" 
									style={{ 
										width: `${Math.max(0, (currentStep / (steps.length - 1)) * 100)}%`,
										backgroundColor: getStatusColor(status)
									}}
								/>
							</div>
							
							{/* Steps */}
							<div className="steps-grid">
								{steps.map((step, index) => (
									<div key={step.status} className={`step-item-enhanced ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
										<div className="step-indicator-enhanced">
											{step.completed ? (
												<CheckCircleFilled className="step-icon-completed" />
											) : (
												<div 
													className="step-dot-enhanced" 
													style={{ 
														backgroundColor: step.active ? getStatusColor(status) : '#e5e7eb',
														borderColor: step.active ? getStatusColor(status) : '#e5e7eb'
													}}
												>
													{index + 1}
												</div>
											)}
										</div>
										<div className="step-content-enhanced">
											<div className="step-title-enhanced">{step.title}</div>
											{step.date && (
												<div className="step-date-enhanced">
													{formatDate(step.date)}
												</div>
											)}
											<div className="step-description">{step.description}</div>
											{step.active && (
												<div className="step-badge-current">Current</div>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{/* Status Timeline */}
				<div className="status-timeline-enhanced">
					<h4>Status History</h4>
					<div className="timeline-items-enhanced">
						{latestStatuses.map((statusItem, index) => (
							<div key={index} className="timeline-item-enhanced">
								<div className="timeline-marker-enhanced" style={{ backgroundColor: getStatusColor(statusItem.status) }} />
								<div className="timeline-content-enhanced">
									<div className="timeline-status-enhanced">{getStatusText(statusItem.status)}</div>
									<div className="timeline-date-enhanced">
										{formatDate(statusItem.timestamp)} at {formatTime(statusItem.timestamp)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	};

	const generateInvoiceHtml = (): HTMLDivElement => {
		const container = document.createElement('div');
		container.style.position = 'fixed';
		container.style.top = '-10000px';
		container.style.left = '-10000px';
		container.style.width = '340mm';
		container.style.padding = '10mm';
		container.style.boxSizing = 'border-box';
		container.style.fontSize = '12pt';
		container.style.backgroundColor = '#ffffff';

		document.body.appendChild(container);
		ReactDOM.render(<InvoiceTemplate data={orderSummaryData} sizeData={sizeData} dataSource={dataSource}/>, container);
		return container;
	};

	const downloadInvoicePdf = async () => {
		const invoiceElement = generateInvoiceHtml();

		try {
			const canvas = await html2canvas(invoiceElement, { scale: 2 });
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF('p', 'mm', 'a4');
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();

			const margin = 10; // 10 mm
			const imgWidth = pdfWidth - margin * 2;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			let position = 0;
			let remainingHeight = canvas.height;

			// Loop over the content, adding it to new pages if necessary
			while (remainingHeight > 0) {
				const canvasSection = document.createElement('canvas');
				canvasSection.width = canvas.width;
				canvasSection.height = Math.min(canvas.height, remainingHeight, pdfHeight * 8); // Adjust section height to fit PDF page

				const context = canvasSection.getContext('2d');
				if (context) {
					context.drawImage(
						canvas,
						0,
						position,
						canvas.width,
						canvasSection.height,
						0,
						0,
						canvas.width,
						canvasSection.height
					);
				}

				const sectionData = canvasSection.toDataURL('image/png');
				if (position === 0) {
					pdf.addImage(
						sectionData,
						'PNG',
						margin,
						margin,
						imgWidth,
						(imgWidth * canvasSection.height) / canvas.width
					);
				} else {
					pdf.addPage();
					pdf.addImage(
						sectionData,
						'PNG',
						margin,
						margin,
						imgWidth,
						(imgWidth * canvasSection.height) / canvas.width
					);
				}

				remainingHeight -= canvasSection.height;
				position += canvasSection.height;
			}

			pdf.save('invoice.pdf');
		} finally {
			document.body.removeChild(invoiceElement);
		}
	};
	
	const [returnObject, setReturnObject] = useState<boolean>(false)
	function setReturnOfOrder() {
		setReturnObject(true)
	}
    
	const [sizeData, setSizeData] = useState<any>([]);

	async function fetchSizeData() {
		try {
			dispatch(setLoaderAction(true));
			setIsLoading(true)
			const res = await getSizeService();
			if (res?.data?.status === 200) {
			  setSizeData(res?.data?.data)
				dispatch(setLoaderAction(false));
				setIsLoading(false)
			}
			setIsLoading(false)
			dispatch(setLoaderAction(false));
		} catch (error) {
			dispatch(setLoaderAction(false));
			setIsLoading(false)
		}
	  }
	  
	useEffect(() => {
		  fetchSizeData();
	  }, []);
	  
	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<any>(true);
	let [dataSource, setDataSource] = useState<any[]>([]);
  
	const showLoading = () => {
	  setOpen(true);
	  setLoading(true);
  
	  // Simple loading mock. You should add cleanup logic in real world.
	  setTimeout(() => {
		setLoading(false);
	  }, 1000);
	};
	
	const calculateTotals = (data: any[]) => {
		const totalRow: any = {
		  key: 'total',
		  sn: 'Total',
		  total: 0,
		  price: 0,
		};
	
		data.forEach((row) => {
		  totalRow.total += row.total || 0;
		  totalRow.price += row.price || 0;
		});
	
		return totalRow;
	  };
	
	if (orderSummaryData && orderSummaryData.products) {
		dataSource = orderSummaryData.products.map((data: any, index: number) => {
		  const baseObject = {
			sn: index + 1,
			product: data?.productName,
			colour: data?.colour,
			total: data?.noOfPiece,
			price: Number(data?.noOfPiece) * Number(data?.rlp),
		  };
	  
		  const sizeFields = sizeData.reduce((acc: any, sizeItem: any) => {
			const sizeKey = sizeItem.name;
			acc[sizeKey] = data?.size?.[sizeKey] || 0;
			return acc;
		  }, {});
		
		  return { ...baseObject, ...sizeFields };
		});
	  }
	  
	  const totalRow = calculateTotals(dataSource);
	  dataSource.push(totalRow);
	  
	const defaultColumns: (any & { dataIndex: string })[] = [
		{
		  title: 'SN',
		  dataIndex: 'sn',
		  key: 'sn',
		  width: 60,
		  fixed: "left",
		  render: (text: any, record: any, index: number) => {
			if (index === dataSource?.length - 1) {
			  return {
				children: <span></span>,
			  };
			}
			return <span style={{ color: "blue" }}>{index + 1}</span>
		  },
		},
		{
		  title: 'Product',
		  dataIndex: 'product',
		  key: 'product',
		  width: 160,
		},
		{
		  title: 'Colour',
		  dataIndex: 'colour',
		  key: 'colour',
		  width: 140,
		},
		{
		  title: 'Size',
		  children: sizeData?.sort((a: any, b: any) => a.sizeId - b.sizeId).map((data: any) => ({
			title: data?.name,
			dataIndex: data?.name,
			key: data?.name,
			width: 80,
		  })),
		},
		{
		  title: 'Total',
		  dataIndex: 'total',
		  key: 'total',
		  width: 90,
		},
		{
		  title: 'Price',
		  dataIndex: 'price',
		  key: 'price',
		  width: 90,
		},
		
	  ];
	  
	  const rowClassName = (record: any, index: number) => {
		return index === dataSource.length - 1 ? 'table-row-total' : '';
	  };
	  
	  const downloadPDF = (reportName: string) => {
		const input: any = document.getElementById('pdf-content');
		html2canvas(input).then((canvas: any) => {
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF('p', 'mm', 'a4');
			const imgWidth = 210 - 20;
			const pageHeight = 295 - 20;
			const margin = 10;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;
			let heightLeft = imgHeight;
			
			let position = margin;
	
			pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
			heightLeft -= pageHeight;
	
			while (heightLeft > 0) {
				pdf.addPage();
				position = heightLeft - imgHeight;
				pdf.addImage(imgData, 'PNG', margin, position + margin, imgWidth, imgHeight);
				heightLeft -= pageHeight;
			}
	
			pdf.save(`${reportName}.pdf`);
		});
	};
	
	return (
		<div className='bgSumm'>
			<FullPageLoaderWithState isLoading={isLoading} />
			<header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
				<ArrowLeftOutlined onClick={previousPage} className="back-button" />
				<h1 className="page-title pr-18">Order Summary</h1>
			</header>
			<Modal
				footer={[
					<Button key="back" 
					onClick={() => setOpen(false)}
					>
					  Cancel
					</Button>,
					<Button key="submit" type="primary" loading={loading}
					onClick={downloadInvoicePdf}
					 >
					  Download
					</Button>,
				  ]}
				open={open}
				onCancel={() => setOpen(false)}
				width={"90%"}
			>
				{!loading? 
				<main id="pdf-content">
					<Table
					   title={() => <span className='dflex-center' style={{fontWeight:"bold", textAlign:"center"}}>Order Details (Id: {orderSummaryData?.orderId})</span>}
                        scroll={{ x: "100%" }}
                        rowClassName={rowClassName}
                        bordered
                        dataSource={dataSource}
                        columns={defaultColumns}
                        pagination={false}
                    />
					</main>
				: <Skeleton />
				}
			</Modal>
			{
				orderSummaryData &&
				<section className="main_cls orderSummDesk">
					{/* Delivery Status Section - Enhanced UI */}
					<div className="order_summary_card">
						<DeliveryStatus 
							status={orderSummaryData.orderStatus} 
							currentStep={orderTrack(orderSummaryData.orderStatus)}
						/>
					</div>

					<div className="order_summary_card">
						<div className="card-header-responsive">
							<div className="left_card_inside">
								<h3>Order ID: {orderSummaryData.orderId}</h3>
								<span>Order Date: {dateFormatter(orderSummaryData.createdAt, "dd-MMM-yyyy")}</span>
								{orderSummaryData?.isCallType && orderSummaryData?.isCallType === VisitTypeEnum.TELEVISIT ?
									<div className="order-type">
										<span>Order Type: Phone Order </span>
										<PhoneFilled className="order-type-icon" />
									</div>
									:
									<div className="order-type">
										<span>Order Type: Visit Order </span>
										<img src="https://mrapp.saleofast.com/images/visit.jpg" alt="visitorder" className="order-type-icon" />
									</div>
								}
								<span className='download_invoice hide-in-pdf' onClick={downloadInvoicePdf}>
									<DownloadOutlined />
									Download Invoice
								</span>
							</div>
							<div className="right_card_inside hide-in-pdf">
								<ul>
									<li>
										<Link
											to={`/visit-details/${orderSummaryData.storeId}/${orderSummaryData.visitId}/pictures`}
											state={{ visitDetail: orderSummaryData.visit }}>
											<span className="linkable_className">View Store Picture</span>
										</Link>
									</li>
								</ul>
							</div>
						</div>

						<div className="order-status-section">
							<h4>Order Status</h4>
							{
							orderSummaryData?.orderStatus === OrderStatus.ORDERSAVED ?
							<Steps
								current={1}
								status="finish"
								direction="vertical"
								size="small"
								items={[
									{
										title: 'Initiate',
									},
									{
										title: 'Order Saved',
									},
								]}
							/> :
							orderSummaryData?.orderStatus === OrderStatus.CANCELLED ?
								<Steps
									current={1}
									status="error"
									direction="vertical"
									size="small"
									items={[
										{
											title: 'Initiate',
											description: formatDate(latestStatuses?.find(item => item?.status === OrderStatus.CANCELLED)?.timestamp),
										},
										{
											title: 'Cancelled',
											description: formatDate(latestStatuses?.find(item => item?.status === OrderStatus.CANCELLED)?.timestamp),
										},
									]}
								/> :
								<Steps
									direction="vertical"
									size="small"
									current={orderTrack(orderSummaryData?.orderStatus)}
									items={stepItems}
								/>
							}
						</div>

						<div className="action-buttons-responsive">
							{(orderSummaryData?.orderStatus === OrderStatus.DELIVERED && 
								<Button className="action-btn" onClick={setReturnOfOrder}>
									Return
								</Button>
							)}
							{returnObject && <ReturnOfObjet />}
							
							{orderSummaryData?.orderStatus === OrderStatus.ORDERSAVED &&
								<Link to={orderSummaryData?.visitId ? `/order/order-list/${orderSummaryData?.storeId}/${orderSummaryData?.visitId}/${params?.orderId}`: `/order/form/${orderSummaryData?.storeId}/${null}/${orderSummaryData?.orderId}`}> 
									<Button className="action-btn primary" onClick={showLoading}>
										Place Saved Order
									</Button>
								</Link>
							}
						</div>

						<div className="items-section">
							<h4>{orderSummaryData.products.length} items in this order 
							<Button className="details-btn" type="primary" onClick={showLoading}>
								Details
							</Button>
							</h4>
							<div className="items-table-responsive">
								<table className="items_details">
									<tbody>
										{orderSummaryData.products.map((item, index) => (
											<tr key={index}>
												<td>
													<p className="product-name">{item.productName}</p>
													<div className="product-details">
														{item.noOfCase > 0 && (
															<span className="case-count">Case x {item.noOfCase}</span>
														)}
														{item.noOfPiece > 0 && (
															<span className="piece-count">
																Piece x {item.noOfPiece}
															</span>
														)}
														{item.isFocused && (
															<CheckCircleFilled className='orderSummaryCheckIcon' />
														)}
													</div>
												</td>
												<td>
													<p className="product-price">₹{item.rlp}</p>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					{/* Bill Details Section */}
					<div className="bill_details card-responsive">
						<h4>Bill Details</h4>
						<div className="table-container-responsive">
							<table className="bill_details_table">
								<tbody>
									<tr>
										<td>
											<p className="black_color">MRP</p>
										</td>
										<td>
											<p className="black_color">₹{orderSummaryData.orderAmount}</p>
										</td>
									</tr>
									{orderSummaryData?.skuDiscountValue && (
										<tr>
											<td>
												<p className="green_color">SKU Discount</p>
											</td>
											<td>
												<p className="green_color">- <RupeeSymbol />{orderSummaryData.skuDiscountValue}</p>
											</td>
										</tr>
									)}
									{orderSummaryData?.orderValueDiscountValue && (
										<tr>
											<td>
												<p className="green_color">Order Value Discount</p>
											</td>
											<td>
												<p className="green_color">- <RupeeSymbol />{orderSummaryData.orderValueDiscountValue}</p>
											</td>
										</tr>
									)}
									{orderSummaryData?.flatDiscountValue && (
										<tr>
											<td>
												<p className="green_color">Flat Discount</p>
											</td>
											<td>
												<p className="green_color">- <RupeeSymbol />{orderSummaryData.flatDiscountValue}</p>
											</td>
										</tr>
									)}
									{orderSummaryData?.visibilityDiscountValue && (
										<tr>
											<td>
												<p className="green_color">Visibility Discount</p>
											</td>
											<td>
												<p className="green_color">- <RupeeSymbol />{orderSummaryData.visibilityDiscountValue}</p>
											</td>
										</tr>
									)}
									{orderSummaryData?.specialDiscountAmount && (
										<tr>
											<td>
												<p className="green_color">Special Discount</p>
											</td>
											<td>
												<p className="green_color">- <RupeeSymbol />{orderSummaryData.specialDiscountAmount}</p>
											</td>
										</tr>
									)}
									<tr className="divider-row">
										<td colSpan={2}>
											<hr />
										</td>
									</tr>
									<tr>
										<td>
											<p className="black_color bold">Bill Total</p>
										</td>
										<td>
											<p className="black_color bold">₹{orderSummaryData.netAmount}</p>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					{/* Payment Details Section */}
					<div className="bill_details card-responsive">
						<h4>Payment Details</h4>
						<div className="table-container-responsive">
							<table className="bill_details_table">
								<tbody>
									<tr>
										<td>
											<p className="black_color">Net Amount</p>
										</td>
										<td>
											<p className="black_color">₹{orderSummaryData?.netAmount}</p>
										</td>
									</tr>
									<tr className="divider-row">
										<td>
											<p className="black_color">Collected Amount</p>
										</td>
										<td>
											<p className="black_color">₹{orderSummaryData?.collectedAmount}</p>
										</td>
									</tr>
									<tr>
										<td>
											<p className="black_color bold">Total Pending Amount</p>
										</td>
										<td>
											<p className="black_color bold">₹{(Number(orderSummaryData.netAmount) - Number(orderSummaryData?.collectedAmount))}</p>
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						{/* Payment Records Table */}
						<div className="payment-records-section">
							<div className="table-container-responsive">
								<table className="payment-records-table">
									<thead>
										<tr>
											<th>Payment Id</th>
											<th>Status</th>
											<th>Mode</th>
											<th>Amount</th>
											<th>Invoice Reference</th>
											<th>Date</th>
											<th>Remarks</th>
										</tr>
									</thead>
									<tbody>
										{(paymentRecord && paymentRecord.length > 0) ? paymentRecord.map((item: any, ind: number) => (
											<tr key={ind}>
												<td>{item?.paymentMode === "CASH" ? item?.paymentId : item?.transactionId}</td>
												<td>{item?.status}</td>
												<td>{item?.Mode}</td>
												<td>{item?.Amount}</td>
												<td>{item?.InvoiceReference}</td>
												<td>{item?.Date}</td>
												<td>{item?.Remarks}</td>
											</tr>
										)) : isNoRecord && (
											<tr>
												<td colSpan={7}>No record found</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					{/* Order Details Section */}
					<div className="order_details card-responsive">
						<h4>Order Details</h4>
						<div className="order-details-grid">
							<div className="order-detail-item">
								<p>Order Id</p>
								<span>{orderSummaryData.orderId}</span>
							</div>
							<div className="order-detail-item">
								<p>Order placed</p>
								<span>{dateFormatter(orderSummaryData.orderDate, "ccc dd-MMM-yyyy, h:mm a")}</span>
							</div>
						</div>
					</div>
				</section>
			}
		</div>
	)
}