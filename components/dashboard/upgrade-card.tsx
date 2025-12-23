import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export function UpgradeCard() {
  const whatsappUrl = "https://wa.me/1234567890"; // Ganti dengan nomor WhatsApp kamu

  return (
    <Card className="border-green-200 md:max-xl:rounded-none md:max-xl:border-none md:max-xl:shadow-none">
      <CardHeader className="md:max-xl:px-4">
        <CardTitle className="text-green-700">Need Help?</CardTitle>
        <CardDescription>
          Contact us via WhatsApp for support and inquiries.
        </CardDescription>
      </CardHeader>
      <CardContent className="md:max-xl:px-4">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
            <MessageCircle className="mr-2 size-4" />
            Contact via WhatsApp
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}
