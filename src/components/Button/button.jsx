// Button.jsx
export default function Button({
  onClick,
  text,
  background = "bg-primary",
  leftIcon,
  rightIcon,
  textcolor = "text-white",
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      className={`
        ${background} ${textcolor}
        w-[144px] h-[48px] rounded-full
        px-6 py-[13.2px]
        gap-1.5
        flex items-center justify-center
        transition-opacity hover:opacity-90
        focus:outline-none focus:ring-2 focus:ring-primary/50
        ${className}
      `}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span className="truncate">{text}</span>
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
}
