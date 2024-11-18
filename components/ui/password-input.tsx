import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="flex items-center  w-full rounded-md border border-input text-sm ring-offset-background relative">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "w-full h-10 bg-background px-3 py-2 rounded-md  placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          )}
          ref={ref}
          {...props}
        />
        <div
          className="cursor-pointer absolute right-2"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </div>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
