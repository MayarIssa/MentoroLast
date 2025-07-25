"use client";

import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { CircleCheckBig, Crown } from "lucide-react";
import { useTranslations } from "next-intl";

interface ArrowProps {
  left?: boolean;
  onClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  disabled?: boolean;
}

const Arrow: React.FC<ArrowProps> = ({ left, onClick, disabled }) => {
  const disabledClass = disabled ? " arrow--disabled" : "";
  return (
    <svg
      onClick={onClick}
      className={`arrow ${left ? "arrow--left" : "arrow--right"} ${disabledClass}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!left && <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />}
    </svg>
  );
};

const Plans: React.FC = () => {
  const t = useTranslations("PlansComponent");
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  return (
    <>
      <div className="navigation-wrapper">
        <div ref={sliderRef} className="keen-slider">
          <div className="keen-slider__slide flex min-h-[8rem] flex-col items-center justify-center gap-4 px-8">
            <div className="flex items-center gap-2 text-xl font-bold text-nowrap">
              <Crown />
              {t("price_20")} <span className="text-xs">{t("per_month")}</span>
            </div>
            <div className="space-y-2 text-center">
              <h4 className="text-lg font-bold">{t("starter_plan")}</h4>
              <p className="text-xs">{t("starter_description")}</p>
              <ul className="flex flex-col gap-2">
                <li className="flex items-center gap-2">
                  <CircleCheckBig className="text-brand-150 size-4" />
                  <span>{t("free_chat")}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="keen-slider__slide flex h-[16rem] flex-col items-center gap-4 px-8">
            <div className="flex items-center gap-2 text-xl font-bold text-nowrap">
              <Crown />
              {t("price_200")} <span className="text-xs">{t("per_month")}</span>
            </div>
            <div className="space-y-2 text-center">
              <h4 className="text-lg font-bold">{t("professional_plan")}</h4>
              <p className="text-xs">{t("professional_description")}</p>
              <ul className="flex flex-col gap-2">
                <li className="flex items-center gap-2">
                  <CircleCheckBig className="text-brand-150 size-4" />
                  <span>{t("free_chat")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheckBig className="text-brand-150 size-4" />
                  <span>{t("free_session")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheckBig className="text-brand-150 size-4" />
                  <span>{t("roadmap")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheckBig className="text-brand-150 size-4" />
                  <span>{t("test")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {loaded && instanceRef.current && (
          <>
            <Arrow
              left
              onClick={(e) => {
                e.stopPropagation();
                instanceRef.current?.prev();
              }}
              disabled={currentSlide === 0}
            />
            <Arrow
              onClick={(e) => {
                e.stopPropagation();
                instanceRef.current?.next();
              }}
              disabled={
                currentSlide ===
                instanceRef.current.track.details.slides.length - 1
              }
            />
          </>
        )}
      </div>
      {loaded && instanceRef.current && (
        <div className="dots">
          {[
            ...Array(instanceRef.current.track.details.slides.length).keys(),
          ].map((idx) => (
            <button
              key={idx}
              onClick={() => {
                instanceRef.current?.moveToIdx(idx);
              }}
              className={`dot${currentSlide === idx ? "active" : ""}`}
            ></button>
          ))}
        </div>
      )}
    </>
  );
};

export default Plans;
