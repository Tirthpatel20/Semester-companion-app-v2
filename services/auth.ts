import { authClient } from "@/auth-client";

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface SignInData {
  email: string;
  password: string;
}

export async function signUp(data: SignUpData) {
  const result = await authClient.signUp.email({
    name: data.name,
    email: data.email,
    password: data.password,
  });
  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

export async function signIn(data: SignInData) {
  const result = await authClient.signIn.email(data);

  if (result.error) throw new Error(result.error.message);

  return result.data;
}

export async function signOut() {
  const result = await authClient.signOut();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

export async function signInWithGoogle() {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  });
}
