import React, { useEffect } from "react";
import "../../style/newStores.css";
import { Link } from "react-router-dom";
import { dateFormatter } from "utils/common";
import { useSelector } from "../../redux-store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux-store/store";
import { getStoreActions } from "../../redux-store/action/storeActions";
import { StoreBillingEnum } from "enum/store";
import previousPage from "utils/previousPage";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function UnbilledStores() {

  const storeList = useSelector(state => state.store.storeList);
  const dispatch = useDispatch<AppDispatch>();
  const filterDetails: any = {
    isUnbilled: StoreBillingEnum.UNBILLED
  };

  useEffect(() => {
    dispatch(getStoreActions(filterDetails, { pageNumber: 1, pageSize: 1000 }));
  }, []);

  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#8488BF" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Unbilled Stores</h1>
      </header>
      <div>
        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Outlet Name</th>
              <th>Created Date</th>
              <th>Beat</th>
            </tr>
          </thead>
          <tbody>
            {
              (storeList && storeList.length > 0) ? storeList?.map((item, ind) => {
                const { storeId, storeName, createdAt, beat } = item;

                return (
                  <tr className="storeData" key={storeId}>
                    <td>{ind + 1}</td>
                    <td className="storeIdLink">
                      <Link to={`/stores/store-details?store_id=${storeId}`}>{storeName}</Link>
                    </td>
                    <td>{dateFormatter(createdAt)}</td>
                    <td>{beat?.beatName}</td>
                  </tr>
                );
              }) : (
                <tr className="storeData txtC">
                  <td colSpan={4}>No record found</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );                                                                                                                                                                                                                                                                                        
}
