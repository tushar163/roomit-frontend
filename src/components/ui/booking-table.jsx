import { Chip, Table } from "@heroui/react";

export function BookingTable({ bookings }) {
  return (
    <Table className="min-w-0 rounded-2xl">
      <Table.ScrollContainer className="overflow-x-auto">
        <Table.Content aria-label="Recent bookings" className="min-w-[720px]">
          <Table.Header>
            <Table.Column isRowHeader>Booking</Table.Column>
            <Table.Column>Room</Table.Column>
            <Table.Column>Host</Table.Column>
            <Table.Column>Time</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body items={bookings}>
            {(booking) => (
              <Table.Row id={booking.id}>
                <Table.Cell>
                  <div className="font-medium">{booking.title}</div>
                  <div className="text-xs text-zinc-500">{booking.id}</div>
                </Table.Cell>
                <Table.Cell>{booking.room}</Table.Cell>
                <Table.Cell>{booking.host}</Table.Cell>
                <Table.Cell>{booking.date}, {booking.time}</Table.Cell>
                <Table.Cell>
                  <Chip variant={booking.status?.startsWith("cancelled") ? "danger" : "success"}>{booking.status}</Chip>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
