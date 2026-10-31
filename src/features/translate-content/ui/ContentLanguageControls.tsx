import { ModeControls } from "@/shared/ui";

import type { ContentLanguage } from "../model/translation-preferences";

export function ContentLanguageControls({
  language,
  onChange,
}: {
  language: ContentLanguage;
  onChange: (language: ContentLanguage) => void;
}) {
  return (
    <ModeControls
      value={language}
      onChange={onChange}
      options={[
        { value: "en", label: "[En]" },
        { value: "ru", label: "[Ru]" },
      ]}
    />
  );
}
