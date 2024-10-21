"use server";

import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function credentialsSignIn(
  email: string,
  password: string,
  redirectPath?: string | null,
) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
    });

    if (result) {
      return {
        success: true,
        message: "Login successful",
      };
    }
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid email or password",
          };
        default:
          return {
            success: false,
            message: "Something went wrong",
          };
      }
    }

    // Handle any other types of errors
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  } finally {
    redirect(redirectPath ? `/${redirectPath}` : "/dashboard");
  }
}

export async function credentialsSignOut() {
  await signOut();
}

export async function credentialsSignUp(email: string, password: string) {
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser)
      return {
        success: false,
        message: "Email already exists",
      };
    await db.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
      },
    });
    await credentialsSignIn(email, password);
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
