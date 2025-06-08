import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutGrid, Stethoscope, Pill, ClipboardList, ShieldCheck, Settings, FileText, School, BookOpen } from "lucide-react";

const features = [
  { label: "Tổng quan", icon: LayoutGrid },
  { label: "Sức khỏe học sinh", icon: Stethoscope },
  { label: "Bảo hiểm y tế", icon: ShieldCheck },
  { label: "Quản lý thuốc", icon: Pill },
  { label: "Quản lý trang thiết bị", icon: ClipboardList },
  { label: "VS an toàn thực phẩm", icon: School },
  { label: "Vệ sinh học đường", icon: BookOpen },
  { label: "Báo cáo", icon: FileText },
  { label: "Cấu hình thông tin", icon: Settings },
  { label: "Bài viết Blog", icon: BookOpen },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          Phần mềm Quản lý Y tế Học đường
        </h1>

        <input
          type="text"
          placeholder="🔍 Tìm kiếm..."
          className="w-full p-3 mb-8 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {features.map(({ label, icon: Icon }) => (
            <Card key={label} className="hover:shadow-xl transition duration-200 hover:-translate-y-1 cursor-pointer">
              <CardContent className="flex flex-col items-center p-6 space-y-4">
                <Icon className="w-10 h-10 text-green-600" />
                <span className="text-center font-medium text-gray-700">{label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
