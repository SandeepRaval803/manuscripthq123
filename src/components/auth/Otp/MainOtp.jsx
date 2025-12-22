import Image from "next/image";
import Link from "next/link";
import OtpForm from "./OtpForm";

export default function MainOtp() {
  return (
    <div className="h-screen w-full overflow-hidden">
      <div className="grid h-full grid-cols-1 md:grid-cols-2">
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

        <div className="flex h-full flex-col items-center justify-center overflow-y-auto p-4 md:p-8">
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

              <div className="text-center mb-7 mt-5">
                <h1 className="text-3xl font-bold text-primary mb-1">
                  Enter verification code
                </h1>
                <p className="text-black">
                  We've sent a 4-digit code to your email address
                </p>
              </div>
              <div className="w-full">
                <OtpForm />
              </div>
              <div className="text-center text-sm mt-7">
                <p>
                  <span>Didn't receive the code? </span>
                  <button className="font-medium text-primary hover:underline">
                    Resend code
                  </button>
                </p>
                <p className="mt-2">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-primary hover:underline"
                  >
                    Back to forgot password
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <footer className="py-6 text-center text-sm text-muted-foreground">
            <p>© 2025 ManuscriptPRO. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
