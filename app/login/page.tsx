import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main data-lk-theme="default" style={{ height: '100%' }}>
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm mode="login" />
    </div>
    </main>
  );
}
