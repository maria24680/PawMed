import AuthBanner from "@/components/auth/AuthBanner";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <section className="min-h-screen bg-linear-to-br from-[#ADD8E6]/20 via-white to-sky-100 flex items-center justify-center p-5">
      <div className="max-w-7xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden grid lg:grid-cols-2">

        <AuthBanner />

        <div className="flex items-center justify-center p-10">
          <LoginForm />
        </div>

      </div>
    </section>
  );
}