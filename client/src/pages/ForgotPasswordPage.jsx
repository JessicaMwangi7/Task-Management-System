import { PasswordResetForm } from "@/components/auth/PasswordResetForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">TaskFlow</h1>
          <p className="text-muted-foreground mt-2">Reset your password</p>
        </div>

        <PasswordResetForm />
      </div>
    </div>
  );
}
