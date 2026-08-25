import Image from "next/image";

// public/images/customer-agent.png is a flat navy/red call-agent icon on a
// transparent background, square. It's small and mostly navy linework, which
// disappears against the dark slate header — hence the light backdrop below.
export default function BotAvatar({ size = 24, online = false, className = "" }) {
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full overflow-hidden bg-skylight">
        <Image
          src="/images/customer-agent.png"
          alt=""
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      </div>
      {online && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 right-0 rounded-full bg-[#22c55e] border-2 border-slate"
          style={{ width: size * 0.3, height: size * 0.3 }}
        />
      )}
    </div>
  );
}
