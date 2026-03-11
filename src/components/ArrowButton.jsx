import { ArrowWithShadowIcon } from "./Icon";

export default function ArrowButton({ children, className }) {
  return (
    <button className="font-jetbrains bg-red before:bg-slate before:rounded-full before:size-full before:-translate-x-full hover:before:translate-x-0 before:transition-all before:duration-300 before:absolute before:top-0 before:left-0 overflow-hidden relative flex items-center justify-between gap-4 h-10 sm:h-13.25 pl-3.5 pr-1.5 rounded-full group">
      <span className="text-sm sm:text-base text-white relative z-10">{children}</span>
      
      <span className="relative z-10 bg-white size-8 sm:size-10.75 flex items-center justify-center rounded-full group-hover:rotate-30 transition-transform duration-300 shadow shadow-slate"><ArrowWithShadowIcon className="size-6 sm:size-7.5"/></span>
    </button>
  );
}
