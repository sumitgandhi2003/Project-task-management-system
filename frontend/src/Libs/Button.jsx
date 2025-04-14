const Button = ({
  btntext = "",
  className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
  disabled = false,
  onClick = () => "",
  loading = false,
  // loaderColor = "",
  icon = null,
  iconPosition = "left",
}) => {
  // const { theme } = useTheme();
  return (
    <button
      className={`${className}  ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } transition-all duration-300 flex items-center justify-center gap-2`}
      disabled={disabled}
      onClick={onClick}
    >
      {loading ? (
        <div className="loader inline-block w-4 h-4 border-2 border-t-2 border-t-white border-blue-400 rounded-full animate-spin"></div>
      ) : (
        <span
          className={`flex items-center ransition-all duration-300 justify-center gap-2 ${
            iconPosition === "right" ? "flex-row-reverse" : ""
          }`}
        >
          {icon && <span>{icon}</span>}
          {btntext?.toString()}
        </span>
      )}
    </button>
  );
};

export default Button;
