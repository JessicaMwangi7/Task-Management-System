export default function Checkbox(props) {
    return (
      <input
        type="checkbox"
        {...props}
        className={`rounded border-gray-300 text-primary focus:ring-primary ${props.className || ""}`}
      />
    );
  }
  