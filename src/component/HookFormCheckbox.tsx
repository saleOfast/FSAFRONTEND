import React, { useEffect, useState } from 'react';
import { Checkbox, CheckboxProps } from 'antd';
import { dateFormatterNew } from 'utils/common';

interface CheckboxGroupState {
  options: Array<{ label: string; value: string }>;
  value: string[];
}
interface MyData {
  storeName: string[];
  storeId: string[];
  placeholder: string;
}
interface IHookFormCheckboxProps {
  data: MyData[];
  control: any;
  type: string;
  name: string;
  callback?: Function | undefined;
}

const HookFormCheckbox: React.FC<IHookFormCheckboxProps> = ({ data, callback }) => {
  const storeDatacheck: any = data.map(i => ({
    label: '',
    value: i?.storeId
  }));

  let [checkedList, setCheckedList] = useState<CheckboxGroupState[]>([]);
  useEffect(() => {
    if (callback) {
      callback(checkedList);
    }

  }, [checkedList])
  const[allChecked, setAllChecked] = useState<boolean>(false)
  const d: any[] = data
  const onCheckChange: CheckboxProps['onChange'] = (e) => {
    const isChecked = e?.target?.checked ?? false;
    const allValues = storeDatacheck.map((opt: any) => opt.value);
    setCheckedList(isChecked ? allValues : []);
   
  };
useEffect(()=>{
  const allValues = storeDatacheck.map((opt: any) => opt.value);
  if(checkedList?.length && allValues?.length === checkedList?.length){
    setAllChecked(true)
  }else {
    setAllChecked(false)
  }
}, [checkedList])
  const onCheckAllChange: any = (e:any,value:any) => {
    const { checked } = e.target;
    if (checked && !checkedList.includes(value)) {
      setCheckedList((prev) => [...prev, value ]);
    } else {
      setCheckedList((prev) => prev.filter((item) => item !== value));
    }
  };
  return (
    <div>
      <table border={1}>
        <thead>
          <tr className='fs-9'>
            <th className="createvisittable">
              <Checkbox onChange={onCheckChange} checked={allChecked || false}></Checkbox>
            </th>
            <th className="createvisittable">Store Name</th>
            <th className="createvisittable">Store Id</th>
            <th className="createvisittable">Last Visit</th>
            {/* <th className="createvisittable">LMV</th> */}
          </tr>
        </thead>
        <tbody>

          {data?.map((data: any) => {
            return (
              <tr  key={data.storeId}>
                <td>
                    <Checkbox 
                    checked ={checkedList.includes(data?.storeId) || false}
                    
                    onChange={(e)=>{onCheckAllChange(e,data?.storeId)}} ></Checkbox>
                </td>
                <td>{data?.storeName}</td>
                <td>{data?.storeId}</td>
                {/* <td>{dateFormatterNew(data?.updatedAt)}</td> */}
                <td></td>
              </tr>
            )
          })}

        </tbody>
      </table>
    </div>
  );
};

export default HookFormCheckbox;
