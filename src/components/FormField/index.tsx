import React from "react";
import "./styles.scss";

type Props = {
  children?: React.ReactNode;
};
const FormField: React.FC<Props> = ({ children }) => {
  return <div className="formField">{children}</div>;
};

export default FormField;
