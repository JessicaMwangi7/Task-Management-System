export const Select = ({ children, ...props }) => <select {...props}>{children}</select>;
export const SelectTrigger = ({ children, ...props }) => <div {...props}>{children}</div>;
export const SelectContent = ({ children, ...props }) => <div {...props}>{children}</div>;
export const SelectItem = ({ children, ...props }) => <option {...props}>{children}</option>;
export const SelectValue = ({ children }) => <span>{children}</span>;
