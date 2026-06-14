import { RoomDetailView } from "@/features/rooms/room-detail-view";

export default async function RoomPage({ params }) {
  const { id } = await params;
  return <RoomDetailView id={id} />;
}