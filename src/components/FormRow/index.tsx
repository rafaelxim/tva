import React from "react";
import "./styles.scss";

type Props = {
  children: React.ReactNode;
};
const FormRow: React.FC<Props> = ({ children }) => {
  return <div className="formRow">{children}</div>;
};

export default FormRow;
