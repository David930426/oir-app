import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function BulletinNotFound() {
  return (
    <div>
      <Card className="border shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <FileQuestion className="h-7 w-7 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Bulletin not found
            </h1>
            <p className="text-sm text-muted-foreground">
              This bulletin doesn&apos;t exist or may have been deleted.
            </p>
          </div>
          <Button
            render={<Link href="/dashboard/bulletin" />}
            nativeButton={false}
            className="gap-2 bg-[#2B4156] hover:bg-[#1f3142] hover:cursor-pointer"
          >
            Back to bulletins
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
