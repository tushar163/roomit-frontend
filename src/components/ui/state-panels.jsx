import { Button, Card, Skeleton } from "@heroui/react";
import { AlertTriangle, CalendarPlus } from "lucide-react";

export function EmptyState({ title = "No bookings found", description = "Create a booking to see it here." }) {
  return (
    <Card className="glass-panel flex min-h-56 flex-col items-center justify-center rounded-2xl p-8 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-violet-500/15 text-violet-400">
        <CalendarPlus size={22} />
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      <Button className="mt-5" variant="primary">Book a room</Button>
    </Card>
  );
}

export function ErrorState() {
  return (
    <Card className="glass-panel flex min-h-56 flex-col items-center justify-center rounded-2xl p-8 text-center">
      <AlertTriangle className="text-amber-400" size={28} />
      <h3 className="mt-4 text-base font-semibold">Something went sideways</h3>
      <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">Refresh the page or try again after a moment.</p>
    </Card>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 rounded-2xl" />
      <div className="grid gap-4 md:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-36 rounded-2xl" />)}
      </div>
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  );
}
