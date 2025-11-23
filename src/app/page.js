"use client";

import dynamic from "next/dynamic";

const Legacy = dynamic(() => import("@/legacy/LegacyApp"), { ssr: false });

export default function Home() {
  return <Legacy />;
}
