import Link from "next/link";

function LinkGroup({ title, links }) {
  if (!links.length) return null;
  return (
    <div>
      <h3 className="text-xl font-bold text-slate">{title}</h3>
      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-light-blue hover:underline hover:text-blue-500"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RelatedPages({ sameService, sameLocation, location }) {
  if (!sameService.length && !sameLocation.length) return null;
  return (
    <section className="container my-10 md:my-14 lg:my-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <LinkGroup title="Also serving" links={sameService} />
        <LinkGroup title={`More services in ${location}`} links={sameLocation} />
      </div>
    </section>
  );
}
