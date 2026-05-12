import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio.')
    .email('Ingresa un email válido.'),
  password: z.string().min(1, 'La contraseña es obligatoria.'),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, 'El nombre de usuario es obligatorio.')
      .min(2, 'El nombre de usuario debe tener al menos 2 caracteres.')
      .refine((val) => !val.includes(' '), {
        message: 'El nombre de usuario no puede contener espacios.',
      }),
    email: z
      .string()
      .min(1, 'El email es obligatorio.')
      .email('Ingresa un email válido.'),
    password: z
      .string()
      .min(1, 'La contraseña es obligatoria.')
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .refine((val) => /[a-z]/.test(val), {
        message: 'La contraseña debe tener al menos una letra minúscula.',
      })
      .refine((val) => /[0-9]/.test(val), {
        message: 'La contraseña debe tener al menos un número.',
      })
      .refine((val) => /[^A-Za-z0-9]/.test(val), {
        message: 'La contraseña debe tener al menos un símbolo (ej. @, !, #).',
      }),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden.',
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
