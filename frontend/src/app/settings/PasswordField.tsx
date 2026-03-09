"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  minLength?: number;
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  minLength,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="pl-10 pr-10"
          placeholder={placeholder}
          required
          minLength={minLength}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
