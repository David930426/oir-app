import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function PublicBulletinNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 flex flex-col items-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">Bulletin not found</h1>
        <p className="text-sm text-muted-foreground">
          This bulletin doesn&apos;t exist or is no longer published.
        </p>
      </div>
      <Button
        render={<Link href="/main/bulletin" />}
        nativeButton={false}
        className="rounded-full hover:cursor-pointer"
      >
        Back to bulletin
      </Button>
    </div>
  );
}
