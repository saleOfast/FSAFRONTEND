import React, { useState } from 'react';

const Invoice = ({ invoiceData }: any) => {
  const [downloadLink, setDownloadLink] = useState<null | string>(null);
  const generateInvoice = () => {
    const formattedInvoiceData = JSON.stringify(invoiceData, null, 2);
    const blob = new Blob([formattedInvoiceData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    setDownloadLink(url);
  };

  return (
    <div>
      <h1>Invoice</h1>
      <button onClick={generateInvoice}>Generate Invoice</button>
      {downloadLink && (
        <a
          href={downloadLink}
          download="invoice.json"
          onClick={() => setDownloadLink(null)}
        >
          Download Invoice
        </a>
      )}
    </div>
  );
};

export default Invoice;
