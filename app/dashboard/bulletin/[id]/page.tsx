import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { OIR_AUTH } from "@/constant";
import { verifyAuthToken } from "@/lib/jwt";
import { getBulletinAdmin } from "@/lib/actions/bulletin.action";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BulletinBody } from "@/components/bulletin-body";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Pencil,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

const RECENT_WINDOW_MS = 48 * 60 * 60 * 1000;

const dateFormat: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export default async function BulletinDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(OIR_AUTH)?.value;
  if (!token) redirect("/login");

  const payload = await verifyAuthToken(token);
  if (!payload || payload.role !== "admin") redirect("/main");

  const { id } = await params;
  const bulletin = await getBulletinAdmin(id);
  if (!bulletin) notFound();

  const createdAt = new Date(bulletin.createdAt);
  const updatedAt = new Date(bulletin.updatedAt);
  const isRecent = Date.now() - createdAt.getTime() < RECENT_WINDOW_MS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            render={
              <Link href="/dashboard/bulletin" aria-label="Back to bulletins" />
            }
            nativeButton={false}
            className="hover:cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Bulletin preview
            </h1>
            <p className="text-sm text-muted-foreground">
              How this announcement reads for students.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:pl-2">
          <Button
            variant="outline"
            render={
              <Link
                href={
                  bulletin.published
                    ? `/main/bulletin/${bulletin._id}`
                    : "/main/bulletin"
                }
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            nativeButton={false}
            className="gap-2 hover:cursor-pointer"
          >
            <ExternalLink className="h-4 w-4" />
            View live
          </Button>
          <Button
            render={<Link href={`/dashboard/bulletin/${bulletin._id}/edit`} />}
            nativeButton={false}
            className="gap-2 bg-[#2B4156] hover:bg-[#1f3142] hover:cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Article card */}
      <Card className="overflow-hidden border shadow-sm">
        {/* Cover image: intentionally omitted for now (upload not built yet). */}
        <CardContent className="p-6 sm:p-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {isRecent && (
              <Badge variant="destructive" className="gap-1">
                <Sparkles className="h-3 w-3" />
                New
              </Badge>
            )}
            <Badge variant="default">{bulletin.category}</Badge>
            {bulletin.published ? (
              <Badge className="gap-1 border-transparent bg-emerald-100 text-emerald-700">
                <Check className="h-3 w-3" />
                Published
              </Badge>
            ) : (
              <Badge variant="secondary">Draft</Badge>
            )}
          </div>

          {/* Headline */}
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-900">
            {bulletin.title}
          </h2>

          {/* Meta bar */}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              Office of International Relations
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {createdAt.toLocaleDateString(undefined, dateFormat)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Updated {updatedAt.toLocaleString()}
            </span>
          </div>

          <Separator className="my-6" />

          {/* Body */}
          <BulletinBody text={bulletin.description} className="max-w-prose" />

          {/* Attachments: bulletin schema has no attachments field yet — block omitted. */}
        </CardContent>
      </Card>

      {!bulletin.published && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          This bulletin is a draft — it isn&apos;t visible on the public
          bulletin page yet.
        </p>
      )}
    </div>
  );
}
