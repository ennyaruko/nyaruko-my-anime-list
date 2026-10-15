import { useState } from "react";
import type {
  MouseEvent,
  PointerEvent,
  KeyboardEvent,
  HTMLAttributes,
} from "react";

import clsx from "clsx";

import { StarIcon, StarDuotoneIcon } from "../../icons";

import * as styles from "./Rating.css";

const DEFAULT_STAR_COUNT = 5;
const VALUE_PER_STAR = 2;
const DEFAULT_RATING_MAX = DEFAULT_STAR_COUNT * VALUE_PER_STAR;

export type RatingProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange" | "defaultValue"
> & {
  max?: number;
  value?: number;
  size?: "s" | "m";
  defaultValue?: number;
  onChange?: (value: number) => void;
};

function normalizeMax(max: number): number {
  return Number.isFinite(max)
    ? Math.max(1, Math.floor(max))
    : DEFAULT_RATING_MAX;
}

function normalizeValue(value: number, max: number): number {
  if (!Number.isFinite(value)) return 0;

  return Math.round(Math.max(0, Math.min(value, max)));
}

type RatingPointerEvent = {
  clientX: number;
  currentTarget: HTMLButtonElement;
};

export function Rating({
  value,
  onChange,
  className,
  size = "m",
  onPointerLeave,
  defaultValue = 0,
  max = DEFAULT_RATING_MAX,
  ...props
}: RatingProps) {
  const ratingMax = normalizeMax(max);
  const starCount = Math.ceil(ratingMax / VALUE_PER_STAR);

  const [internalValue, setInternalValue] = useState(() =>
    normalizeValue(defaultValue, ratingMax),
  );
  const [hoveredValue, setHoveredValue] = useState<null | number>(null);

  const selectedValue = normalizeValue(value ?? internalValue, ratingMax);
  const displayValue = hoveredValue ?? selectedValue;

  const selectValue = (nextValue: number) => {
    const normalizedValue = normalizeValue(nextValue, ratingMax);

    if (value === undefined) {
      setInternalValue(normalizedValue);
    }

    onChange?.(normalizedValue);
  };

  const getValueAtPointer = (event: RatingPointerEvent, index: number) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();

    if (width <= 0) return index * VALUE_PER_STAR;

    const position = Math.max(0, Math.min(1, (event.clientX - left) / width));

    return normalizeValue(
      Math.min(ratingMax, index * VALUE_PER_STAR + position * VALUE_PER_STAR),
      ratingMax,
    );
  };

  const handlePointerMove = (
    event: PointerEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.pointerType !== "mouse") return;

    const nextValue = getValueAtPointer(event, index);

    setHoveredValue((currentValue) =>
      currentValue === nextValue ? currentValue : nextValue,
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let nextValue: null | number = null;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        nextValue = selectedValue + 1;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        nextValue = selectedValue - 1;
        break;
      case "Home":
        nextValue = 0;
        break;
      case "End":
        nextValue = ratingMax;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectValue(nextValue);
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>, index: number) => {
    selectValue(getValueAtPointer(event, index));
  };

  return (
    <div
      {...props}
      className={clsx(styles.root, styles.size[size], className)}
      onPointerLeave={(event) => {
        setHoveredValue(null);
        onPointerLeave?.(event);
      }}
    >
      {Array.from({ length: starCount }, (_, index) => {
        const starValue = (index + 1) * VALUE_PER_STAR;
        const halfValue = starValue - 1;
        const filled = displayValue >= starValue;
        const halfFilled = !filled && displayValue >= halfValue;

        return (
          <button
            key={index}
            type="button"
            onKeyDown={handleKeyDown}
            className={styles.starFrame}
            onClick={(event) => handleClick(event, index)}
            onPointerMove={(event) => handlePointerMove(event, index)}
          >
            <span className={styles.starHitArea} />
            <span className={styles.starVisual}>
              {halfFilled ? (
                <StarDuotoneIcon
                  className={clsx(styles.starIcon, styles.starHalf)}
                />
              ) : (
                <StarIcon
                  className={clsx(styles.starIcon, {
                    [styles.starFilled]: filled,
                    [styles.starEmpty]: !filled,
                  })}
                />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export type RatingCompactProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  value: number;
};

export function RatingCompact({
  value,
  className,
  ...props
}: RatingCompactProps) {
  return (
    <span {...props} className={clsx(styles.compact, className)}>
      <StarIcon className={styles.compactStar} />
      {value === 10 ? "10" : value.toFixed(1)}
    </span>
  );
}
