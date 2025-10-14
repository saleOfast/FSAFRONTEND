import { Table } from 'antd';
import { format } from 'date-fns';

export const InvoiceTemplate = ({ data, sizeData, dataSource }: any): any => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return format(date, "dd/MM/yyyy");
  };

  const rowClassName = (record: any, index: number) => {
    return index === dataSource.length - 1 ? 'table-row-total' : '';
  };

  // Calculate line item totals with taxes and discounts (as percentages)
  const calculateLineTotal = (record: any) => {
    const quantity = record.quantity || 0;
    const price = record.price || 0;
    const taxPercentage = record.tax || 0;
    const discountPercentage = record.discount || 0;

    const subtotal = quantity * price;
    const taxAmount = subtotal * (taxPercentage / 100);
    const discountAmount = subtotal * (discountPercentage / 100);

    return subtotal + taxAmount - discountAmount;
  };

  // Calculate overall totals
  const calculateSubtotal = () => {
    return dataSource.reduce((sum: number, record: any, index: number) => {
      if (index === dataSource.length - 1) return sum; // Skip the total row
      return sum + (record.quantity * record.price);
    }, 0);
  };

  const calculateTotalTax = () => {
    return dataSource.reduce((sum: number, record: any, index: number) => { 
      if (index === dataSource.length - 1) return sum;
      const subtotal = record.quantity * record.price;
      return sum + (subtotal * (record.tax || 0) / 100);
    }, 0);
  };

  const calculateTotalDiscount = () => {
    return dataSource.reduce((sum: number, record: any, index: number) => {
      if (index === dataSource.length - 1) return sum;
      const subtotal = record.quantity * record.price;
      return sum + (subtotal * (record.discount || 0) / 100);
    }, 0);
  };

  const calculateTotalAmount = () => {
    return calculateSubtotal() + calculateTotalTax() - calculateTotalDiscount();
  };

  const defaultColumns: (any & { dataIndex: string })[] = [
    {
      title: 'SN',
      dataIndex: 'sn',
      key: 'sn',
      width: 50,
      fixed: "left",
      render: (text: any, record: any, index: number) => {
        if (index === dataSource?.length - 1) {
          return {
            children: <span></span>,
          };
        }
        return <span>{index + 1}</span> 
      },
    },
    {
      title: 'Product Name',
      dataIndex: 'product',
      key: 'product',
      width: 150,
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 65,
    },
    {
      title: 'Rate (₹)',
      dataIndex: 'price',
      key: 'price',
      width: 85,
      render: (price: number) => `₹${price?.toLocaleString('en-IN')}`
    },
    {
      title: 'CGST %',
      dataIndex: 'cgstPercent',
      key: 'cgstPercent',
      width: 75,
      render: (cgst: number) => `${cgst?.toFixed(0)}%`
    },
    {
      title: 'Amt',
      dataIndex: 'cgstAmount',
      key: 'cgstAmount',
      width: 85,
      render: (text: any, record: any, index: number) => {
        if (index === dataSource?.length - 1) {
          return {
            children: <span></span>,
          };
        }
        const subtotal = record.quantity * record.price;
        const cgstAmount = subtotal * (record.cgstPercent || 0) / 100;
        return `₹${cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
      },
    },
    {
      title: 'SGST %',
      dataIndex: 'sgstPercent',
      key: 'sgstPercent',
      width: 75,
      render: (sgst: number) => `${sgst?.toFixed(0)}%`
    },
    {
      title: 'Amt',
      dataIndex: 'sgstAmount',
      key: 'sgstAmount',
      width: 85,
      render: (text: any, record: any, index: number) => {
        if (index === dataSource?.length - 1) {
          return {
            children: <span></span>,
          };
        }
        const subtotal = record.quantity * record.price;
        const sgstAmount = subtotal * (record.sgstPercent || 0) / 100;
        return `₹${sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
      },
    },
    {
      title: 'Amount (₹)',
      dataIndex: 'total',
      key: 'total',
      width: 100,
      render: (text: any, record: any, index: number) => {
        if (index === dataSource?.length - 1) {
          return {
            children: <span></span>,
          };
        }
        return `₹${calculateLineTotal(record).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
      },
    },
  ];

  return (
    <div>
      <div className='content' id="invoice-template">        
        {/* Header Section */}
        <div className="header-section">
          <div className="logo-container">
            <img
              style={{ height: "55px" }}
              src={`${process.env.PUBLIC_URL}/logo2.png`}
              alt="Saleofast Logo"
            />
          </div>
          <div className="company-details">
            <div className="company-name">{data?.store?.ownerName || 'Saleofast Software Private Limited'}</div>
            <div className="company-info">
              <div>{data?.store?.registrationNumber || 'UT2300UP2015PTC073293'}</div>
              <div>({data?.store?.groupName || 'Saleofast Group'}), {data?.store?.addressLine1 || 'Unit No. A-210, Second Floor'}</div>
              <div>{data?.store?.townCity || 'Noida'}, {data?.store?.state || 'Uttar Pradesh'} {data?.store?.pinCode || '201304'}</div>
              <div>{data?.store?.country || 'India'}</div>
              <div>Tax ID : {data?.store?.taxId || 'AAFCK9422N'}</div>
              <div>GSTIN {data?.store?.gstin || '09AAFCK9422N1ZY'}</div>
              <div>{data?.store?.phone || '9773859368'}</div>
              <div>{data?.store?.email || 'accounts@saleofast.com'}</div>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="invoice-details-section">
          <table className="invoice-meta-table">
            <tbody>
              <tr>
                <td className="label">Invoice No</td>
                <td className="value">: {data?.orderID || data?.invoiceNumber || '414'}</td>
                <td className="label">Place Of Supply</td>
                <td className="value" colSpan={3}>: {data?.supplyPlace || 'Uttar Pradesh'}</td>
              </tr>
              <tr>
                <td className="label">Invoice Date</td>
                <td className="value">: {formatDate(String(data?.updatedAt)) || '18/09/2025'}</td>
                <td className="label">Terms</td>
                <td className="value">: {data?.terms || 'Due on Receipt'}</td>
              </tr>
              <tr>
                {/* <td className="label">Due Date</td> */}
                {/* <td className="value">: {formatDate(String(data?.dueDate)) || '18/09/2025'}</td> */}
                {/* <td className="label">P.O.#</td> */}
                {/* <td className="value">: {data?.poNumber || '7100003661'}</td> */}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="divider"></div>

        {/* Billing and Shipping Section */}
        <div className="billing-shipping-section">
          <div className="bill-to">
            <h3>Bill To</h3>
            <div className="client-details">
              <strong>{data?.client?.name || 'Max Estates Limited'}</strong><br />
              {data?.client?.address || 'C-001/A/1, L-20/21, Sector-16B'}<br />
              {data?.client?.city || 'Noida'}<br />
              {data?.client?.zip || '201301'} {data?.client?.state || 'Uttar Pradesh'}<br />
              {data?.client?.country || 'India'}<br />
              PAN : {data?.client?.pan || 'AAKCM2620D'}<br />
              GSTIN : {data?.client?.gstin || '09AAKCM2620D1ZQ'}
            </div>
          </div>
            
          <div className="ship-to">
            <h3>Ship To</h3>
            <div className="shipping-details">
              <strong>{data?.shipping?.name || data?.client?.name || 'Max Estates Limited'}</strong><br />
              {data?.shipping?.address || data?.client?.address || 'C-001/A/1, L-20/21, Sector-16B'}<br />
              {data?.shipping?.city || data?.client?.city || 'Noida'}<br />
              {data?.shipping?.zip || data?.client?.zip || '201301'} {data?.shipping?.state || data?.client?.state || 'Uttar Pradesh'}<br />
              {data?.shipping?.country || data?.client?.country || 'India'}<br />
              {data?.shipping?.phone || data?.client?.phone || ''}
               PAN : {data?.client?.pan || 'AAKCM2620D'}<br />
              GSTIN : {data?.client?.gstin || '09AAKCM2620D1ZQ'}
            </div>
          </div>
        </div>
        
        <div className="divider"></div>

        {/* Items Table */}
        <div className="table-section">
          <Table
            scroll={{ x: "max-content" }}
            rowClassName={rowClassName}
            bordered
            dataSource={dataSource}
            columns={defaultColumns}
            pagination={false}
            className="invoice-items-table"
            size="small"
          />
        </div>

        <div className="divider"></div>

        {/* Total Section */}
        <div className="total-section">
          <div className="total-in-words">
            <strong>Total In Words</strong><br />
            Indian Rupee {data?.totalInWords || 'Sixty-One Thousand Three Hundred Sixty Only'}
          </div>
          
          <div className="amount-details">
            <table className="amount-table">
              <tbody>
                <tr>
                  <td>Sub Total</td>
                  <td>₹{calculateSubtotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td>CGST9 (9%)</td>
                  <td>₹{(calculateTotalTax()/2).toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '4,680.00'}</td>
                </tr>
                <tr>
                  <td>SGST9 (9%)</td>
                  <td>₹{(calculateTotalTax()/2).toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '4,680.00'}</td>
                </tr>
                <tr className="total-row">
                  <td><strong>Total</strong></td>
                  <td><strong>₹{calculateTotalAmount().toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '61,360.00'}</strong></td>
                </tr>
                <tr className="balance-due">
                  <td><strong>Balance Due</strong></td>
                  <td><strong>₹{(calculateTotalAmount() - Number(data?.collectedAmount || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '61,360.00'}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="divider"></div>

        {/* Footer Section */}
        <div className="footer-section">
          <div className="notes">
            <div className="notes-label">Notes</div>
            <div className="thanks-message">Thanks for your business.</div>
          </div>
          <div className="footer-info">
            <span>{data?.store?.email || 'info@saleofast.com'}</span> |
            <span>{data?.store?.phone || '555 444 6666'}</span> |
            <span>saleofast.com</span>
          </div>
        </div>
      </div>
      <style>
        {`
    @media print {
      @page {
        size: A4;
        margin: 8mm;
      }
      body, html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      #invoice-template {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 5mm;
        box-sizing: border-box;
        font-size: 14pt;
        border: none;
      }
      .header-section, .invoice-details-section, .billing-shipping-section, 
      .table-section, .total-section, .footer-section {
        page-break-inside: avoid;
      }
      .divider {
        margin: 5px 0;
      }
    }
    
    body {
      font-family: Arial, sans-serif;
      font-size: 15px;
      color: #000;
      margin: 0;
      padding: 0;
      background: white;
      width: 100%;
      height: 100%;
    }
    
    #invoice-template {
      padding: 12px;
      width: 100%;
      min-height: 100%;
      margin: 0;
      box-sizing: border-box;
      border: 1px solid #ccc;
      background: white;
      font-size: 15px;
    }
    
    .header-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #000;
      width: 100%;
    }
    
    .logo-container {
      display: flex;
      align-items: flex-start;
    }
    
    .company-details {
      text-align: right;
      flex: 1;
    }
    
    .company-details h1 {
      font-size: 24px;
      margin: 0 0 4px 0;
      color: #000;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .company-name {
      font-weight: bold;
      margin-bottom: 4px;
      font-size: 18px;
    }
    
    .company-info div {
      margin-bottom: 3px;
      font-size: 14px;
      line-height: 1.3;
    }
    
    .invoice-details-section {
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #000;
      width: 100%;
    }
    
    .invoice-meta-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 15px;
    }
    
    .invoice-meta-table td {
      padding: 4px;
      vertical-align: top;
      border: none;
      white-space: nowrap;
    }
    
    .invoice-meta-table .label {
      font-weight: bold;
      width: 100px;
      font-size: 15px;
    }
    
    .invoice-meta-table .value {
      font-size: 15px;
    }
    
    .divider {
      height: 1px;
      background-color: #000;
      margin: 10px 0;
      width: 100%;
    }
    
    .billing-shipping-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #000;
      width: 100%;
    }
    
    .bill-to, .ship-to {
      width: 48%;
    }
    
    .bill-to h3, .ship-to h3 {
      margin: 0 0 8px 0;
      font-size: 17px;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .client-details, .shipping-details {
      font-size: 15px;
      line-height: 1.4;
    }
    
    .table-section {
      overflow-x: auto;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #000;
      width: 100%;
    }
    
    .invoice-items-table {
      margin-bottom: 0;
      border: none;
      width: 100%;
    }
    
    .invoice-items-table .ant-table-container {
      width: 100% !important;
    }
    
    .invoice-items-table .ant-table-thead > tr > th {
      background-color: #f0f0f0;
      font-weight: bold;
      padding: 8px;
      font-size: 14px;
      text-align: center;
      border: none !important;
      border-bottom: 1px solid #000 !important;
    }
    
    .invoice-items-table .ant-table-tbody > tr > td {
      padding: 8px;
      font-size: 14px;
      border: none !important;
      border-bottom: 1px solid #000 !important;
      text-align: center;
    }
    
    .invoice-items-table .ant-table-tbody > tr:last-child > td {
      border-bottom: none !important;
    }
    
    .invoice-items-table .ant-table-tbody > tr > td:last-child {
      text-align: right;
      padding-right: 10px;
    }
    
    .total-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #000;
      width: 100%;
    }
    
    .total-in-words {
      width: 60%;
      padding: 10px;
      background-color: #f9f9f9;
      font-size: 15px;
      border: none;
    }
    
    .amount-details {
      width: 35%;
    }
    
    .amount-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 15px;
    }
    
    .amount-table td {
      padding: 6px;
      border: none;
      border-bottom: 1px solid #000;
    }
    
    .amount-table td:last-child {
      text-align: right;
    }
    
    .amount-table .total-row td {
      border-top: 1px solid #000;
      border-bottom: none;
      padding-top: 10px;
      font-size: 16px;
    }
    
    .amount-table .balance-due td {
      border-top: 2px solid #000;
      padding-top: 10px;
      font-size: 17px;
      font-weight: bold;
    }
    
    .footer-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      width: 100%;
    }
    
    .notes {
      display: flex;
      align-items: center;
    }
    
    .notes-label {
      font-weight: bold;
      margin-right: 10px;
      font-size: 15px;
    }
    
    .thanks-message {
      font-style: italic;
      font-size: 15px;
    }
    
    .footer-info {
      font-size: 14px;
      color: #000;
    }
    
    .footer-info span {
      padding: 0 6px;
    }
    
    .table-row-total {
      background-color: #fafafa !important;
    }
    
    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
      }
      
      .company-details {
        text-align: left;
        margin-top: 12px;
      }
      
      .billing-shipping-section {
        flex-direction: column;
      }
      
      .bill-to, .ship-to {
        width: 100%;
        margin-bottom: 18px;
      }
      
      .total-section {
        flex-direction: column;
      }
      
      .total-in-words, .amount-details {
        width: 100%;
        margin-bottom: 12px;
      }
      
      .footer-section {
        flex-direction: column;
        text-align: center;
      }
      
      .notes {
        margin-bottom: 10px;
        justify-content: center;  
      }
    }
    `}
      </style>  
    </div>
  )
}