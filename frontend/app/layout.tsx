import { Metadata } from "next";
import "./globals.css";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
    title: "Azure Cloud Native E-Commerce",
    description: "Production grade ecommerce platform on Azure",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <div className="min-h-screen flex flex-col bg-gray-50 ">
                        <Navbar />
                        <main className="flex-grow container mx-auto px-4 py-8">
                            {children}
                        </main>
                        <footer className="bg-white  border-t py-6 text-center text-gray-500">
                            © {new Date().getFullYear()} Azure E-Commerce Demo. All rights reserved.
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
