import {
  ImageItem,
  PhoneCarousel,
} from "@/components/ui/phone-mockups-1-utils/phone-carousel";

const screens: ImageItem[] = [
  { alt: "Operations dashboard", label: "Dashboard", kind: "dashboard" },
  { alt: "Booking platform", label: "Bookings", kind: "booking" },
  { alt: "E-commerce checkout", label: "Storefront", kind: "commerce" },
  { alt: "AI business assistant", label: "AI Assistant", kind: "assistant" },
];

export default function PhoneMockupBasic() {
  return <PhoneCarousel images={screens} />;
}
