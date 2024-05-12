import React from "react";
import Link from "next/link";
import { StandardLoader } from "../loaders/Loader";

export default function DefaultButton({
  text,
  className,
  type,
  onClick,
  variant,
  href,
  loading,
  disabled,
}: {
  text: string;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "link";
  href?: string;
  loading?: boolean;
  disabled?: boolean;
}) {
  const classes = `rounded-lg flex items-center justify-center text-center text-xs xl:text-sm 2xl:text-base px-6 py-2 xl:px-14 xl:py-3 text-white bg-black-nav hover:bg-slate-800 transition-all duration-[0.3s] shadow-custom ${
    className ? className : ""
  }`;

  let content: React.ReactNode;

  if (variant === "link") {
    content = (
      <Link className={classes} href={href || "/"} scroll={true}>
        {text}
      </Link>
    );
  } else if (type === "submit") {
    content = (
      <button type="submit" className={classes} disabled={disabled || loading}>
        {text}
      </button>
    );
  } else {
    content = (
      <button
        className={classes}
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading ? <StandardLoader /> : text}
      </button>
    );
  }

  return content;
}
