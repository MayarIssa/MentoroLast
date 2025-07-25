import type { LucideProps } from "lucide-react";

interface IconProps extends LucideProps {
  className?: string;
}

const Icons = {
  User: ({ className }: IconProps) => (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6.66667 30.0002C6.66667 28.2321 7.36905 26.5364 8.61929 25.2861C9.86954 24.0359 11.5652 23.3335 13.3333 23.3335H26.6667C28.4348 23.3335 30.1305 24.0359 31.3807 25.2861C32.631 26.5364 33.3333 28.2321 33.3333 30.0002C33.3333 30.8842 32.9821 31.7321 32.357 32.3572C31.7319 32.9823 30.8841 33.3335 30 33.3335H10C9.11595 33.3335 8.2681 32.9823 7.64298 32.3572C7.01786 31.7321 6.66667 30.8842 6.66667 30.0002Z"
        stroke="#171717"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M20 16.6667C22.7614 16.6667 25 14.4282 25 11.6667C25 8.90532 22.7614 6.66675 20 6.66675C17.2386 6.66675 15 8.90532 15 11.6667C15 14.4282 17.2386 16.6667 20 16.6667Z"
        stroke="#171717"
        strokeWidth="2"
      />
    </svg>
  ),
  Courses: ({ className }: IconProps) => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.33714 1C5.27793 1.1935 3.89143 1.6285 2.85551 2.614C1 4.3795 1 7.222 1 12.9085V18.9385C1 24.6235 1 27.4675 2.85551 29.2345C4.71101 31.0015 7.69877 31 13.6727 31H16.8421C22.816 31 25.8038 31 27.6593 29.2345C29.3442 27.6295 29.5006 25.159 29.5148 20.4655"
        stroke="#171717"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.6728 8.5L15.2567 13.75C16.1411 15.415 17.2512 15.85 20.01 16C22.2034 15.949 23.4762 15.703 24.5627 14.806C25.3033 14.194 25.6381 13.2715 25.8007 12.3535L26.344 9.25M30.3045 6.25V13.75M10.633 5.3995C13.1391 3.424 15.372 2.3635 20.0037 1.1965C20.5262 1.06547 21.0759 1.06805 21.597 1.204C25.6965 2.275 27.9105 3.226 30.8761 5.341C31.0025 5.431 31.0404 5.599 30.9519 5.7235C29.9839 7.0765 27.8221 8.173 22.5193 10.126C21.4148 10.5297 20.1907 10.5233 19.0909 10.108C13.4439 7.978 10.8477 6.838 10.5319 5.6545C10.5216 5.60727 10.5257 5.55824 10.5436 5.51311C10.5615 5.46797 10.5925 5.42858 10.633 5.3995Z"
        stroke="#171717"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Chat: ({ className }: IconProps) => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1 31V2.81818C1 1.81818 1.75 1 2.66667 1H29.3333C30.25 1 31 1.81818 31 2.81818V24.6364C31 25.6364 30.25 26.4545 29.3333 26.4545H5.16667L1 31Z"
        stroke="#171717"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33398 8.27271H22.6673"
        stroke="#171717"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33398 13.7273H22.6673"
        stroke="#171717"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33398 19.1819H16.0007"
        stroke="#171717"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Schedule: ({ className }: IconProps) => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.5 28H7C5.4087 28 3.88258 27.3679 2.75736 26.2426C1.63214 25.1174 1 23.5913 1 22V8.5C1 6.9087 1.63214 5.38258 2.75736 4.25736C3.88258 3.13214 5.4087 2.5 7 2.5H23.5C25.0913 2.5 26.6174 3.13214 27.7426 4.25736C28.8679 5.38258 29.5 6.9087 29.5 8.5V13M10 1V4M20.5 1V4M1 10H29.5M25.75 21.4645L23.5 23.7145"
        stroke="#171717"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.5 31C27.6421 31 31 27.6421 31 23.5C31 19.3579 27.6421 16 23.5 16C19.3579 16 16 19.3579 16 23.5C16 27.6421 19.3579 31 23.5 31Z"
        stroke="#171717"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export default Icons;
