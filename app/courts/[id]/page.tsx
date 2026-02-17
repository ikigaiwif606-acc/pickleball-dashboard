import { notFound } from "next/navigation";
import courtsData from "@/data/courts.json";
import { Court } from "@/lib/types";
import CourtDetailClient from "./CourtDetailClient";

const courts: Court[] = courtsData;

export function generateStaticParams() {
  return courts.map((court) => ({ id: court.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const court = courts.find((c) => c.id === params.id);
  if (!court) return { title: "Court Not Found" };
  return {
    title: `${court.name} | Penang Pickleball Courts`,
    description: court.description,
  };
}

export default function CourtDetailPage({ params }: { params: { id: string } }) {
  const court = courts.find((c) => c.id === params.id);
  if (!court) notFound();
  return <CourtDetailClient court={court} />;
}
