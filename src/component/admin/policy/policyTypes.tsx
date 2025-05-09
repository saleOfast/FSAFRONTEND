import React, { useEffect, useState } from "react";
import "../../style/orderList.css";
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, FormOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "../../../redux-store/reducer";
import { AppDispatch } from "../../../redux-store/store";
import { getProductBrandActions } from "../../../redux-store/action/productAction";
import { dateFormatter, dateFormatterNew } from "utils/common";
import { deleteProductBrandService } from "services/productService";
import previousPage from "utils/previousPage";
import { Input, message, Table } from "antd";
import DeleteItem from "../common/deleteItem";
import { capitalizeSubstring } from "utils/capitalize";
import { setLoaderAction } from "redux-store/action/appActions";
import { deletePolicyHeadService, deletePolicyTypeService, getPolicyHeadService, getPolicyTypeService } from "services/usersSerivce";

export default function PolicyTypes() {
  const [toggleDelete, setToggleDelete] = useState(false);
  const [deleteName, setDeleteName] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const redirect = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const searchParams = new URLSearchParams(location?.search);
  const policy_id: string | null = searchParams.get('policyId');

  const [data, setData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  useEffect(() => {
    setFilteredData(data);
  }, [data])

  const searchStore = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const FS = data.filter((item: any) =>
      (item?.policy_type_name?.toLowerCase())?.includes(value.toLowerCase())
    );
    setFilteredData(FS);
  };
  const [isLoading, setIsLoading] = useState(false);

  async function fetchData() {
    if (policy_id) {
      try {
        dispatch(setLoaderAction(true));
        setIsLoading(true);
        const res = await getPolicyTypeService(policy_id);
        if (res?.data?.status === 200) {
          setData(res?.data?.data);
        } else {
          message.error("Failed to fetch data");
        }
      } catch (error) {
        message.error("Error fetching data");
      } finally {
        setIsLoading(false);
        dispatch(setLoaderAction(false));
      }
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const toggleHandler = (Id: string, name: string) => {
    setToggleDelete(true);
    setDeleteId(Id);
    setDeleteName(name);

    const searchParams = new URLSearchParams(location.search);
    redirect({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  }

  const columns: any = [
    {
      title: 'Policy Name',
      dataIndex: 'policy_type_name',
      key: 'policy_type_name',
      fixed: "left",
      width: 120,
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Travel Type',
      dataIndex: 'travel_type',
      key: 'travel_type',
      width: 120,
    },
    {
      title: 'Claim Type',
      dataIndex: 'claim_type',
      key: 'claim_type',
      width: 80,
    },
    {
      title: 'Policy Code',
      dataIndex: 'policy_code',
      key: 'policy_code',
      width: 80,
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      width: 80,
    },
    {
      title: 'Effective Date',
      dataIndex: 'date',
      key: 'date',
      width: 80,
    },
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      width: 40,

      render: (text: any, record: any) => {
        return <Link to={`/config/add-update-policyTypes?policyTypeId=${record?.policy_type_id}`}><EditOutlined /></Link>;
      },
    },
    {
      title: '',
      dataIndex: 'delete',
      key: 'delete',
      width: 40,

      render: (text: any, record: any) => {
        return <span onClick={() => toggleHandler(record?.policy_type_id, record?.policy_type_name)} style={{ color: "red", cursor: "pointer" }}><DeleteOutlined /></span>;
      },
    },
  ];
  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">Policy List</h1>
      </header>
      <Link to={`/config/add-update-policyTypes?policyId=${policy_id}`}>
        <div className="addIcon">
          <PlusOutlined
            className="plusIcon"
          />
        </div>
      </Link>
      <main>
        <div className="searchproduct">
          <div className="searchStoreType">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search Policy"
              onChange={searchStore}
              className="searchContainer"
            />
          </div>
          <div>
            <DeleteItem
              toggle={toggleDelete}
              name={deleteName}
              itemsId={deleteId}
              deleteService={deletePolicyTypeService}
              closeModal={(e: any) => {
                setToggleDelete(e);
              }} />
            <Table className="content"
              columns={columns}
              dataSource={

                filteredData?.map((data: any) => ({
                  policy_type_id: data?.policy_type_id,
                  policy_code: data?.policy?.policy_code,
                  policy_type_name: `${capitalizeSubstring(data?.policy_type_name)}`,
                  claim_type: data?.claim_type,
                  cost: data?.cost_per_km,
                  travel_type: data?.policy?.policy_name,
                  date: dateFormatterNew(data?.created_at),
                  edit: "",
                  delete: ""
                }))
              }
              bordered
              scroll={{ x: "100%" }}
              size="small" pagination={false} />
          </div>
        </div>
      </main>
    </div>
  );
}
