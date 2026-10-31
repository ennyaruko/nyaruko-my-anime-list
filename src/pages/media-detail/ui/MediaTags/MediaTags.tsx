import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import type { MediaTag } from "@/entities/media";

import { Table, Heading, TableSkeleton } from "@/shared/ui";

import * as styles from "./MediaTags.css";
import * as pageStyles from "../MediaDetailPage.css";

export function MediaTags({ tags }: { tags: undefined | MediaTag[] }) {
  const { t } = useTranslation(["common"]);
  const navigate = useNavigate();

  return (
    <section className={pageStyles.section}>
      <Heading size="m" variant="neutral">
        {t("common:mediaDetail.tags")}
      </Heading>
      {tags ? (
        <div className={styles.table}>
          <Table
            numericList
            valueMode="percentage"
            initialVisibleCount={10}
            items={tags.map(({ name, rank }) => ({ label: name, value: rank }))}
            onItemClick={({ label }) => {
              const searchParams = new URLSearchParams({ tag: label });
              navigate(`/search?${searchParams.toString()}`);
            }}
          />
        </div>
      ) : (
        <div className={styles.table}>
          <TableSkeleton
            valueMode="percentage"
            values={[100, 92, 86, 80, 74, 68, 62, 56, 50, 44]}
          />
        </div>
      )}
    </section>
  );
}
