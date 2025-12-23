import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata = constructMetadata({
  title: "Dashboard – SaaS Starter",
  description: "Account information and parental control services.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        text="Informasi akun dan layanan parental control."
      />
      
      <div className="grid gap-6 pb-10">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
            <CardDescription>Detail akun Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nama</p>
                <p className="font-medium">{user.name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                  {user.role}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status Email</p>
                <Badge variant={user.emailVerified ? "default" : "outline"}>
                  {user.emailVerified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parental Control Service - mSpy */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Shield className="mt-1 size-5 text-blue-600 dark:text-blue-400" />
              <div>
                <CardTitle>Layanan Parental Control - mSpy</CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  Platform pengawasan orang tua dengan teknologi terdepan
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Ketentuan */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-100">
                <CheckCircle2 className="size-4" />
                Ketentuan Penggunaan
              </h3>
              <ul className="space-y-2 pl-6 text-sm">
                <li className="list-disc text-muted-foreground">
                  Hanya untuk pengawasan anak di bawah umur atau anggota keluarga dengan persetujuan
                </li>
                <li className="list-disc text-muted-foreground">
                  Penggunaan harus sesuai dengan hukum dan peraturan yang berlaku di negara Anda
                </li>
                <li className="list-disc text-muted-foreground">
                  Pengguna bertanggung jawab penuh atas penggunaan layanan ini
                </li>
                <li className="list-disc text-muted-foreground">
                  Akses tanpa izin kepada perangkat orang lain adalah ilegal
                </li>
                <li className="list-disc text-muted-foreground">
                  Transparansi sangat penting - komunikasikan dengan keluarga tentang pengawasan ini
                </li>
                <li className="list-disc text-muted-foreground">
                  Data pribadi harus dijaga kerahasiaannya sesuai kebijakan privasi mSpy
                </li>
              </ul>
            </div>

            {/* Tujuan */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-100">
                <AlertCircle className="size-4" />
                Tujuan & Manfaat
              </h3>
              <ul className="space-y-2 pl-6 text-sm">
                <li className="list-disc text-muted-foreground">
                  <span className="font-medium">Keamanan Online:</span> Lindungi anak dari konten berbahaya, predator, dan cyberbullying
                </li>
                <li className="list-disc text-muted-foreground">
                  <span className="font-medium">Manajemen Waktu Layar:</span> Monitor dan kontrol penggunaan perangkat untuk kesehatan digital
                </li>
                <li className="list-disc text-muted-foreground">
                  <span className="font-medium">Lokasi Keamanan:</span> Pantau lokasi keluarga untuk memastikan keselamatan
                </li>
                <li className="list-disc text-muted-foreground">
                  <span className="font-medium">Aktivitas Digital:</span> Pantau aplikasi, pesan, dan riwayat browsing
                </li>
                <li className="list-disc text-muted-foreground">
                  <span className="font-medium">Komunikasi Terbuka:</span> Membangun kepercayaan melalui transparansi
                </li>
                <li className="list-disc text-muted-foreground">
                  <span className="font-medium">Perlindungan Data:</span> Menjaga informasi sensitif dari ancaman cyber
                </li>
              </ul>
            </div>

            {/* Info Tambahan */}
            <div className="rounded-lg border border-blue-300 bg-white p-3 dark:border-blue-700 dark:bg-blue-950">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Catatan:</span> Layanan mSpy mematuhi standar keamanan internasional dan regulasi perlindungan data. Semua informasi yang dikumpulkan dienkripsi dan dilindungi dengan standar industri tertinggi.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
