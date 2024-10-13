import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/organisms/Navbar";
import SideBar from "@/components/organisms/SideBar";
import { UserProvider } from "@/context/users/UserContext";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Prueba Técnica Frontend",
	description:
		"ABM (CRUD) de usuarios utilizando React, NextJS, Typescript y PrimeReact",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es">
			<body
				className={`${geistSans.variable} ${geistMono.variable}`}
				suppressHydrationWarning={true}
			>
				<div className="flex flex-column h-screen">
					<Navbar />
					<div className="flex overflow-hidden h-screen">
						<SideBar />
						<main className="flex-grow-1">
							<UserProvider>{children}</UserProvider>
						</main>
					</div>
				</div>
			</body>
		</html>
	);
}

