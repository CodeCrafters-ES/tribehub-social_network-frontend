import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Confirma tu email | TribeHub',
  robots: 'noindex',
};

export default function ConfirmEmailPage() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-8">
      <div className="w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-7 shadow-sm text-center">
        <div className="mb-4 text-4xl">📬</div>
        <h1 className="mb-2 text-xl font-semibold text-slate-900">
          Revisa tu correo
        </h1>
        <p className="mb-6 text-sm text-slate-600">
          Te hemos enviado un enlace de confirmación. Ábrelo para activar tu
          cuenta y poder iniciar sesión.
        </p>
        <p className="text-xs text-slate-500">
          ¿Ya confirmaste?{' '}
          <Link href="/login" className="text-[#2c6e49] hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
