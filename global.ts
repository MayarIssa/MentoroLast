import messages from "./messages/en.json";

type Locales = ["en", "ar"];

declare module "next-intl" {
  interface AppConfig {
    Locale: Locales[number];
    Messages: typeof messages;
  }
}
