type Props = React.HTMLAttributes<HTMLDivElement>;

export default function Skeleton({ className = '', ...props }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-gray-200/dark:bg-gray-800`}
      {...props}
    />
  );
}
