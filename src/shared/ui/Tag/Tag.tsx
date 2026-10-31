import type { ReactNode, HTMLAttributes, ButtonHTMLAttributes } from "react";

import clsx from "clsx";

import * as styles from "./Tag.css";

type TagSize = "s" | "m";
type TagBaseProps = {
  size?: TagSize;
  children?: ReactNode;
};
export type TagItem = { id: string; label: string };

export type TagProps =
  | (TagBaseProps &
      HTMLAttributes<HTMLSpanElement> & {
        id?: never;
        label?: never;
        onChange?: never;
        asButton?: false;
      })
  | (TagBaseProps &
      Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
        id: string;
        label: string;
        asButton: true;
        onChange?: (tag: TagItem) => void;
      });

export function Tag(props: TagProps) {
  const { asButton, children, className, size = "s" } = props;
  const tagClassName = clsx(styles.tag[size], styles.text, className);

  if (asButton) {
    const { id, label, onChange, ...buttonProps } = props;

    return (
      <button
        {...buttonProps}
        id={id}
        aria-label={props.label}
        className={clsx(styles.button, tagClassName)}
        onClick={() => {
          onChange?.({ id, label });
        }}
      >
        {children}
      </button>
    );
  }

  const spanProps = { ...props, onClick: undefined, asButton: undefined };

  return (
    <span {...spanProps} className={tagClassName}>
      {children}
    </span>
  );
}

export type TagListProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  size?: TagSize;
  tags: TagItem[];
  onChange?: (id: TagItem) => void;
};

export function TagList({
  tags,
  onChange,
  className,
  size = "s",
  ...props
}: TagListProps) {
  return (
    <div {...props} role="group" className={clsx(styles.list, className)}>
      {tags.map(({ id, label }, index) => (
        <Tag
          id={id}
          asButton
          key={id}
          size={size}
          label={label}
          type="button"
          onChange={onChange}
        >
          {label}
          {index < tags.length - 1 ? "," : ""}
        </Tag>
      ))}
    </div>
  );
}
