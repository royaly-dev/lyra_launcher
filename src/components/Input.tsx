export default function Input({
  OnChnage,
  placeholder,
  type,
  value,
  className,
}: {
  placeholder: string;
  type: string;
  value: string;
  OnChnage: (text: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <input
      className={
        "text-(--modringht-text-default) bg-(--modringht-bg-super-raised) border border-solid border-(--modringht-border-strong) rounded-md outline-none px-4 py-1 text-2xl w-full " +
        className
      }
      placeholder={placeholder}
      value={value}
      type={type}
      onChange={OnChnage}
    />
  );
}
