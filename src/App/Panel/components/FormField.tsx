import React, { Fragment } from "react";
import { Input, Button } from "antd";

export default function FormField(props) {
  function handleLabelChange(e) {
    triggerChange({ label: e.target.value });
  }

  function handleValueChange(e) {
    triggerChange({ value: e.target.value });
  }

  function handleFieldDelete() {
    const { onDel, onChange, value } = props;
    value.fieldStatus = "DELETED";
    if (onChange) {
      onChange({
        ...value,
      });
    }
    if (onDel) {
      onDel(value);
    }
  }

  function triggerChange(changedValue) {
    const { onChange, value } = props;
    value.data = { ...value.data, ...changedValue };
    if (onChange) {
      onChange({
        ...value,
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
        <Button onClick={handleFieldDelete}>删除字段</Button>
      </Fragment>
    );
  }

  return renderConent();
}
