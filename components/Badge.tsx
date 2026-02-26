"use client";

type BadgeVariant = "success" | "danger" | "info" | "warning";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  info: "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  warning: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
};

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
