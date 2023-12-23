import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * @description 서버측에서만 사용하는 env
   * 공개되면 안되는 env를 여기에 추가함
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    SLACK_CLIENT_ID: z.string(),
    SLACK_CLIENT_SECRET: z.string(),
  },

  /**
   * @description 클라이언트측에서만 사용하는 env
   * 성능 최적화를 위해서 클라이언트측에서만 사용하는 env를 여기에 추가함
   * 현재는 사용할 게 없어서 전부 주석처리함
   */
  // client: {
  // NEXT_PUBLIC_CLIENTVAR: z.string(),
  // },

  /**
   * @description 런타임 환경변수
   * 서버측, 클라이언트측에 환경변수 설정하려면 선행 조건으로 여기에 무조건 정의해야함
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
  },
  /**
   * @description 빈 string의 env를 undefined로 변환함
   * 빈 env를 사용할 경우 .string() 조건에서 error를 발생시키기 위한 용도
   */
  emptyStringAsUndefined: true,
});
