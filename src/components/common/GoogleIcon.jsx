import { createElement } from "react";
import { Icon } from "lucide-react";

export const GoogleIcon = (props) =>
  createElement(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      width: "1em",
      height: "1em",
    },
    <path d="M21.35 11.1h-9.18v2.92h5.42c-.23 1.25-.93 2.31-1.98 3.02l3.2 2.49c1.86-1.72 2.93-4.25 2.93-7.26 0-.7-.07-1.38-.2-2.04z" fill="#4285F4" />,
    <path d="M12.17 22c2.7 0 4.97-.9 6.63-2.46l-3.2-2.49c-.9.6-2.04.96-3.43.96-2.64 0-4.88-1.78-5.68-4.18H3.19v2.62A9.83 9.83 0 0 0 12.17 22z" fill="#34A853" />,
    <path d="M6.49 13.83a5.87 5.87 0 0 1 0-3.66V7.55H3.19a9.84 9.84 0 0 0 0 8.9l3.3-2.62z" fill="#FBBC05" />,
    <path d="M12.17 5.27c1.47 0 2.78.51 3.81 1.5l2.85-2.85A9.81 9.81 0 0 0 12.17 2a9.83 9.83 0 0 0-8.98 5.55l3.3 2.62c.8-2.4 3.04-4.18 5.68-4.18z" fill="#EA4335" />
  );
