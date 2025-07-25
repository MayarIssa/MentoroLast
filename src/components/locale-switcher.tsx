import { useLocale } from "next-intl";
import { LocaleSwitcherSelect } from "./locale-switcher-select";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      className={className ?? ""}
      defaultValue={locale}
      items={[
        {
          value: "en",
          label: "English",
        },
        {
          value: "ar",
          label: "العربية",
        },
      ]}
    />
  );
}
