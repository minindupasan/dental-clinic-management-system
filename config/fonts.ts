import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontSerif = Poppins({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
});
