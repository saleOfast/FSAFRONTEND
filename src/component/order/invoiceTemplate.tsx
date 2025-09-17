import { Table } from 'antd';
import { format } from 'date-fns';

export const InvoiceTemplate = ({ data, sizeData, dataSource }: any): any => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return format(date, "eee, do MMM yyyy");
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
      width: 200,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: 'Price (₹)',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price: number) => `₹${price?.toFixed(2)}`
    },
    {
      title: 'Taxes (%)',
      dataIndex: 'tax',
      key: 'tax',
      width: 100,
      render: (tax: number) => `${tax?.toFixed(2)}%`
    },
    {
      title: 'Discount (%)',
      dataIndex: 'discount',
      key: 'discount',
      width: 100,
      render: (discount: number) => `${discount?.toFixed(2)}%`
    },
    {
      title: 'Total (₹)',
      dataIndex: 'total',
      key: 'total',
      width: 100,
      render: (text: any, record: any, index: number) => {
        if (index === dataSource?.length - 1) {
          return {
            children: <span></span>,
          };
        }
        return `₹${calculateLineTotal(record).toFixed(2)}`;
      },
    },
  ];

  return (
    <div>
      <div className='content' id="invoice-template" >
        <div className="logo-container " >
          <img
            style={{ height: "30px", width: "" }}
            src={`${process.env.PUBLIC_URL}/logo2.png`}
            alt="img"
          />
        </div>
        <table className="invoice-info-container">
          <tr>
            <td rowSpan={2} className="client-name">
              {data?.store?.ownerName}
            </td>
            <td>
              {data?.store?.storeName}
            </td>
          </tr>
          <tr>
            <td>
              {data?.store?.addressLine1} {" "} {data?.store?.addressLine2}
            </td>
          </tr>
          <tr>
            <td>
              Invoice Date:
              <strong>{formatDate(String(data?.updatedAt))}</strong>
            </td>
            <td>
              {data?.store?.townCity}{" "} {data?.store?.state}, {data?.store?.pinCode}
            </td>
          </tr>
          <tr>
            <td>
              Invoice No: <strong>{data?.orderId}</strong>
            </td>
            <td>
              {data?.store?.email}
            </td>
          </tr>
        </table>

        <Table
          scroll={{ x: "100%" }}
          rowClassName={rowClassName}
          bordered
          dataSource={dataSource}
          columns={defaultColumns}
          pagination={false}
        />

        <table className="line-items-container due has-bottom-border">
          <thead>
            <tr>
              <th style={{ background: "none", border: "none", borderBottom: "2px solid #ddd" }}></th>
              <th style={{ background: "none", border: "none", borderBottom: "2px solid #ddd" }}></th>
              <th style={{ background: "none", border: "none", borderBottom: "2px solid #ddd" }}>Amount Details</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <td className="payment-info">
              </td>
              <td className="large">
              </td>
              <td className=" payment-amount ">
                <div>
                  Subtotal: <strong>₹{calculateSubtotal().toFixed(2)}</strong>
                </div>
                <div>
                  Total Taxes: +<strong>₹{calculateTotalTax().toFixed(2)}</strong>
                </div>
                <div>
                  Total Discount: -<strong>₹{calculateTotalDiscount().toFixed(2)}</strong>
                </div>
                <div style={{ fontWeight: 'bold', borderTop: '1px solid #ddd', paddingTop: '5px' }}>
                  Total Amount: <strong>₹{calculateTotalAmount().toFixed(2)}</strong>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table className="line-items-container pay has-bottom-border">
          <thead>
            <tr>
              <th style={{ background: "none", border: "none", borderBottom: "2px solid #ddd" }}>Payment Info</th>
              <th style={{ background: "none", border: "none", borderBottom: "2px solid #ddd" }}>Due By</th>
              <th style={{ background: "none", border: "none", borderBottom: "2px solid #ddd" }}>Total Due</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <td className="payment-info">
                <div>
                  Account No: <strong>123567744</strong>
                </div>
                <div>
                  Routing No: <strong>120000547</strong>
                </div>
              </td>
              <td className="large">{formatDate(String(data?.createdAt))}</td>
              <td className="large total">₹{(calculateTotalAmount() - Number(data?.collectedAmount || 0)).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="footer">
          <div className="footer-info">
            <span>info@saleofast.com</span> |
            <span>555 444 6666</span> |
            <span>saleofast.com</span>
          </div>
        </div>
      </div>
      <style>
        {`
    /* Your existing CSS styles remain the same */
    @media print {
      #invoice-template {
        width: 210mm;
        height: auto;
        margin: 0;
        padding: 10mm;
        box-sizing: border-box;
        font-size: 12pt;
      }
    }
    th td{
      // border: none;
    }
    body {
      font-size: 16px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    table tr td {
      padding: 0;
    }
    
    table tr td:last-child {
      text-align: right;
    }
    
    .bold {
      font-weight: bold;
    }
    
    .right {
      text-align: right;
    }
    
    .large {
      font-size: 1.2em;
    }
    
    .total {
      font-weight: bold;
      color: #fb7578;
    }
    
    .logo-container {
      margin: 20px 0 70px 0;
    }
    
    .invoice-info-container {
      font-size: 0.875em;
    }
    .invoice-info-container td {
      padding: 4px 0;
    }
    
    .client-name {
      font-size: 1.5em;
      vertical-align: top;
    }
    
    .due {
      margin: 70px 0;
      font-size: 0.875em;
    }
    .pay {
      margin: 0px 0;
      font-size: 0.875em;
    }
    
    .line-items-container th {
      text-align: left;
      color: #999;
      border-bottom: 2px solid #ddd;
      padding: 10px 0 15px 0;
      font-size: 0.75em;
      text-transform: uppercase;
    }
    
    .line-items-container th:last-child {
      text-align: right;
    }
    
    .line-items-container td {
      padding: 15px 0;
    }
    
    .line-items-container tbody tr:first-child td {
      padding-top: 25px;
    }
    
    .line-items-container.has-bottom-border tbody tr:last-child td {
      padding-bottom: 25px;
      border-bottom: 2px solid #ddd;
    }
    
    .line-items-container.has-bottom-border {
      margin-bottom: 0;
    }
    
    .line-items-container th.heading-quantity {
      width: 50px;
    }

    .line-items-container th.heading-price {
      text-align: right;
      width: 100px;
    }
      
    .line-items-container th.heading-subtotal {
      width: 100px;
    }
    
    .payment-info {
      width: 38%;
      font-size: 0.75em;
      line-height: 1.5;
    }
    .payment-amount {
      width: 38%;
      font-size: 1em;
      line-height: 2;
    }
    
    .footer {
      margin-top: 100px;
    }
    
    .footer-thanks {
      font-size: 1.125em;
    }
    
    .footer-thanks img {
      display: inline-block;
      position: relative;
      top: 1px;
      width: 16px;
      margin-right: 4px;
    }
    
    .footer-info {
      float: right;
      margin-top: 5px;
      font-size: 0.75em;
      color: #ccc;
    }
    
    .footer-info span {
      padding: 0 5px;
      color: black;
    }
    
    .footer-info span:last-child {
      padding-right: 0;
    }
    
    .page-container {
      display: none;
    }
    
    .footer {
      margin-top: 30px;
    }
    
    .footer-info {
      float: none;
      position: running(footer);
      margin-top: -25px;
    }
    
    .page-container {
      display: block;
      position: running(pageContainer);
      margin-top: -25px;
      font-size: 12px;
      text-align: right;
      color: #999;
    }
    
    .page-container .page::after {
      content: counter(page);
    }
    
    .page-container .pages::after {
      content: counter(pages);
    }
    
    @page {
      @bottom-right {
        content: element(pageContainer);
      }
      @bottom-left {
        content: element(footer);
      }
    }
      
    th{
      background-color: none!important
    }

    td{
      border: white
    }
      .grey-background {
                        background-color: #fafafa;
                        font-weight: 600;
                        color: rgba(0, 0, 0, 0.88);
                       }
                    .table-row-total {
                        background-color: #fafafa !important;
                       }
    `}
      </style>
    </div>
  )
}