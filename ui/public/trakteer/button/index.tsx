import "../index.css";
import "./index.css";

type ButtonProps = {
  children: React.ReactNode;
  style?: "shadow" | "default" | "icon";
  variant?: "default" | "outline" | "destructive" | "dark";
};

const Button = ({
  children,
  style = "shadow",
  variant = "default",
}: ButtonProps) => {
  return (
    <button data-theme="trakteer" data-variant={variant} data-style={style}>
      {children}
    </button>
  );
};

export { Button };
