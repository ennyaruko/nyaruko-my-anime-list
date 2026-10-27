import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ArrowDownIcon } from "@/shared/icons";

import { Button } from "../Button";

import * as styles from "./ScrollToTopButton.css";

const VISIBILITY_THRESHOLD = 120;

export function ScrollToTopButton() {
  const { t } = useTranslation(["common"]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let previousScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const nextVisible =
        currentScrollY > VISIBILITY_THRESHOLD &&
        currentScrollY > previousScrollY;

      setVisible(nextVisible);
      previousScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Button
      round
      size="l"
      data-visible={visible}
      className={styles.button}
      tabIndex={visible ? 0 : -1}
      title={t("common:actions.scrollToTop")}
      leftIcon={<ArrowDownIcon className={styles.icon} />}
      onClick={(event) => {
        event.currentTarget.blur();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    />
  );
}
