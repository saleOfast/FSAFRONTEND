import RupeeSymbol from "component/RupeeSymbol";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setLoaderAction } from "redux-store/action/appActions";
import { getInventoryList } from "services/inventoryService";
import { IInventory } from "types/Inventory";

export default function InventoryTable() {
  const [inventoryData, setInventoryData] = useState<IInventory[]>([]);

  const dispatch = useDispatch();
  const params = useParams<{ storeId: string }>();

  useEffect(() => {
    async function getList() {
      if (params.storeId) {
        try {
          dispatch(setLoaderAction(true));
          const result = await getInventoryList(params.storeId);
          dispatch(setLoaderAction(false));
          if (result.status === 200) {
            setInventoryData(result.data.data)
          }
        } catch (error) {
          dispatch(setLoaderAction(false));
        }
      }
    }
    getList();
  }, [params.storeId]);
  return (
    <>
      <table className="mt-4">
        <thead>
          <tr>
            <th className="inveContainer">Brand</th>
            <th className="inveContainer">Category</th>
            <th className="inveContainer">SKU</th>
            <th className="inveContainer">MRP</th>
            <th className="inveContainer">Qty</th>
          </tr>
        </thead>
        <tbody>
          {
            inventoryData.map(item => (
              <tr className="invenData" key={item.inventoryId}>
                <td className="invenData">{item.product.brand.name}</td>
                <td className="invenData">{item.product.category.name}</td>
                <td className="invenData">{item.product.productName}</td>
                <td className="invenData"><RupeeSymbol />{item.product.mrp}</td>
                <td className="invenData">{item.noOfCase * item.product.caseQty + item.noOfPiece}</td>
              </tr>
            ))
          }

        </tbody>
      </table>
    </>
  );
}
