export async function withGeminiRetry<T>(
  fn: () => Promise<T>,
  retries = 4
): Promise<T> {
  let lastError;

  for (
    let i = 0;
    i < retries;
    i++
  ) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;

      const status =
        err?.status;

      // Retry only temporary failures
      if (
        status === 503 ||
        status === 429
      ) {
        const delay =
          2000 * (i + 1);

        console.log(
          `Gemini retry ${i + 1}/${retries} after ${delay}ms`
        );

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              delay
            )
        );

        continue;
      }

      throw err;
    }
  }

  throw lastError;
}