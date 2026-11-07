import clsx from "clsx";

import { Checkbox, LabeledCheckbox } from "../Checkbox";
import type { CheckboxProps, LabeledCheckboxProps } from "../Checkbox";

import * as styles from "./Radio.css";

export type RadioProps = CheckboxProps;

export function Radio({ className, ...props }: RadioProps) {
  return <Checkbox {...props} className={clsx(styles.radioShape, className)} />;
}

export type LabeledRadioProps = Omit<LabeledCheckboxProps, "controlClassName">;

export function LabeledRadio({ ...props }: LabeledRadioProps) {
  return <LabeledCheckbox {...props} controlClassName={styles.radioShape} />;
}
