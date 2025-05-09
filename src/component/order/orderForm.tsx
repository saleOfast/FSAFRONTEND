import React, { useEffect, useMemo, useState, useContext, useRef, useCallback } from 'react'
import '../style/createBeat.css'
import Footer from '../common/footer'
import previousPage from 'utils/previousPage'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setLoaderAction } from 'redux-store/action/appActions'
import { capitalizeSubstring } from 'utils/capitalize'
import Table from 'antd/es/table'
import { Checkbox, message, Select, TreeSelect } from 'antd'
import { AppDispatch } from 'redux-store/store'
import { useAuth } from 'context/AuthContext'
import { TimelineEnum, UserRole, VisitTypeEnum } from 'enum/common'
import { axisLeft } from 'd3'
import type { InputRef } from 'antd';
import { Button, Form, Input, Popconfirm, } from 'antd';
import { getProductBrandActions, getProductCategoryActions, getProductsActions } from 'redux-store/action/productAction'
import { getColourService, getProductsService, getSizeService } from 'services/productService'
import { OrderStatus } from 'enum/order'
import { getValidationErrors } from 'utils/errorEvaluation'
import { ICreateOrderReq } from 'types/Order'
import { createOrderService, getOrderSummaryByOrderIdService } from 'services/orderService'
import { getStoresByEmpIdService } from 'services/usersSerivce'
import { DiscountTypeEnum } from 'enum/product'
import { IOrderItem } from 'types/Product'
import { getStoreByIdService } from 'services/storeService'

// type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<any | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}


interface Option {
  value: string;
  label: string;
  children?: Option[];
}
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  name: string;
  age: string;
  address: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;


export default function OrderForm() {
  const navigate = useNavigate();
    const location = useLocation();
  const [productData, setOrderItems] = useState<any>([]);
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = new URLSearchParams(location?.search);
  const isOrderForm: any = searchParams.get('isOrderForm');
  const dispatch = useDispatch<AppDispatch>();
  const productBrand = useSelector((state: any) => state?.product?.brand);
  const productCategoryData = useSelector((state: any) => state?.product?.category);
  const params: any = useParams<{ visitId: string, storeId: string, orderId: string, }>();
  if (params.orderId) {
    params.visitId = undefined
  }
  const [colourData, setColourData] = useState<any>([]);
  const [sizeData, setSizeData] = useState<any>([]);
  const sortByActive = (a: any, b: any, key: string) => {
    if (!a[key] && b[key]) {
      return 1;
    } else if (a[key] && !b[key]) {
      return -1;
    }
    return 0;
  };
  const [productList, setProductList] = useState<any[]>([]);
  const [brandId, setBrandId] = useState<any>();
  const [categoryId, setCategoryId] = useState<any>();


  useEffect(() => {
    if (brandId || categoryId) {
      dispatch(getProductsActions({ brand: brandId, category: categoryId }));
    }
  }, [brandId, categoryId]);

  const [dataSource, setDataSource] = useState<any[]>([]);

 
    let initialData = useMemo(async () => {
      if (!params?.orderId) {
      const data: any = [
        {
          key: 0,
          sn: 1,
          total: 0,
          price: 0,
          discount: 0
        }
      ];

      // Add properties for each size
      sizeData?.forEach((size: any) => {
        data[0][size.name] = 0;
      });

      const totalRow: any = {
        key: 'total',
        sn: '',
        total: 0,
        price: 0,
        discount: 0
      };

      sizeData?.forEach((size: any) => {
        totalRow[size.name] = 0;
      });
      data.push(totalRow);
      return setDataSource(data);
    }
    }, [sizeData]);
  let [selectedStore, setSelectedStore] = useState<any>();
  
  async function getOrderSummaryData() {
    try {
      if (params?.orderId) {
        dispatch(setLoaderAction(true));
        const res = await getOrderSummaryByOrderIdService(params?.orderId);
        dispatch(setLoaderAction(false));
        setSelectedStore(res?.data?.data?.storeId)
        setSelectedVisitType(res?.data?.data?.isCallType)
        setCount(res?.data?.data?.products?.length ?? 0)

        if (res.data.data.products) {
          const mappedProducts: any = res.data.data.products.map((item: any, index: any) => {
            const sizes = item.size ? { ...item.size } : {};
            const totalSizeQuantity = Object.values(sizes).reduce((acc: number, qty: any) => acc + Number(qty), 0);
            return {
              storeId: item.storeId,
              isCallType: item.isCallType,
              brandId: item.brandId,
              categoryId: item.categoryId,
              isFocused: item.isFocused,
              mrp: item.mrp,
              noOfCase: item.noOfCase,
              noOfPiece: item.noOfPiece,
              productId: item.productId,
              product: item.productName,
              rlp: item.rlp,
              caseQty: item.caseQty,
              skuDiscount: item.skuDiscount,
              netAmount: 0,
              ...sizes, // Mapped sizes
              colour: item.colour,
              total: totalSizeQuantity,
              sn: index + 1,
              key: index + 1,
              discount: item?.pieceDiscount ?? 0
            };
          });

          const totalRow: any = {
            key: 'total',
            sn: '',
            total: 0,
            price: 0,
            discount: 0
          };
          const data = [totalRow];
          mappedProducts.forEach((product: any) => {
            totalRow.total += product.total;
            totalRow.price += product.price;
          });
          setDataSource((prevState) => [...mappedProducts, totalRow]);

          if (res.data.data.visibilityDiscountValue !== null && +res.data.data.visibilityDiscountValue > 0) {
            setIsVisibility(true);
          }
        }
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  }


  const handleProductList = async () => {
    dispatch(setLoaderAction(true));
    try {
      const response = await getProductsService({ isActive: true, brand: brandId, category: categoryId });
      dispatch(setLoaderAction(false));
      setOrderItems(response.data.data
        .sort((a, b) => sortByActive(a, b, "isFocused"))
        .map(item => ({
          ...item,
          noOfCase: 0,
          noOfPiece: 0,
          skuDiscountAmount: 0,
          netAmount: 0,
          totalAmount: 0
        })));
    } catch (error: any) {
      dispatch(setLoaderAction(false));
    }
  };
  useEffect(() => {
    handleProductList();
    getOrderSummaryData();
  }, [brandId, categoryId]);

  let [selectedVisitType, setSelectedVisitType] = useState<any>(null);
  const [selectedStoreData, setSelectedStoreData] = useState<any>();
  const handleStoreChange = async (value: string) => {
    setSelectedStore(value);
    try {
      dispatch(setLoaderAction(true));
      const response = await getStoreByIdService(selectedStore ?? value);
      dispatch(setLoaderAction(false));
      if (response && response.status === 200) {
        let { data } = response.data;
        setSelectedStoreData(data);
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
  useEffect(() => {
    if (!params?.visitId) {
      const data: any = {
        storeDetails: selectedStoreData
      };

      setVisitDetails(data); // This will only be called when `params` changes
    }
  }, [params, selectedStoreData]);
  const handleVisitTypeChange = (value: VisitTypeEnum) => {
    setSelectedVisitType(value);
  };
  const [visitDetails, setVisitDetails] = useState<any | null>(null);



  const handleVisitDetails = useCallback(async () => {
    try {
      if (selectedStore || params?.storeId) {
        const res = await getStoreByIdService(selectedStore ?? params?.storeId)
        setVisitDetails(res.data.data);
      }
    } catch (error) {

    }
  }, [params?.storeId, selectedStore]);

  useEffect(() => {
    handleProductList();
    handleVisitDetails()
  }, [params?.storeId, selectedStore]);
  async function fetchColourData() {
    try {
      dispatch(setLoaderAction(true));
      setIsLoading(true)
      const res = await getColourService();
      if (res?.data?.status === 200) {
        setColourData(res?.data?.data)
        dispatch(setLoaderAction(false));
        setIsLoading(false)
      }
      setIsLoading(false)
      dispatch(setLoaderAction(false));
    } catch (error) {
      dispatch(setLoaderAction(false));
      setIsLoading(false)
    }
  }

  async function fetchSizeData() {
    try {
      dispatch(setLoaderAction(true));
      setIsLoading(true)
      const res = await getSizeService();
      if (res?.data?.status === 200) {
        setSizeData(res?.data?.data)
        dispatch(setLoaderAction(false));
        setIsLoading(false)
      }
      setIsLoading(false)
      dispatch(setLoaderAction(false));
    } catch (error) {
      dispatch(setLoaderAction(false));
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchSizeData();
    fetchColourData();
  }, []);
  const [count, setCount] = useState(2);

  const prevDataSourceRef = useRef<any[]>([]);


  const handleAdd = async () => {
    setCount((prevCount) => {
      const newCount = prevCount + 1;

      setDataSource((prevDataSource) => {
        const newData: any = {
          sn: newCount,
          key: newCount,
          productId: null,
          discount: 0
        };

        sizeData?.forEach((size: any) => {
          newData[size.name] = 0;
        });
        const updatedDataSource = [...prevDataSource];
        if (updatedDataSource?.length > 1) {
          updatedDataSource.splice(updatedDataSource?.length - 1, 0, newData);
        } else {
          updatedDataSource.push(newData);
        }
        return updatedDataSource;
      });
      return newCount;
    });
  };

  const productHandler = (value: any, key: any) => {
    setDataSource((prevDataSource) =>
      prevDataSource.map((item) =>
        item.key === key ? { ...item, productId: value } : item
      )
    );
  };
  const handleColourChange = (value: any, key: any) => {
    setDataSource((prevDataSource: any[]) =>
      prevDataSource.map((item: any) =>
        item.key === key ? { ...item, colour: value } : item
      )
    );
  };
  const handleQuantityChange = (value: string, key: any) => {
    setDataSource((prevDataSource: any[]) =>
      prevDataSource.map((item: any) =>
        item.key === key ? { ...item, quantity: Number(value) || 0 } : item
      )
    );
  };
  
 const [discountData, setDiscountData] = useState<any>()
  const handleDiscountChange = (value: any, key: any) => {
    // console.log({value})
    setDiscountData(value)
    setDataSource((prevDataSource: any[]) =>
      prevDataSource.map((item: any) =>
        item.key === key ? { ...item, discount: value ? Number(value) : null } : item
      )
    );
  };

  const getUpdatedAmount = (orderItem: IOrderItem, total: any) => {
    const RlpAmount = orderItem?.rlp * total;
    let totalAmount = RlpAmount
    let discountedAmount = 0;
    if (!visitDetails?.isPremiumStore && orderItem?.skuDiscount && orderItem?.skuDiscount?.isActive) {
      if (orderItem.skuDiscount.discountType === DiscountTypeEnum.PERCENTAGE) {
        discountedAmount = Number(((totalAmount * orderItem.skuDiscount.value) / 100).toFixed(2));
      }
      if (orderItem.skuDiscount.discountType === DiscountTypeEnum.VALUE) {
        discountedAmount = orderItem.skuDiscount.value * total;
      }
    }
    return {
      totalAmount: totalAmount,
      discountedAmount: discountedAmount
    }
  };
  // useEffect(() => {
  //   const updatedDataSource = dataSource.map((item) => {
  //     const total = sizeData.reduce((sum: any, size: any) => {
  //       return sum + Number(item[size.name] || 0);
  //     }, 0);
  //     const product = productData.find((data: any) => data?.productId === item.productId);
  //     const price = product ? Number(product.rlp) * Number(total) : 0;
  //     // console.log({total, dataSource })
  //     const sizeValue: any = {};
  //     sizeData.forEach((size: any) => {
  //       sizeValue[size.name] = item[size.name] || 0;
  //     });
  //     return { ...item, total, price, product: product, size: sizeValue, };
  //   });

  //   const totalRow = {
  //     ...dataSource[dataSource?.length - 1], // Start with the existing total row
  //     total: updatedDataSource.reduce((sum: any, row: any) => sum + row.total, 0),
  //     price: updatedDataSource.reduce((sum: any, row: any) => sum + row.price, 0),
  //     discount: updatedDataSource.reduce((sum: any, row: any) => sum + (Number(row.discount) * Number(row.total)), 0),
  //   };

  //   updatedDataSource[dataSource?.length - 1] = totalRow;

  //   if (JSON.stringify(updatedDataSource) !== JSON.stringify(prevDataSourceRef.current)) {
  //     prevDataSourceRef.current = updatedDataSource;
  //     setDataSource(updatedDataSource);
  //   }
  // }, [dataSource, sizeData, productData, discountData, selectedStore]);

  const memoizedDataSource = useMemo(() => {
    if (dataSource.length === 0) return [];
  
    const updatedDataSource = dataSource.slice(0, -1).map((item) => ({
      ...item,
      product:productData.find((data: any) => data?.productId === item.productId),
      total: Number(item.quantity || 0), // Use `quantity`
      price: (productData.find((p:any) => p.productId === item.productId)?.rlp || 0) * Number(item.quantity || 0),
    }));
  
    return updatedDataSource;
  }, [dataSource, productData]);
  
  const totalRow = useMemo(() => {
    if (memoizedDataSource.length === 0) return dataSource[dataSource.length - 1] || {};
  
    return {
      ...dataSource[dataSource.length - 1], // Preserve last row structure
      total: memoizedDataSource.reduce((sum, row) => sum + row.total, 0),
      price: memoizedDataSource.reduce((sum, row) => sum + row.price, 0),
      discount: memoizedDataSource.reduce(
        (sum, row) => sum + (Number(row.discount) * Number(row.total)), 0
      ),
    };
  }, [memoizedDataSource, dataSource]);
  
  useEffect(() => {
    const newDataSource = [...memoizedDataSource, totalRow];
  
    if (JSON.stringify(newDataSource) !== JSON.stringify(prevDataSourceRef.current)) {
      prevDataSourceRef.current = newDataSource;
      setDataSource(newDataSource);
    }
  }, [totalRow, memoizedDataSource]);
  
  
  // const memoizedDataSource = useMemo(() => {
  //   if (dataSource.length === 0) return [];
  
  //   return dataSource.map((item, index) => {
  //     if (index === dataSource.length - 1) return item; // Keep last row unchanged
  
  //     return {
  //       ...item,
  //       total: Number(item.total || 0), // Use `quantity` instead of `sizeData`
  //       price: (productData.find((p:any) => p.productId === item.productId)?.rlp || 0) * Number(item.total || 0),
  //     };
  //   });
  // }, [dataSource, productData]); // Dependencies ensure recomputation only when needed
  
  // useEffect(() => {
  //   if (JSON.stringify(memoizedDataSource) !== JSON.stringify(prevDataSourceRef.current)) {
  //     prevDataSourceRef.current = memoizedDataSource;
  //     setDataSource(memoizedDataSource);
  //   }
  // }, [memoizedDataSource]); // Only runs when `memoizedDataSource` changes
  
  
  
  // useEffect(() => {
  //   if (!dataSource.length) return;
  
  //   const updatedDataSource = dataSource.map((item, index) => {
  //     if (index === dataSource.length - 1) return item; // Skip last row modification
  
  //     const total = sizeData.reduce((sum: any, size: any) => sum + Number(item[size.name] || 0), 0);
  //     const product = productData.find((data: any) => data?.productId === item.productId);
  //     const price = product ? Number(product.rlp) * Number(total) : 0;
  
  //     return { ...item, total, price };
  //   });
  
  //   // Compute total values for last row
  //   const totalRow = {
  //     key: "total-row",
  //     sn: "Total",
  //     product: "",
  //     colour: "",
  //     total: updatedDataSource.reduce((sum: any, row: any) => sum + (row.total || 0), 0),
  //     price: updatedDataSource.reduce((sum: any, row: any) => sum + (row.price || 0), 0),
  //     discount: updatedDataSource.reduce((sum: any, row: any) => sum + (Number(row.discount || 0) * Number(row.total || 0)), 0),
  //     action: "",
  //   };
  
  //   if (dataSource.length > 1) {
  //     updatedDataSource[dataSource.length - 1] = totalRow;
  //   } else {
  //     updatedDataSource.push(totalRow);
  //   }
  
  //   if (JSON.stringify(updatedDataSource) !== JSON.stringify(prevDataSourceRef.current)) {
  //     prevDataSourceRef.current = updatedDataSource;
  //     setDataSource(updatedDataSource);
  //   }
  // }, [dataSource, sizeData, productData, discountData, selectedStore]);
  
  // useEffect(() => {
  //   const updatedDataSource = dataSource.map((item) => {
  //     const total = sizeData.reduce((sum: any, size: any) => {
  //       return sum + Number(item[size.name] || 0);
  //     }, 0);
  //     const product = productData.find((data: any) => data?.productId === item.productId);
  //     const price = product ? Number(product.rlp) * Number(total) : 0;
  //     // console.log({total, dataSource })
  //     const sizeValue: any = {};
  //     sizeData.forEach((size: any) => {
  //       sizeValue[size.name] = item[size.name] || 0;
  //     });
  //     return { ...item, total, price, product: product, size: sizeValue, };
  //   });

  //   const totalRow = {
  //     ...dataSource[dataSource?.length - 1], // Start with the existing total row
  //     total: updatedDataSource.reduce((sum: any, row: any) => sum + row.total, 0),
  //     price: updatedDataSource.reduce((sum: any, row: any) => sum + row.price, 0),
  //     discount: updatedDataSource.reduce((sum: any, row: any) => sum + (Number(row.discount) * Number(row.total)), 0),
  //   };

  //   updatedDataSource[dataSource?.length - 1] = totalRow;

  //   if (JSON.stringify(updatedDataSource) !== JSON.stringify(prevDataSourceRef.current)) {
  //     prevDataSourceRef.current = updatedDataSource;
  //     setDataSource(updatedDataSource);
  //   }
  // }, [dataSource, sizeData, productData, discountData, selectedStore]);
  // useEffect(() => {
  //   const updatedDataSource = dataSource.map((item) => {
  //     const product = productData.find((data: any) => data?.productId === item.productId);
  //     const price = product ? Number(product.rlp) * Number(item.total || 0) : 0; // Use `total` directly
  
  //     return { ...item, price, product };
  //   });
  
  //   // Update total row separately
  //   const totalRow = {
  //     ...dataSource[dataSource?.length - 1],
  //     total: updatedDataSource.reduce((sum: any, row: any) => sum + row.total, 0),
  //     price: updatedDataSource.reduce((sum: any, row: any) => sum + row.price, 0),
  //     discount: updatedDataSource.reduce(
  //       (sum: any, row: any) => sum + (Number(row.discount) * Number(row.total)), 
  //       0
  //     ),
  //   };
  
  //   updatedDataSource[dataSource?.length - 1] = totalRow;
  
  //   if (JSON.stringify(updatedDataSource) !== JSON.stringify(prevDataSourceRef.current)) {
  //     prevDataSourceRef.current = updatedDataSource;
  //     setDataSource(updatedDataSource);
  //   }
  // }, [dataSource, productData, discountData, selectedStore]);
  
  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (any & { editable?: boolean; dataIndex: string })[] = [
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
      title: 'Medicine',
      dataIndex: 'product',
      key: 'product',
      width: 160,
      render: (text: any, record: any, index: number) => {
        if (index === dataSource?.length - 1) {
          return {
            children: <span>{record.product}</span>,
          };
        }
        return (
          <Select
            value={record.productId}
            onChange={(value) => productHandler(value, record.key)}
            style={{ width: "100%" }}
          >
            {productData?.map((product: any) => (
              <Select.Option key={product.productId} value={product.productId}>
                {product.productName}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'Dose/Size',
      dataIndex: 'colour',
      key: 'colour',
      width: 140,
      render: (text: any, record: any, index: number) => {
        if (index === dataSource?.length - 1) {
          return {
            children: <span>{record.name}</span>, // Render blank for total row
          };
        }
        return (
          <Select
            value={record.name}
            onChange={(value) => handleColourChange(value, record.key)}
            style={{ width: "100%" }}
          >
            {sizeData?.map((e: any) => (
              <Select.Option key={e.sizeId} value={e.sizeId}>
                {e.name}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 90,
      editable: true,
      render: (text: any, record: any, index: number) => {
        if (index === dataSource?.length - 1) {
          return {
            children: <span style={{ fontWeight: 600 }}>{record?.total}</span>, // Render total row
          };
        }
        return (
          <Input
            value={text}
            onChange={(e) => handleQuantityChange(e.target.value, record.key)}
          />
        );
      },
    },
    
    {
      title: 'Unit Price',
      dataIndex: 'price',
      key: 'price',
      width: 110,
      render: (text: any, record: any, index: number) => {
        if (index === dataSource?.length - 1) {
          return {
            children: <span style={{ fontWeight: 600 }}>{text}</span>, // Render price total value
          };
        }
        return text; // Normal render for other rows
      },
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 110,
      render: (text: any, record: any, index: number) => {
        if (index === dataSource?.length - 1) {
          return { children: <span style={{ fontWeight: 600 }}>{record.price}</span> };
        }
        return record.price;
      },
    },
    
    // {
    //   title: 'Total Price',
    //   dataIndex: 'price',
    //   key: 'price',
    //   width: 110,
    //   render: (text: any, record: any, index: number) => {
    //     if (index === dataSource?.length - 1) {
    //       return {
    //         children: <span style={{ fontWeight: 600 }}>{text}</span>, // Render price total value
    //       };
    //     }
    //     return text; // Normal render for other rows
    //   },
    // },
    // {
    //   title: 'Discount Per Piece',
    //   dataIndex: 'discount',
    //   key: 'discount',
    //   width: 86,
    //   render: (text: any, record: any, index: number) => {
    //     if (index === dataSource?.length - 1) {
    //       return {
    //         children: <span style={{ fontWeight: 600 }}>{text}</span>, // Render price total value
    //       };
    //     }
    //     // return text; // Normal render for other rows
    //     return (
    //       <Input
    //       value={record.discount ?? ""} 
    //       onChange={(e) => handleDiscountChange(e.target.value, record.key)} 
    //       style={{ width: '100%' }} 
    //       placeholder="Enter Discount"
    //     />
    //     );
    //   },
    // },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 80,
      render: (_: any, record: any, index: number) =>
        index !== dataSource?.length - 1 ? ( // Hide action for the total row
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];
  const rowClassName = (record: any, index: number) => {
    return index === dataSource?.length - 1 ? 'table-row-total' : ''; // Apply class for the last row
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    // console.log({ newData, index })

    let item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const columns = defaultColumns.map((col) => {
    if (col.children) {
      col.children = col.children.map((child: any) => {
        if (child.editable) {
          return {
            ...child,
            onCell: (record: Item) => ({
              record,
              editable: child.editable,
              dataIndex: child.dataIndex,
              title: child.title,
              handleSave,
            }),
          };
        }
        return child;
      });
    }

    if (col.editable) {
      return {
        ...col,
        onCell: (record: Item) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave,
        }),
      };
    }
    return col;
  });

  useEffect(() => {
    dispatch(getProductCategoryActions());
    dispatch(getProductBrandActions());
  }, []);

  useEffect(() => {
    setProductList(productData);
  }, [productData])
  const uniqueBrands = productData?.map((data: any) => data?.brand);
  const optionsBrand = productBrand?.map((data: any) => ({
    label: data?.name,
    value: data?.brandId,
  }));
  const allList = [{ label: "All", value: -1 }]
  optionsBrand.splice(0, 0, ...allList);

  const handleBrandChange = (value: any) => {
    setBrandId(value ?? null)
  };
  const uniqueCategory = productData?.map((data: any) => data?.category);
  const optionsCategory = productCategoryData?.map((data: any) => ({
    label: data?.name,
    value: data?.productCategoryId,
  }));
  const allList2 = [{ label: "All", value: -2 }]

  optionsCategory.splice(0, 0, ...allList2);
  // const [value, setValue] = useState<any>("Category")
  const handleCategoryChange = (value: any) => {
    setCategoryId(value ?? null)
  };

  const [isVisibility, setIsVisibility] = useState(false);

  const calculatedData = useMemo(() => {
    let total = 0;
    let totalSkuDiscount = 0;
    dataSource.forEach((item: any) => {
      // const itemTotal = item?.totalAmount;
      const totalPrice: any = dataSource?.slice(-1)[0]?.price;
      total = totalPrice;
      const d = getUpdatedAmount(item.product, item?.total);
      item.totalAmount = d.totalAmount;
      item.skuDiscountAmount = d.discountedAmount;
      if (!visitDetails?.isPremiumStore) {
        totalSkuDiscount += item.skuDiscountAmount;
      }
    });

    // setNetTotalAmount(total)
    // Order value discount
    let netTotal = total;
    if (totalSkuDiscount > 0) {
      netTotal = netTotal - totalSkuDiscount;
    }
    let orderValueDiscount = 0;
    if (netTotal > 0 && visitDetails?.isActiveOrderValueDiscount && !visitDetails?.isPremiumStore && visitDetails?.orderValueDiscount) {
      const orderValueDiscountObj = visitDetails?.orderValueDiscount;
      let matchedRange = orderValueDiscountObj.find((i: any) => {
        const [min = 0, max = 0] = i.amountRange.split("-");
        return (netTotal > +min && netTotal <= +max);
      })
      if (!matchedRange) {
        for (let item of orderValueDiscountObj) {
          const [_min = 0, max = 0] = item.amountRange.split("-");
          if (netTotal > +max) {
            matchedRange = { ...item };
          }
        }
      }
      if (matchedRange) {
        if (matchedRange.discountType === DiscountTypeEnum.PERCENTAGE) {
          orderValueDiscount = (netTotal * matchedRange.value) / 100;
        }
        else if (matchedRange.discountType === DiscountTypeEnum.VALUE) {
          orderValueDiscount = matchedRange.value;
        }
      }
    }
    // Premium store Flat discount
    if (orderValueDiscount > 0) {
      netTotal = netTotal - orderValueDiscount;
    }
    let flatDiscount = 0;
    if (netTotal > 0 && visitDetails?.isPremiumStore && visitDetails?.flatDiscount?.isActive) {
      const flatDiscountObj = visitDetails.flatDiscount;
      if (flatDiscountObj.discountType === DiscountTypeEnum.PERCENTAGE) {
        flatDiscount = (netTotal * flatDiscountObj.value) / 100;
      }
      else if (flatDiscountObj.discountType === DiscountTypeEnum.VALUE) {
        flatDiscount = flatDiscountObj.value;
      }
    }
    if (flatDiscount > 0) {
      netTotal = netTotal - flatDiscount;
    }
    //  Premium store visibility discount
    let visibilityDiscount = 0;
    if (isVisibility) {
      if (netTotal > 0 && visitDetails?.isPremiumStore && visitDetails?.visibilityDiscount?.isActive) {
        const visibilityDiscountObj = visitDetails?.visibilityDiscount;
        if (visibilityDiscountObj.discountType === DiscountTypeEnum.PERCENTAGE) {
          visibilityDiscount = (netTotal * visibilityDiscountObj.value) / 100;
        } else if (visibilityDiscountObj.discountType === DiscountTypeEnum.VALUE) {
          visibilityDiscount = visibilityDiscountObj.value;
        }
      }
    }
    // Net total amount



    if (visibilityDiscount > 0) {
      netTotal = netTotal - visibilityDiscount;
    }
    let pieceDiscount: number = 0;
    if(dataSource?.length > 0){
      const data = dataSource[dataSource.length - 1];
      pieceDiscount = data?.discount;
      netTotal = netTotal - pieceDiscount;
    }
    return {
      total: total.toFixed(2),
      totalSkuDiscount: totalSkuDiscount.toFixed(2),
      flatDiscount: flatDiscount.toFixed(2),
      visibilityDiscount: visibilityDiscount.toFixed(2),
      orderValueDiscount: orderValueDiscount.toFixed(2),
      pieceDiscount: pieceDiscount?.toFixed(2),
      netTotal: netTotal.toFixed(2),
    };
  }, [dataSource, isVisibility, selectedStore, visitDetails]);
  function errorHandle() {
    if (!params?.visitId) {
      if (!selectedStore || !selectedVisitType) {
        message.warning("Please Select Store and Visit Type");
      }
    }
  }
  const handleCreateOrder = useCallback(async (orderStatus: OrderStatus) => {
    errorHandle();
    if ((params?.visitId && params?.storeId) || (selectedStore && selectedVisitType)) {
      try {
        const requestBody: ICreateOrderReq = {
          orderAmount: +calculatedData.total,
          orderDate: new Date().toISOString(),
          products: dataSource.slice(0, -1)
            .map((i: any) => {
              return {
                categoryId: i?.product?.category?.productCategoryId,
                brandId: i?.product?.brand?.brandId,
                productId: i?.product?.productId,
                productName: i.product?.productName,
                mrp: i.product?.mrp,
                // rlp: getUpdatedAmount(i).totalAmount,
                rlp: i.product?.rlp,
                noOfCase: 0,
                noOfPiece: i?.total,
                skuDiscount: i?.product?.skuDiscount as any || undefined,
                isFocused: false,
                caseQty: 0,
                colour: i?.colour,
                size: i?.size,
                pieceDiscount: i?.discount ?? 0
              }
            }),
          visitId: +params.visitId ? +params.visitId : null,
          storeId: selectedStore ? +selectedStore : +params.storeId,
          isCallType: selectedVisitType ?? VisitTypeEnum.PHYSICAL,
          orderStatus: orderStatus,
          netAmount: +calculatedData.netTotal,
          isVisibility,
          pieceDiscount: +calculatedData?.pieceDiscount
        }
        if (+params?.orderId) {
          requestBody.orderId = +params?.orderId
        }
        dispatch(setLoaderAction(true));
        const res = await createOrderService(requestBody)
        if (res.data.status === 200) {
          message.success(res.data.message)
          dispatch(setLoaderAction(false));
          navigate({ pathname: `/order/checkout/${selectedStore ?? params?.storeId}/${params.visitId}/${params.orderId ?? res.data.data.orderId}` })
          // Navigate({ pathname: `/order/checkout/${params.storeId ?? selectedStore}/${params.visitId}/${res.data.data.orderId}` })
        } else {
          message.error(res.data.message)
        }
      } catch (error) {
        dispatch(setLoaderAction(false));
        message.error(getValidationErrors(error))
      }
    }
  }, [dataSource, selectedStore, selectedVisitType]);

  type Category = {
    productCategoryId: number;
    empId: number;
    name: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    parentId: number | null;
    children: Category[];
    parent: Category | null;
  };

  type CascaderOption = {
    value: number;
    label: string;
    children?: CascaderOption[];
  };

  // Recursive function to map data to Cascader options
  const mapCategoriesToCascaderOptions = (categories: Category[]): CascaderOption[] => {
    const map: { [key: number]: CascaderOption } = {};

    // Map categories to Cascader options
    categories.forEach(category => {
      map[category.productCategoryId] = {
        value: category.productCategoryId,
        label: category.name,
        children: [],
      };
    });

    // Build the hierarchy
    categories.forEach(category => {
      if (category.parentId !== null) {
        const parent = map[category.parentId];
        if (parent) {
          parent.children?.push(map[category.productCategoryId]);
        }
      }
    });

    // Return the options, including "All" option at the start
    return [
      { value: -1, label: "All" }, // Add the "All" option
      ...Object.values(map).filter(option => !categories.some(cat => cat.productCategoryId === option.value && cat.parentId !== null))
    ];
  };

  const allListCat = [{ productCategoryId: -1, name: "All", parentId: null }]; // Dummy data for "All" option

  const catDataFilter: Category[] = [...allListCat, ...productCategoryData];
  const catOptions: CascaderOption[] = mapCategoriesToCascaderOptions(catDataFilter);

  const selectTypeData:any = [
...( authState?.user?.role === UserRole.RETAILER ?   [{ label: "Retailor Order", value: VisitTypeEnum.RETAILER_ORDER }]: [{ label: "Visit Order", value: VisitTypeEnum.PHYSICAL }, { label: "Phone Order", value: VisitTypeEnum.TELEVISIT }])
  ] 
  const [storeData, setStoreData] = useState<any[]>([]);
  const orderStoreList = [
    ...(storeData?.map((i: any) => ({
      label: capitalizeSubstring(i?.storename ?? ""),
      value: i?.storeid,
    })) || []),
  ];
  
  const callTypeList = [...selectTypeData?.map((i: any) => ({ label: i?.label, value: i?.value }))]
  // const {authState} = useAuth()
  // const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function getStoresData() {
      try {
        if (authState?.user?.id) {
          setIsLoading(true);
          const res = await getStoresByEmpIdService(authState?.user?.id);
          setStoreData(res?.data?.data)
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
  
    getStoresData();
  }, [])

  return (
    <div>
      <header className="heading heading-container" style={{ backgroundColor: "#070D79" }}>
        <ArrowLeftOutlined onClick={previousPage} className="back-button" />
        <h1 className="page-title pr-18">ORDER FORM</h1>
      </header>
      {/* {authState?.user?.role !== UserRole.SSM && <Link to="/target-achievement">
                <div className="addIcon">
                    <PlusOutlined className="plusIcon" />
                </div>
            </Link>} */}

            <main className='content' style={{ marginBottom: "120px" }}>
            <div className="selection-line " style={{marginBottom:"10px"}}>
          <div className="brand" style={{ paddingLeft: "10px" }}>
            <label style={{ color: "black", fontSize: "16px", marginRight: "6px" }}>Brand:</label>
            <Select
              id="brandSelect"
              defaultValue="All"
              className='selectFiltBtn'
              onChange={handleBrandChange}
              options={optionsBrand}
              placeholder="Select Brand"
              showSearch // Enables search
              optionFilterProp="label" // Search based on the label of the options
              filterOption={(input:any, option:any) =>
                option?.label?.toLowerCase()?.includes(input?.toLowerCase()) // Custom filter logic
              }
            />
          </div>
          <div className="category"  >
            <label style={{ color: "black", fontSize: "16px", marginRight: "6px" }}>Category:</label>
            <TreeSelect
              showSearch
              className="selectFiltBtn"
              // value={value}
              defaultValue={"All"}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Select Category"
              allowClear
              treeDefaultExpandAll
              onChange={handleCategoryChange}
              treeData={catOptions}
            />
            {/* <Select
              id="brandSelect"
              defaultValue="Category"
              className='selectFiltBtn'
              onChange={handleCategoryChange}
              options={optionsCategory}
            /> */}
          </div>

        </div>

        { isOrderForm == "true" && <div className="selection-line" style={{ marginBottom: "10px" }}>
          <div className="brand">
          <label style={{ color: "black", fontSize: "16px", marginRight: "6px" }}>Chemist:</label>

            <Select
              value={selectedStore}
              className="selectFiltBtn"
              onChange={(value: any) => handleStoreChange(value)}
              options={orderStoreList}
              placeholder="Select Chemist"
              showSearch // Enables search
              optionFilterProp="label" // Search based on the label of the options
              filterOption={(input:any, option:any) =>
                option?.label?.toLowerCase()?.includes(input?.toLowerCase()) // Custom filter logic
              }
            >
              {storeData?.map((d: any) => (
                <Select.Option key={d.storeId} value={d.storeId}>
                  {d.storeName}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className="category">
          <label style={{ color: "black", fontSize: "16px", marginRight: "6px" }}>Order Type:</label>

            <Select
              value={selectedVisitType}
              className="selectFiltBtn"
              onChange={handleVisitTypeChange}
              options={callTypeList}
              placeholder="Select Order Type"
              aria-required
            />

          </div>
        </div>}

        <div style={{ position: 'relative' }}>

          <Table
            components={{
              body: {
                row: EditableRow,
                cell: EditableCell,
              },
            }}
            scroll={{ x: "100%" }}
            rowClassName={rowClassName}
            bordered
            dataSource={dataSource
            }
            columns={columns as ColumnTypes}
            pagination={false}
          />
        </div>
        <Button
          onClick={handleAdd} type="primary" style={{ marginTop: 16, right: 20, position: "absolute" }}>
          Add a row
        </Button>

      </main>
      <Button
        onClick={() => handleCreateOrder(OrderStatus.ORDERPLACED)} type="primary" style={{ marginTop: 16, right: 20, position: "absolute" }}>
        Place Order
      </Button>
      <div className="take-orders-summary deskPriceOrder" style={{ background: "#fbfbfb", zIndex: "999" }} >
        {
          visitDetails?.visibilityDiscount?.isActive &&
          <div className="visibility-discount-cont">
            <Checkbox checked={isVisibility} onChange={e => setIsVisibility(e.target.checked)}>Apply Visibility Discount</Checkbox>
          </div>
        }
        <div className="main-item">
          <div>Total Order Amount</div>
          <div>₹{calculatedData.total}</div>
        </div>
        {
          +calculatedData.totalSkuDiscount > 0 &&
          <div className="main-item discountColor">
            <div>SKU discount</div>
            <div>-₹{calculatedData.totalSkuDiscount}</div>
          </div>
        }
         {
          +calculatedData.pieceDiscount > 0 &&
          <div className="main-item discountColor">
            <div>Total Piece Discount</div>
            <div>-₹{calculatedData.pieceDiscount}</div>
          </div>
        }
        {
          +calculatedData.orderValueDiscount > 0 &&
          <div className="main-item discountColor">
            <div>Order value discount</div>
            <div>-₹{calculatedData.orderValueDiscount}</div>
          </div>
        }
        {
          +calculatedData.flatDiscount > 0 &&
          <div className="main-item discountColor">
            <div>Flat discount</div>
            <div>-₹{calculatedData.flatDiscount}</div>
          </div>
        }
        {
          +calculatedData.visibilityDiscount > 0 &&
          <div className="main-item discountColor">
            <div>Visibility discount</div>
            <div>-₹{calculatedData.visibilityDiscount}</div>
          </div>
        }
        <div className="main-item" style={{ borderTop: "1px solid #ddd", paddingTop: "10px" }}>
          <div>New Order Amount</div>
          <div>₹{calculatedData.netTotal}</div>
        </div>
        <div
          className="orders-btn">
          <Button onClick={() => navigate(-1)}>Cancel</Button>
          <Button
            type="primary"
            onClick={() => handleCreateOrder(OrderStatus.ORDERSAVED)}
            disabled={+calculatedData?.total === 0}>Save</Button>
        </div>
      </div>
      <Footer />
      <style>
        {`
                .grey-background {
                    background-color: #fafafa;
                    font-weight: 600;
                    color: rgba(0, 0, 0, 0.88);
                   }
                .table-row-total {
                    background-color: #f0f0f0 !important; /* Sets the background color to yellow */
                   }
                `}
      </style>
    </div>

  )
}