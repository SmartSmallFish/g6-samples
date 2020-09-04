import React, { Component, Fragment } from "react";
import { Input, Button } from "antd";

export default function FormField(props) {
  // handleLabelChange = (e) => {
  //   this.triggerChange({ label: e.target.value });
  // };

  // handleValueChange = (e) => {
  //   this.triggerChange({ value: e.target.value });
  // };

  // triggerChange = (changedValue) => {
  //   const { onChange, value } = props;
  //   if (onChange) {
  //     onChange({
  //       ...value,
  //       ...changedValue,
  //     });
  //   }
  // };

  function handleLabelChange(e) {
    triggerChange({ label: e.target.value });
  }

  function handleValueChange(e) {
    triggerChange({ value: e.target.value });
  }

  function triggerChange(changedValue) {
    const { onChange, value } = props;
    if (onChange) {
      onChange({
        ...value,
        ...changedValue,
      });
    }
  }

  function renderConent() {
    const { value } = props;
    const { data } = value;

    return (
      <Fragment>
        <Input value={data.label} onChange={handleLabelChange} />
        <Input value={data.value} onChange={handleValueChange} />
        <Button
          onClick={() => {
            props.onDel && props.onDel(value);
          }}
        >
          删除字段
        </Button>
      </Fragment>
    );
  }

  return renderConent();
}
