import Image from "next/image";
import formBg from "@/assets/form-bg.png";

const BackgroundLayers = () => {
  return (
    <>
      <div className="bg-primary absolute inset-0 -z-20 rotate-180 overflow-hidden lg:rotate-0">
        <Image
          src={formBg}
          alt="Form Container Background"
          className="size-full object-cover"
          priority={true}
        />
      </div>
      <div className="bg-brand-150 absolute inset-0 -z-20" />
    </>
  );
};

export default BackgroundLayers;
