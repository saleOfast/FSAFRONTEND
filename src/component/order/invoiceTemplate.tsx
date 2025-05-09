import { Table } from 'antd';
import { format } from 'date-fns';
// import React, { useEffect, useState } from 'react'


export const InvoiceTemplate = ({ data, sizeData, dataSource }: any): any => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ''; // Return empty string if date string is undefined

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Return empty string if date is invalid

    return format(date, "eee, do MMM yyyy");
  };
  const rowClassName = (record: any, index: number) => {
    return index === dataSource.length - 1 ? 'table-row-total' : ''; // Apply class for the last row
  };
  // const [sizeData, setSizeData] = useState<any>([]);
  // const dispatch = useDispatch<any>();
  // const [isLoading, setIsLoading] = useState(false);

  // async function fetchSizeData() {
  //   try {
  //     dispatch(setLoaderAction(true));
  //     setIsLoading(true)
  //     const res = await getSizeService();
  //     if (res?.data?.status === 200) {
  //       setSizeData(res?.data?.data)
  //       dispatch(setLoaderAction(false));
  //       setIsLoading(false)
  //     }
  //     setIsLoading(false)
  //     dispatch(setLoaderAction(false));
  //   } catch (error) {
  //     dispatch(setLoaderAction(false));
  //     setIsLoading(false)
  //   }
  //   }
  //   useEffect(() => {
  //     fetchSizeData();
  //   }, []);
  const defaultColumns: (any & { dataIndex: string })[] = [
    {
      title: 'SN',
      dataIndex: 'sn',
      key: 'sn',
      width: 60,
      fixed: "left",
      render: (text: any, record: any, index: number) => {
        // Render blank for the last row (total row)
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
        {/* <table className="line-items-container due">
          <thead style={{ background: "none" }}>
            <tr>
              <th className="heading-quantity" style={{ background: "none", border: "none", borderBottom: "2px solid #ddd" }}>S.No.</th>
              <th className="heading-description" style={{ background: "none", border: "none", borderBottom: "2px solid #ddd" }}>Description</th>
              <th className="heading-description" style={{ background: "none", border: "none", borderBottom: "2px solid #ddd", width: 0 }}>Qty</th>
              <th className="heading-price" style={{ background: "none", border: "none", borderBottom: "2px solid #ddd" }}>Price</th>
              <th className="heading-subtotal" style={{ background: "none", border: "none", borderBottom: "2px solid #ddd" }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {data?.products?.map((product: any, idx: any) => {
              return (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{product?.productName}</td>
                  <td>{(product?.noOfCase * product?.caseQty) + product?.noOfPiece}</td>
                  <td className="right">{product?.rlp}</td>
                  <td className="bold">{(product?.rlp) * ((product?.noOfCase * product?.caseQty) + product?.noOfPiece)}</td>
                </tr>
              )
            })}
          </tbody>
        </table> */}
        <Table
          //  title={() => <span className='dflex-center' style={{fontWeight:"bold", textAlign:"center"}}>Order Details (Id: {orderSummaryData?.orderId})</span>}
          scroll={{ x: "100%" }}
          rowClassName={rowClassName}
          bordered
          dataSource={dataSource
          }
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
                  Total Order Amount: <strong>{data?.orderAmount}</strong>
                </div>
                <div>
                  Total Discount Amount: -<strong>{data?.totalDiscountAmount}</strong>
                </div>
                <div>
                  Subtotal Amount: <strong>{data?.netAmount}</strong>
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
              <td className="large total">{Number(data?.netAmount) - Number(data?.collectedAmount)}</td>

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
    /*
    Common invoice styles. These styles will work in a browser or using the HTML
    to PDF anvil endpoint.
  */
    @media print {
      #invoice-template {
        width: 210mm; /* A4 width */
        height: auto;
        margin: 0; /* Remove default margin */
        padding: 10mm; /* Add padding for margin */
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
  /*
  The styles here for use when generating a PDF invoice with the HTML code.

  * Set up a repeating page counter
  * Place the .footer-info in the last page's footer
*/

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
                    background-color: #fafafa !important; /* Sets the background color to yellow */
                   }
  
  `}
      </style>
    </div>
  )
}
