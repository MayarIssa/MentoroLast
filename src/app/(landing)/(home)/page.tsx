import { useTranslations } from "next-intl";
import { About } from "./_components/about";
import { Chatbot } from "./_components/chatbot";
import { Community } from "./_components/community";
import { CTA } from "./_components/cta";
import { Hero } from "./_components/hero";
import { PopularMentors } from "./_components/popular-mentors";
import { Reviews } from "./_components/reviews";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <>
      <Hero />
      <About />
      <PopularMentors />
      <CTA body={t("CTA.body")} link={t("CTA.action")} />
      <Community />
      <CTA body={t("CTA2.body")} link={t("CTA2.action")} />
      <Reviews />
      <Chatbot />
    </>
  );
}
