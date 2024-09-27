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
      <Link href="./">
        <div className="p-5 bg-slate-800 text-gray-300 ring-blue-200-2">
          {name}
        </div>
      </Link>
    </div>
  );
}
