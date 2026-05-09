export function WordProgressCircle({
  used,
  max,
}: {
  used: number;
  max: number;
}) {
  const percent = Math.min((used / max) * 100, 100);
  const radius = 8;
  const stroke = 3;

  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percent / 100) * circumference;

  const isOver = used > max;

  return (
    <div className="flex items-center gap-2 text-xs">
      {/* Circle */}
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e2e8f0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={isOver ? "#ef4444" : "#c47a5a"}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.3s ease",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      {/* Text */}
      <span
        className={
          isOver
            ? "text-red-500 font-semibold"
            : "text-muted-foreground"
        }
      >
        {used} / {max} words
      </span>
    </div>
  );
}