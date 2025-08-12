import React, { useEffect, useState } from "react";
import "../../style/focusedItems.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux-store/store";
import { setLoaderAction } from "redux-store/action/appActions";
import { getProductsService } from "services/productService";
import previousPage from "utils/previousPage";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function FocusedItems() {
  const dispatch = useDispatch<AppDispatch>();
  const [focusedItemsList, setFocusedItemsList] = useState<any[]>([]);
  useEffect(() => {
    getFocusedItemsList();
  }, []);

  const getFocusedItemsList = async () => {
    try {
      dispatch(setLoaderAction(true));
      const response = await getProductsService({ isFocused: true });
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        let { data } = response.data;
        setFocusedItemsList(data);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };

  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Focused Items</h1>
      </header>
      <div style={{ marginTop: "10px" }}>
        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Item Name</th>
              <th>Category</th>
              <th className="txtC">MRP<br />1 PC</th>
              <th className="txtC">RLP<br />1 PC</th>
            </tr>
          </thead>
          <tbody>
            {
              (focusedItemsList && focusedItemsList.length > 0) ? focusedItemsList?.map((item: any, ind: number) => {
                return (
                  <tr className="storeData" key={ind}>
                    <td>{ind + 1}</td>
                    <td className="focusTxtName">
                      {item?.productName}
                    </td>
                    <td>{item?.category?.name}</td>
                    <td className="txtC">{item?.mrp}</td>
                    <td className="txtC">{item?.rlp}</td>
                  </tr>
                );
              }) : (
                <tr className="storeData txtC">
                  <td colSpan={5}>No record found</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
