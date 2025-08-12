import { ArrowLeftOutlined } from "@ant-design/icons";
import React from "react";
import previousPage from "utils/previousPage";

export default function NewOrderSummary() {
  return (
    <>
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Order Summary</h1>
      </header>
      <section className="main_cls">
        <div className="order_summary_card">
          <div className="left_card_inside">
            <h3>Order ID: DL295750293018</h3>
            <span>Order Date: 10-Nov-2023</span>
            <span className="green_className">
              Download Invoice{" "}
            </span>
          </div>
          <div className="right_card_inside">
            <ul>
              <li>
                <a href="#">
                  <span className="linkable_className">View Store Picture</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <span className="linkable_className">View Survey</span>
                </a>
              </li>
            </ul>
          </div>
          <h4>3 items in this order</h4>
          <table className="items_details">
            <tr>
              <td>
                <p>Mcvities Digestive Biscuits 100 gm</p>
                <ul>
                  <li>Case x 10</li>
                  <li>Piece x 5</li>
                </ul>
              </td>
              <td>
                <p>₹289.00</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Mcvities Digestive Biscuits 100 gm</p>
                <ul>
                  <li>Case x 10</li>
                  <li>Piece x 5</li>
                </ul>
              </td>
              <td>
                <p>₹289.00</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Mcvities Digestive Biscuits 100 gm</p>
                <ul>
                  <li>Case x 10</li>
                  <li>Piece x 5</li>
                </ul>
              </td>
              <td>
                <p>₹289.00</p>
              </td>
            </tr>
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
                <p className="black_color">₹4849.00</p>
              </td>
            </tr>
            <tr>
              <td>
                <p className="green_color">SKU Discount</p>
              </td>
              <td>
                <p className="green_color">- ₹1000.00</p>
              </td>
            </tr>
            <tr>
              <td>
                <p className="green_color">Order Value Discount</p>
              </td>
              <td>
                <p className="green_color">- ₹500.00</p>
              </td>
            </tr>
            <tr>
              <td>
                <p className="green_color">Special Discount</p>
              </td>
              <td>
                <p className="green_color">- ₹500.00</p>
              </td>
            </tr>
            <tr>
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
                <p className="black_color">₹2849.00</p>
              </td>
            </tr>
          </table>
        </div>

        <div className="order_details">
          <h4>Order Details</h4>
          <table className="order_details_table">
            <tr>
              <td>
                <p>Order Id</p>
                <span>DL295750293018</span>
              </td>
            </tr>

            <tr>
              <td>
                <p>Order placed</p>
                <span>Wed,10-Nov-2023 ; 11:48 AM</span>
              </td>
            </tr>
          </table>
        </div>
      </section>
    </>
  );
}
