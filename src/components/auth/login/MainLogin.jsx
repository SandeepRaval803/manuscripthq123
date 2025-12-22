import Link from "next/link";
import { LoginForm } from "./LoginForm";
import Image from "next/image";

export default function MainLogin() {
  return (
    <div className="h-screen w-full overflow-hidden">
      <div className="grid h-full grid-cols-1 md:grid-cols-2">
        {/* Left side image */}
        <div className="hidden h-full sm:block">
          <Link href="/">
            <div className="relative h-full w-full">
              <Image
                src="/images/home/auth.webp"
                alt="Logo"
                className="object-cover"
                fill
                priority
              />
            </div>
          </Link>
        </div>

        {/* Right side form */}
        <div className="flex h-full flex-col items-center justify-between overflow-y-auto p-4 md:p-8">
          <div className="w-full max-w-xl">
            <div className="flex flex-col items-center">
              <Link href="/">
                <Image
                  src="/images/home/logo.png"
                  alt="Logo"
                  width={130}
                  height={100}
                />
              </Link>
              <div className="mb-5 mt-4 text-center">
                <h1 className="mb-1 text-2xl font-bold text-primary md:text-3xl">
                  Welcome to ManuscriptHQ
                </h1>
                <p className="text-sm text-black md:text-base">
                  Enter your credentials to access your account
                </p>
              </div>
              <div className="w-full">
                <LoginForm />
              </div>
              <div className="mt-5 text-center text-sm">
                <p>
                  Don't have an account?{" "}
                  <Link href="/register" className="font-medium text-primary">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <footer className="pt-4 text-center text-sm text-muted-foreground">
            <p>© 2025 ManuscriptPRO. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
