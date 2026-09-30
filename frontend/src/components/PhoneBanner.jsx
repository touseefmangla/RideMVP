import { Phone } from "lucide-react";

export default function PhoneBanner({ show, onClick }) {
  if (!show) return null;
  return (
    <button
      onClick={onClick}
      className="flex w-full shrink-0 items-center justify-center gap-2 border-b border-primary/25 bg-primary/10 px-4 py-2.5 text-sm"
    >
      <Phone className="h-4 w-4 text-primary" />
      <span>Add your phone number to request a ride</span>
      <span className="font-medium text-primary underline underline-offset-2">
        Add
      </span>
    </button>
  );
}
