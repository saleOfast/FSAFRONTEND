import { Form, Input, Typography } from "antd";
import React from "react";
import { Controller } from "react-hook-form";

interface IHookFormInputField
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  control: any;
  label?: any;
  callback?: Function;
  formGroupName?: any;
  addonAfter?: string;
  addonBefore?: string;
  disabled?: boolean;
}
function HookFormInputField({
  name,
  control,
  label,
  required,
  className,
  formGroupName,
  callback,
  addonAfter,
  addonBefore,
  disabled,
  ...props
}: IHookFormInputField) {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Form.Item
            label={
              required && label ? (
                <>
                  <Typography.Text>{label}</Typography.Text>{" "}
                  <Typography.Text type="danger" className="ml-1">
                    *
                  </Typography.Text>
                </>
              ) : (
                label
              )
            }
            className={`${formGroupName ? formGroupName : ""}`}
            help={error?.message}
            validateStatus={error ? "error" : ""}
          >
            {props.type === "textarea" ? (
              <Input.TextArea {...(props as any)} {...field} />
            ) : props.type === "password" ? (
              <Input.Password
                {...(props as any)}
                {...field}
                autoComplete="new-password"
              />
            ) : (
                <Input
                {...(props as any)}
                {...field}
                onChange={(event) => {
                  let value: any = event.target.value;
                  if (props.type === "number") {
                    value = value === "" ? "" : Number(value);
                  }
                  field.onChange(value);
                  if (callback) {
                    callback(value);
                  }
                }}
                type={props.type} // Ensure type="number" is applied
                addonBefore={addonBefore ? addonBefore : null}
                addonAfter={addonAfter ? addonAfter : null}
                disabled={disabled}
              />
            )}
          </Form.Item>
        )}
      />
      <style>
        {`
            // .ant-col .ant-form-item-label .css-dev-only-do-not-override-af4yj3{
            // flex: 0 0 100%;
            // max-width: 100%;
            // }
            // :where(.css-dev-only-do-not-override-af4yj3).ant-form-item .ant-form-item-label{
            // text-align: left!important;
            // }
        //    :where(.css-dev-only-do-not-override-af4yj3).ant-row{
        //     display: block!important;
        //     } 
            `}
      </style>
    </>
  );
}

export default HookFormInputField;
