import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  FileText, 
  Wallet, 
  Megaphone, 
  Calendar, 
  BarChart3, 
  Shield, 
  UserCog,
  ArrowRight,
  CheckCircle
} from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Manajemen Warga",
    description: "Kelola data warga RT/RW dengan mudah dan terorganisir",
    color: "text-blue-600"
  },
  {
    icon: FileText,
    title: "Administrasi Surat",
    description: "Buat dan kelola surat pengantar secara digital",
    color: "text-green-600"
  },
  {
    icon: Wallet,
    title: "Keuangan",
    description: "Catat dan monitor pemasukan serta pengeluaran kas RT/RW",
    color: "text-purple-600"
  },
  {
    icon: Megaphone,
    title: "Pengumuman",
    description: "Publikasikan pengumuman penting untuk seluruh warga",
    color: "text-orange-600"
  },
  {
    icon: Calendar,
    title: "Kegiatan",
    description: "Jadwalkan dan kelola kegiatan RT/RW dengan efektif",
    color: "text-teal-600"
  },
  {
    icon: BarChart3,
    title: "Laporan",
    description: "Buat laporan komprehensif untuk berbagai keperluan",
    color: "text-indigo-600"
  },
  {
    icon: Shield,
    title: "Keamanan",
    description: "Monitor dan kelola laporan keamanan lingkungan",
    color: "text-red-600"
  },
  {
    icon: UserCog,
    title: "Manajemen User",
    description: "Kelola akses dan hak pengguna sistem",
    color: "text-gray-600"
  }
]

const benefits = [
  "Digitalisasi administrasi RT/RW",
  "Transparansi keuangan yang lebih baik",
  "Komunikasi warga yang efektif",
  "Pelaporan yang terorganisir",
  "Akses data real-time"
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              Sistem Informasi RT/RW
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Kelola RT/RW Anda dengan
              <span className="text-primary block">Lebih Efisien</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Platform digital terpadu untuk mengelola administrasi, keuangan, dan kegiatan RT/RW 
              dengan mudah dan transparan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6">
                  Masuk ke Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fitur Lengkap untuk RT/RW Modern
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola RT/RW dalam satu platform terintegrasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-muted/50 w-fit group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Mengapa Memilih Platform Kami?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Dirancang khusus untuk kebutuhan administrasi RT/RW modern dengan 
                antarmuka yang mudah digunakan dan fitur yang komprehensif.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <BarChart3 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Dashboard Terintegrasi
                    </h3>
                    <p className="text-muted-foreground">
                      Pantau semua aktivitas RT/RW dalam satu tampilan yang mudah dipahami
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-background/50">
                      <div className="text-2xl font-bold text-primary">100+</div>
                      <div className="text-sm text-muted-foreground">Warga Terdaftar</div>
                    </div>
                    <div className="p-4 rounded-lg bg-background/50">
                      <div className="text-2xl font-bold text-primary">50+</div>
                      <div className="text-sm text-muted-foreground">Surat Diproses</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Siap Memulai?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan RT/RW lain yang telah merasakan kemudahan mengelola 
            administrasi dengan platform digital kami.
          </p>
          
          <Link href="/login">
            <Button size="lg" className="text-lg px-8 py-6">
              Akses Dashboard Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2025 Sistem Informasi RT/RW. Created by LailDev.
          </p>
        </div>
      </footer>
    </div>
  )
}
