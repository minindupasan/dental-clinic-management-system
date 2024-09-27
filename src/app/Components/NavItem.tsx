import React from "react";
import Link from "next/link";

export default function NavItem({
  name,
  path,
}: {
  name: string;
  path: string;
}) {
  return (
    <div>
      <Link href={path}>
        <div className="hover:ring-blue-200-2 text-2xl">{name}</div>
      </Link>
    </div>
  );
}
