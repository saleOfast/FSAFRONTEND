import { Checkbox, Form, SelectProps } from 'antd';
import React from 'react'
import { Controller } from 'react-hook-form'
import { ISelectOption } from 'types/Common';
import type { CheckboxProps } from 'antd';
interface IHookFormCheckboxField extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    control: any;
    label?: any;
    callback?: Function | undefined;
    formGroupName?: any;
    showSearch?: boolean;
    allowClear?: boolean;
    filterOption?: any;
    // optionData: ISelectOption[];
    mode?: any;
    selectedUser?: any;
    value?: any;
}
function HookFormCheckboxField({value, mode, name, control, label, required, className, formGroupName, callback, showSearch = false, allowClear = false, filterOption, selectedUser, ...props }: IHookFormCheckboxField) {
    const _optionData: ISelectOption[] = [{ label: props.placeholder ? props.placeholder : "Select", value: "", disabled: true }]
    const options: SelectProps['options'] = [];
    const onChange: CheckboxProps['onChange'] = (e) => {
        if (callback) {
            callback(e.target.checked); // Call the callback only if it's defined
        }
    };
    console.log({value})
    return (
        <Controller
            name={name}
            control={control}
            render={({
                field,
                fieldState: { error },
            }) => (
                <Form.Item
                    className={`${formGroupName ? formGroupName : ""}`}
                    help={error?.message}
                    validateStatus={error ? 'error' : ''}>
                    <Checkbox onChange={onChange} checked={value} style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: "flex-end" }}>
                        <span style={{ marginRight: '8px' }}>{label}</span>
                    </Checkbox>
                </Form.Item>
            )}
        />
    )
}

export default HookFormCheckboxField