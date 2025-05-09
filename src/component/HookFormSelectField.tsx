import { Form, Select, SelectProps, Typography } from 'antd';
import React from 'react'
import { Controller } from 'react-hook-form'
import { ISelectOption } from 'types/Common';

interface IHookFormSelectField extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    control: any;
    label?: any;
    callback?: Function | undefined;
    formGroupName?: any;
    showSearch?: boolean;
    allowClear?: boolean;
    filterOption?: any;
    optionData: ISelectOption[];
    mode?: any;
    selectedUser?: any;
    disabled?: boolean;
}
function HookFormSelectField({ mode, name, control, label, required, className, formGroupName, callback, optionData, showSearch = false, allowClear = false, disabled=false, filterOption, selectedUser, ...props }: IHookFormSelectField) {
    const _optionData: ISelectOption[] = [{ label: props.placeholder ? props.placeholder : "Select", value: "", disabled: true},  ...(Array.isArray(optionData) ? optionData : [])]
    const options: SelectProps['options'] = [];
    optionData?.map((data:any)=>{
      return(
        options.push({
          label: data?.label,
          value: data?.value,
        }))
      })
    return (
        <Controller
            name={name}
            control={control}
            render={({
                field,
                fieldState: { error },
            }) => (
                <Form.Item
                    label={label ? (required ?
                        <>
                            <Typography.Text>{label}</Typography.Text> <Typography.Text type='danger' className='ml-1'>*</Typography.Text>
                        </> : label) : undefined}
                    className={`${formGroupName ? formGroupName : ""}`}
                    help={error?.message}
                    validateStatus={error ? 'error' : ''}>
                 {mode === "multiple" ? 
                   <Select
                        {...field}
                        showSearch={showSearch}
                        allowClear={allowClear}
                        filterOption={filterOption}
                        options={options}
                        mode={mode}
                        placeholder={props.placeholder}
                    />
                    :
                    <Select
                        {...field}
                        disabled={disabled}
                        showSearch={showSearch}
                        allowClear={allowClear}
                        filterOption={filterOption}
                        options={_optionData}
                        placeholder={props.placeholder}
                        onChange={(selectedValue) => {
                            field.onChange(selectedValue);
                            if (callback) {
                                callback(selectedValue);
                            }
                        }}
                    />
                    }
                </Form.Item>
            )}
        />
    )
}

export default HookFormSelectField