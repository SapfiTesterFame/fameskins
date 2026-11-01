
import "./globals.css";

export const metadata = {
  title: "FAMESKINS — The Pro Scene Archive",
  description:
    "Discover iconic CS2 loadouts, professional players and moments from the esports stage.",
  applicationName: "FAMESKINS",
  metadataBase: new URL("https://fameskins.com"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
