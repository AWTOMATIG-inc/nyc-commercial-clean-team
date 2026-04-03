import Link from "next/link";

export default function HeroBanner({title,desc,pageName}) {
  return (
     <section className="mt-10 relative w-[calc(100%-32px)] mx-auto h-80 md:h-100 lg:h-112.5 overflow-hidden rounded-lg">
      {/* Background placeholder image with overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-slate/95 via-dark-slate/90 to-slate/85">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-dark-slate/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center justify-center h-full text-white px-8">
        <h1 className="heading-3 mb-4">{title}</h1>
        <p className="text-red-500 md:text-xl font-jetbrains ">{desc}</p>
        {!desc&&<nav className="flex items-center gap-2 text-sm md:text-base">
          <Link
            href="/"
            className="text-red hover:underline font-medium transition-colors"
          >
            Home
          </Link>
          <span className="text-white/70">►</span>
          <span className="text-white/90">{pageName}</span>
        </nav>}
      </div>
    </section>
  )
}
