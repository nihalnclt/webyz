import { AppContext } from "../context.js";
import {
  badRequest,
  conflict,
  notFound,
  unauthorized,
} from "../errors/http-errors.js";
import { hashPassword, verifyPassword } from "./password.js";
import {
  ChangePasswordInput,
  GoogleUserInfo,
  LoginUserInput,
  RegisterUserInput,
} from "./types.js";

export const registerUser = async (
  { prisma }: AppContext,
  input: RegisterUserInput,
) => {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    throw conflict("Email already exists");
  }

  const passwordHash = await hashPassword(input.password);

  return prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      password: passwordHash,
      provider: "email",
    },
    select: { id: true, email: true, name: true },
  });
};

export const loginUser = async (
  { prisma }: AppContext,
  input: LoginUserInput,
) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  const hashToCheck =
    user?.password ?? "$2b$12$preventtimingenumeration000000000000";
  const valid = await verifyPassword(input.password, hashToCheck);

  if (!user || !valid) {
    throw unauthorized("Invalid email or password");
  }

  if (!user?.password) {
    throw badRequest(
      "This account uses Google sign-in. Please continue with Google.",
    );
  }

  return { id: user.id, email: user.email, name: user.name };
};

export const upsertGoogleUser = async (
  { prisma }: AppContext,
  googleUser: GoogleUserInfo,
) => {
  if (!googleUser?.verified_email) {
    throw badRequest("Google account email is not verified");
  }

  const byGoogleId = await prisma.user.findUnique({
    where: { googleId: googleUser?.id },
    select: { id: true, email: true, name: true },
  });
  if (byGoogleId) return byGoogleId;

  const byEmail = await prisma.user.findUnique({
    where: { email: googleUser?.email },
  });
  if (byEmail) {
    return prisma.user.update({
      where: { id: byEmail.id },
      data: {
        googleId: googleUser.id,
        avatarUrl: googleUser.picture,
        provider: byEmail.provider === "email" ? "email_google" : "google",
      },
      select: { id: true, email: true, name: true },
    });
  }

  return prisma.user.create({
    data: {
      email: googleUser.email,
      name: googleUser.name,
      googleId: googleUser.id,
      avatarUrl: googleUser.picture,
      provider: "google",
    },
    select: { id: true, email: true, name: true },
  });
};

export async function getUserById({ prisma }: AppContext, userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      provider: true,
      createdAt: true,
    },
  });

  if (!user) throw notFound("User not found");

  return user;
}

export async function changePassword(
  { prisma }: AppContext,
  userId: string,
  input: ChangePasswordInput,
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user?.password) {
    throw badRequest("Cannot change password for Google-only accounts");
  }

  const valid = await verifyPassword(input.currentPassword, user.password);
  if (!valid) {
    throw unauthorized("Current password is incorrect");
  }

  const newHash = await hashPassword(input.newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: newHash },
  });
}
