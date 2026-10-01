export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { ensureCounsellor } = await import("@/lib/seed");
    await ensureCounsellor();
  }
}
