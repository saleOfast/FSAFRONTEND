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

	// Improved Delivery Status Component
	const DeliveryStatus = ({ status, currentStep }: { status: string, currentStep: number }) => {
		const getStatusColor = (status: string) => {
			switch (status) {
				case OrderStatus.DELIVERED:
					return '#52c41a';
				case OrderStatus.CANCELLED:
					return '#ff4d4f';
				case OrderStatus.OUTFORDELIVERY:
					return '#fa8c16';
				case OrderStatus.SHIPPED:
					return '#1890ff';
				case OrderStatus.ORDERPLACED:
					return '#722ed1';
				default:
					return '#8488BF';
			}
		};

		const getStatusIcon = (status: string) => {
			switch (status) {
				case OrderStatus.DELIVERED:
					return <CheckCircleFilled style={{ color: '#52c41a', fontSize: '20px' }} />;
				case OrderStatus.CANCELLED:
					return <CloseCircleFilled style={{ color: '#ff4d4f', fontSize: '20px' }} />;
				default:
					return <ClockCircleFilled style={{ color: getStatusColor(status), fontSize: '20px' }} />;
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
					return 'Delivered';
				case OrderStatus.CANCELLED:
					return 'Cancelled';
				default:
					return status;
			}
		};

		const steps = [
			{ 
				title: 'Order Confirmed', 
				status: OrderStatus.ORDERPLACED,
				completed: currentStep >= 0,
				active: currentStep === 0,
				date: latestStatuses.find(item => item.status === OrderStatus.ORDERPLACED)?.timestamp 
			},
			{ 
				title: 'Shipped', 
				status: OrderStatus.SHIPPED,
				completed: currentStep >= 1,
				active: currentStep === 1,
				date: latestStatuses.find(item => item.status === OrderStatus.SHIPPED)?.timestamp 
			},
			{ 
				title: 'Out for Delivery', 
				status: OrderStatus.OUTFORDELIVERY,
				completed: currentStep >= 2,
				active: currentStep === 2,
				date: latestStatuses.find(item => item.status === OrderStatus.OUTFORDELIVERY)?.timestamp 
			},
			{ 
				title: 'Delivered', 
				status: OrderStatus.DELIVERED,
				completed: currentStep >= 3,
				active: currentStep === 3,
				date: latestStatuses.find(item => item.status === OrderStatus.DELIVERED)?.timestamp 
			},
		];

		return (
			<div className="delivery-section-improved">
				<div className="delivery-header">
					<div className="header-left">
						<h3>Delivery Status</h3>
						<div className="current-status">
							{getStatusIcon(status)}
							<span className="status-text-large">{getStatusText(status)}</span>
							<Tag 
								color={status === OrderStatus.CANCELLED ? 'red' : 
									   status === OrderStatus.DELIVERED ? 'green' : 
									   status === OrderStatus.OUTFORDELIVERY ? 'orange' : 'blue'}
								className="status-tag"
							>
								{getStatusText(status)}
							</Tag>
						</div>
					</div>
					{(orderSummaryData as any)?.estimatedDeliveryDate && (
						<div className="estimated-delivery-card">
							<ClockCircleFilled style={{ color: '#fa8c16', marginRight: '8px' }} />
							<div>
								<div className="estimated-label">Estimated Delivery</div>
								<div className="estimated-date">{formatDate((orderSummaryData as any).estimatedDeliveryDate)}</div>
							</div>
						</div>
					)}
				</div>

				{/* Progress Bar */}
				<div className="progress-container">
					<div className="progress-bar">
						<div 
							className="progress-fill" 
							style={{ 
								width: `${Math.max(0, (currentStep / (steps.length - 1)) * 100)}%`,
								backgroundColor: getStatusColor(status)
							}}
						/>
					</div>
					
					<div className="steps-container">
						{steps.map((step, index) => (
							<div key={step.status} className={`step-item ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
								<div className="step-indicator">
									{step.completed ? (
										<CheckCircleFilled style={{ color: '#52c41a', fontSize: '20px' }} />
									) : (
										<div 
											className="step-dot" 
											style={{ 
												backgroundColor: step.active ? getStatusColor(status) : '#d9d9d9',
												borderColor: step.active ? getStatusColor(status) : '#d9d9d9'
											}}
										>
											{index + 1}
										</div>
									)}
								</div>
								<div className="step-content-improved">
									<div className="step-title-improved">{step.title}</div>
									{step.date && (
										<div className="step-date-improved">
											{formatDate(step.date)}
										</div>
									)}
									{step.active && (
										<div className="step-badge">Current</div>
									)}
								</div>
								{index < steps.length - 1 && (
									<div className={`step-connector-improved ${step.completed ? 'completed' : ''}`} />
								)}
							</div>
						))}
					</div>
				</div>

				{/* Status Timeline */}
				<div className="status-timeline">
					<h4>Status History</h4>
					<div className="timeline-items">
						{latestStatuses.map((statusItem, index) => (
							<div key={index} className="timeline-item">
								<div className="timeline-marker" style={{ backgroundColor: getStatusColor(statusItem.status) }} />
								<div className="timeline-content">
									<div className="timeline-status">{getStatusText(statusItem.status)}</div>
									<div className="timeline-date">
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
					{/* Delivery Status Section - Improved UI */}
					<div className="order_summary_card">
						<DeliveryStatus 
							status={orderSummaryData.orderStatus} 
							currentStep={orderTrack(orderSummaryData.orderStatus)}
						/>
					</div>

					<div className="order_summary_card">
						<div className="left_card_inside">
							<h3>Order ID: {orderSummaryData.orderId}</h3>
							<span>Order Date: {dateFormatter(orderSummaryData.createdAt, "dd-MMM-yyyy")}</span>
							{orderSummaryData?.isCallType && orderSummaryData?.isCallType === VisitTypeEnum.TELEVISIT ?
								<div style={{ display: "flex", gap: "10px", alignItems: "center" }}><span>Order Type: Phone Order </span><span><PhoneFilled style={{ fontSize: "14px" }} /></span></div>
								:
								<div style={{ display: "flex", gap: "10px" }}><span>Order Type:  Visit Order </span>
									<img src="https://mrapp.saleofast.com/images/visit.jpg" alt="visitorder" width="14" height="18" />
								</div>
							}
							<span className='download_invoice hide-in-pdf' onClick={downloadInvoicePdf}>Download Invoice <DownloadOutlined /></span>
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
						{(orderSummaryData?.orderStatus === OrderStatus.DELIVERED && <Button onClick={setReturnOfOrder}>Return</Button>)
						}
						{returnObject &&
							<ReturnOfObjet />}
							{orderSummaryData?.orderStatus === OrderStatus.ORDERSAVED &&<Link to={orderSummaryData?.visitId ? `/order/order-list/${orderSummaryData?.storeId}/${orderSummaryData?.visitId}/${params?.orderId}`: `/order/form/${orderSummaryData?.storeId}/${null}/${orderSummaryData?.orderId}`}> <Button style={{ background: "#4d8c4a", fontWeight: "bold", color:"white", marginLeft:"8px" }} type="primary" onClick={showLoading}>Place Saved Order</Button></Link>}
						<h4>{orderSummaryData.products.length} items in this order 
						<Button style={{ background: "#e3a66d", fontWeight: "bold", color:"black", marginLeft:"6px" }} type="primary" onClick={showLoading}>Details</Button>
						</h4>
						<table className="items_details">
							{
								orderSummaryData.products.map(item => {
									return (
										<tr>
											<td>
												<p>{item.productName}</p>
												<ul>
													{
														item.noOfCase > 0 &&
														<li>Case x {item.noOfCase}</li>
													}
													{
														item.noOfPiece > 0 &&
														<li style={{ marginLeft: item.noOfCase > 0 ? '10px' : 0 }}>
															Piece x {item.noOfPiece}
														</li>

													}
													{
														item.isFocused &&
														<CheckCircleFilled
															className='orderSummaryCheckIcon'
														/>
													}
												</ul>
											</td>
											<td>
												<p>₹{item.rlp}</p>
											</td>
										</tr>
									)
								})
							}
						</table>
					</div>

					<div className="bill_details">
						<h4>Bill Details</h4>
						<table className="bill_details_table">
							<tr>
								<td>
									<p className="black_color">MRP</p>
								</td>
								<td>
									<p className="black_color">₹{orderSummaryData.orderAmount}</p>
								</td>
							</tr>
							{
								orderSummaryData?.skuDiscountValue &&
								<tr>
									<td>
										<p className="green_color">SKU Discount</p>
									</td>
									<td>
										<p className="green_color">- <RupeeSymbol />{orderSummaryData.skuDiscountValue}</p>
									</td>
								</tr>
							}
							{
								orderSummaryData?.orderValueDiscountValue &&
								<tr>
									<td>
										<p className="green_color">Order Value Discount</p>
									</td>
									<td>
										<p className="green_color">- <RupeeSymbol />{orderSummaryData.orderValueDiscountValue}</p>
									</td>
								</tr>
							}
							{
								orderSummaryData?.flatDiscountValue &&
								<tr>
									<td>
										<p className="green_color">Flat Discount</p>
									</td>
									<td>
										<p className="green_color">- <RupeeSymbol />{orderSummaryData.flatDiscountValue}</p>
									</td>
								</tr>
							}
							{
								orderSummaryData?.visibilityDiscountValue &&
								<tr>
									<td>
										<p className="green_color">Visibility Discount</p>
									</td>
									<td>
										<p className="green_color">- <RupeeSymbol />{orderSummaryData.visibilityDiscountValue}</p>
									</td>
								</tr>
							}
							{
								orderSummaryData?.specialDiscountAmount &&
								<tr>
									<td>
										<p className="green_color">Special Discount</p>
									</td>
									<td>
										<p className="green_color">- <RupeeSymbol />{orderSummaryData.specialDiscountAmount}</p>
									</td>
								</tr>
							}
							<tr style={{ borderBottom: "1px solid #ddd" }}>
								<td>
									<br />
								</td>
								<td>
									<br />
								</td>
							</tr>
							<tr>
								<td>
									<p className="black_color">Bill Total</p>
								</td>
								<td>
									<p className="black_color">₹{orderSummaryData.netAmount}</p>
								</td>
							</tr>
						</table>
					</div>

					<div className="bill_details">
						<h4>Payment Details</h4>
						<table className="bill_details_table">
							<tr>
								<td>
									<p className="black_color">Net Amount</p>
								</td>
								<td>
									<p className="black_color">₹{orderSummaryData?.netAmount}</p>
								</td>
							</tr>
							<tr style={{ borderBottom: "1px solid #ddd" }}>
								<td>
									<p className="black_color">Collected Amount</p>
								</td>
								<td>
									<p className="black_color">₹{orderSummaryData?.collectedAmount}</p>
								</td>
							</tr>
							<tr>
								<td>
									<p className="black_color">Total Pending Amount</p>
								</td>
								<td>
									<p className="black_color">₹{(Number(orderSummaryData.netAmount) - Number(orderSummaryData?.collectedAmount))}</p>
								</td>
							</tr>
						</table>
						<div className="table-container">
							<table className="fixed-header" style={{ marginTop: "20px" }}>
								<thead>
									<tr className="attendanceTh">
										<th className="fwtNor txtC">Payment Id</th>
										<th className="fwtNor txtC">Status</th>
										<th className="fwtNor txtC">Mode</th>
										<th className="fwtNor txtC">Amount</th>
										<th className="fwtNor txtC">Invoice Reference</th>
										<th className="fwtNor txtC">Date</th>
										<th className="fwtNor txtC">Remarks</th>
									</tr>
								</thead>
								<tbody className="table-body attDetailContent">
									{
										(paymentRecord && paymentRecord.length > 0) ? paymentRecord.map((item: any, ind: number) => {
											return (
												<tr className="storeData txtC" key={ind}>
													<td className="txtC">{item?.paymentMode === "CASH" ? item?.paymentId : item?.transactionId} </td>
													<td className="txtC">{item?.status}</td>
													<td className="txtC">{item?.Mode}</td>
													<td className="txtC">{item?.Amount}</td>
													<td className="txtC">{item?.InvoiceReference}</td>
													<td className="txtC">{item?.Date}</td>
													<td className="txtC">{item?.Remarks}</td>
													<td className="txtC">{item?.paymentMode}</td>
													<td className="txtC fw-bold">{item?.amount}</td>
												</tr>
											)
										}) : isNoRecord && (
											<tr className="storeData txtC">
												<td colSpan={7}>No record found</td>
											</tr>
										)
									}
								</tbody>
							</table>
						</div>
					</div>
					<div className="order_details">
						<h4>Order Details</h4>
						<table className="order_details_table">
							<tr>
								<td>
									<p>Order Id</p>
									<span>{orderSummaryData.orderId}</span>
								</td>
							</tr>

							<tr>
								<td>
									<p>Order placed</p>
									<span>{dateFormatter(orderSummaryData.orderDate, "ccc dd-MMM-yyyy, h:mm a")}</span>
								</td>
							</tr>
						</table>
					</div>
				</section>
			}
			 <style>
                {`
                .grey-background {
                    background-color: #fafafa;
                    font-weight: 600;
                    color: rgba(0, 0, 0, 0.88);
                   }
                .table-row-total {
                    background-color: #fafafa !important;
                   }
                
                /* Improved Delivery Section Styles */
                .delivery-section-improved {
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    margin-bottom: 24px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    border: 1px solid #f0f0f0;
                }
                
                .delivery-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                
                .header-left h3 {
                    margin: 0 0 12px 0;
                    color: #1f2937;
                    font-size: 20px;
                    font-weight: 700;
                }
                
                .current-status {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .status-text-large {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1f2937;
                }
                
                .status-tag {
                    font-size: 12px;
                    font-weight: 600;
                    padding: 4px 8px;
                    border-radius: 6px;
                }
                
                .estimated-delivery-card {
                    display: flex;
                    align-items: center;
                    background: #fff7ed;
                    padding: 12px 16px;
                    border-radius: 8px;
                    border: 1px solid #fed7aa;
                    min-width: 200px;
                }
                
                .estimated-label {
                    font-size: 12px;
                    color: #9ca3af;
                    font-weight: 500;
                }
                
                .estimated-date {
                    font-size: 14px;
                    font-weight: 600;
                    color: #1f2937;
                }
                
                /* Progress Bar */
                .progress-container {
                    margin-bottom: 24px;
                }
                
                .progress-bar {
                    width: 100%;
                    height: 6px;
                    background: #f3f4f6;
                    border-radius: 3px;
                    margin-bottom: 32px;
                    overflow: hidden;
                }
                
                .progress-fill {
                    height: 100%;
                    border-radius: 3px;
                    transition: width 0.3s ease;
                }
                
                /* Steps Container */
                .steps-container {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                    position: relative;
                }
                
                .step-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    text-align: center;
                }
                
                .step-indicator {
                    margin-bottom: 8px;
                    z-index: 2;
                }
                
                .step-dot {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: white;
                    border: 2px solid;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 600;
                    color: white;
                }
                
                .step-item.completed .step-dot {
                    background: #10b981;
                    border-color: #10b981;
                }
                
                .step-item.active .step-dot {
                    color: white;
                }
                
                .step-content-improved {
                    max-width: 120px;
                }
                
                .step-title-improved {
                    font-size: 12px;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 4px;
                }
                
                .step-date-improved {
                    font-size: 11px;
                    color: #6b7280;
                    margin-bottom: 4px;
                }
                
                .step-badge {
                    background: #3b82f6;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 600;
                }
                
                .step-connector-improved {
                    position: absolute;
                    top: 16px;
                    left: 60%;
                    width: 100%;
                    height: 2px;
                    background: #e5e7eb;
                    z-index: 1;
                }
                
                .step-connector-improved.completed {
                    background: #10b981;
                }
                
                /* Status Timeline */
                .status-timeline {
                    border-top: 1px solid #f3f4f6;
                    padding-top: 20px;
                }
                
                .status-timeline h4 {
                    margin: 0 0 16px 0;
                    color: #1f2937;
                    font-size: 16px;
                    font-weight: 600;
                }
                
                .timeline-items {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .timeline-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                }
                
                .timeline-marker {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-top: 6px;
                    flex-shrink: 0;
                }
                
                .timeline-content {
                    flex: 1;
                }
                
                .timeline-status {
                    font-size: 14px;
                    font-weight: 500;
                    color: #1f2937;
                    margin-bottom: 2px;
                }
                
                .timeline-date {
                    font-size: 12px;
                    color: #6b7280;
                }
                
                /* Responsive Design */
                @media (max-width: 768px) {
                    .delivery-header {
                        flex-direction: column;
                        align-items: flex-start;	
                    }
                    
                    .estimated-delivery-card {
                        width: 100%;
                    }
                    
                    .steps-container {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    
                    .step-item {
                        flex-direction: row;
                        text-align: left;
                        gap: 12px;
                    }
                    
                    .step-content-improved {
                        max-width: none;
                        flex: 1;
                    }
                    
                    .step-connector-improved {
                        display: none;
                    }
                }
                `}
			</style>
		</div>
	)
}