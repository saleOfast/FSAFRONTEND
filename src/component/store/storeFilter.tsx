import { Button, Checkbox } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/stores.css";
import { Tabs } from 'antd';
import { AppDispatch } from "../../redux-store/store";
import { useDispatch } from "react-redux";
import { setStoreBeatAction, setStoreCategoryAction, setStoreFiltersActions } from "../../redux-store/action/storeActions";
import { StoreBillingEnum } from "enum/store";
import { useSelector } from "redux-store/reducer";
import { StoreBeatData, StoreCategoryData } from "types/Store";
import previousPage from "utils/previousPage";
import { ArrowLeftOutlined } from "@ant-design/icons";

const CheckboxGroup = Checkbox.Group;

const Tab: any[] = [
  {
    name: 'Type',
    storeCat: [],
    stateType: 'storeCat'
  },
  {
    name: 'Beat',
    beatId: [],
    stateType: 'beatId'
  },
  {
    name: 'Billing',
    isUnbilled: [
      StoreBillingEnum.UNBILLED,
      StoreBillingEnum.BILLED
    ],
    stateType: 'isUnbilled'
  },
]

type TabPosition = '1';

export default function StoreFilter() {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const storeCategoryData: StoreCategoryData[] = useSelector(state => state?.store?.storeCategory);
  const beatData: StoreBeatData[] = useSelector(state => state?.store?.storeBeat);
  const additionalFilters = useSelector(state => state.store.storeFilters);

  const [tabPosition, setTabPosition] = useState<string>('1' as TabPosition);
  const [tabData, setTabData] = useState(Tab);

  const [checkedList, setCheckedList] = useState<any>({
    'storeCat': [],
    'beatId': [],
    'isUnbilled': []
  });

  useEffect(() => {
    dispatch(setStoreCategoryAction());
    dispatch(setStoreBeatAction());
  }, []);

  useEffect(() => {
    const sOption = [];
    const bOption = [];
    if (storeCategoryData && storeCategoryData.length > 0) {
      for (let item of storeCategoryData) {
        sOption.push({ label: item.categoryName, value: item.storeCategoryId });
      }
    }

    if (beatData && beatData.length > 0) {
      for (let item of beatData) {
        bOption.push({ label: item.beatName, value: item.beatId });
      }
    }

    const cloneTabData = [...tabData];
    for (let item of cloneTabData) {
      if (item.name === 'Type') {
        item[item.stateType] = sOption;
      }
      if (item.name === 'Beat') {
        item[item.stateType] = bOption;
      }
    }
    setTabData(cloneTabData);
  }, [storeCategoryData, beatData]);

  useEffect(() => {
    setTimeout(() => {
      if (additionalFilters) {
        let beatFilters: any[] = [];
        if (additionalFilters.beatId) {
          beatFilters = additionalFilters.beatId.split(',');
          beatFilters = beatFilters.map(function (str) {
            return Number(str);
          });
        }
        let storeCatFilters: any[] = [];
        if (additionalFilters.storeCat) {
          storeCatFilters = additionalFilters.storeCat.split(',');
          storeCatFilters = storeCatFilters.map(function (str) {
            return Number(str);
          });
        }

        setCheckedList((prev: any) => {
          const newState = {
            ...prev,
            beatId: beatFilters,
            storeCat: storeCatFilters,
            isUnbilled: additionalFilters.isUnbilled ? additionalFilters.isUnbilled.split(',') : [],
          }
          return newState;
        })
      }
    }, 0);
  }, [additionalFilters]);

  const applyFilter = () => {
    const filters = {
      'beatId': checkedList.beatId.length > 0 ? checkedList.beatId.join() : null,
      'storeCat': checkedList.storeCat.length > 0 ? checkedList.storeCat.join() : null,
      'isUnbilled': checkedList.isUnbilled.length > 0 ? checkedList.isUnbilled.join() : null
    };

    dispatch(setStoreFiltersActions(filters));
    navigate(`/stores`);
  }

  const clearFilter = () => {
    dispatch(setStoreFiltersActions(null));
    navigate(`/stores`);
  }

  const CheckboxTabContent = (props: any) => {
    const onChange = (list: CheckboxValueType[]) => {
      const cloneCheckedList = { ...checkedList };
      if (props?.tabData?.name === 'Billing') {
        if (list.length === 2) {
          const index = list.indexOf(cloneCheckedList[props?.tabData?.stateType][0]);
          list.splice(index, 1);
        }
        cloneCheckedList[props?.tabData?.stateType] = list;
      } else {
        cloneCheckedList[props?.tabData?.stateType] = list;
      }
      setCheckedList(cloneCheckedList);
    };

    return (
      <div>
        <CheckboxGroup
          options={props?.tabData[props?.tabData?.stateType]}
          value={checkedList[props?.tabData?.stateType]}
          onChange={onChange}
          className="stoFilCheck"
        />
      </div>)
  };

  return (
    <div>
      <div className="filterbg">
        <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
          <ArrowLeftOutlined onClick={previousPage} className="back-button" />
          <h1 className="page-title pr-18">Filters</h1>
        </header>
        <main>
            <div className="filter-sidebar">
              <Tabs className="filterContent"
                tabPosition={"left"}
                onChange={(key) => setTabPosition(key as TabPosition)}
                activeKey={tabPosition}
                items={tabData.map((item, i) => {
                  const label = String(item.name);
                  const id = String(i + 1);
                  return {
                    label: `${label}`,
                    key: id,
                    children: <CheckboxTabContent tabData={item} id={id} />,
                  };
                })}
              />
            </div>
          <div
            className="actionTab actionFilTab ">
            <Button className=" " style={{background:"#a1301f", color: "white"}} onClick={clearFilter}>Clear &amp; Close</Button>
            <Button htmlType="submit" className="btn-save" onClick={applyFilter} >Apply</Button>
          </div>
        </main>
      </div>
    </div>
  );
}
