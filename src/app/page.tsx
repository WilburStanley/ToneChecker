"use client";

import ToneForm from "@/components/tone-form";
import ToneResult from "@/components/tone-result";
import { useCheckTone } from "@/hooks/use-check-tone";

const Home = () => {
  const { result, errorMessage, isLoading, checkTone } = useCheckTone();

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-12 text-gray-100">
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Tone Checker</h1>
          <p className="text-gray-400">
            Check how a message sounds before you send it.
          </p>
        </header>

        <ToneForm isLoading={isLoading} onSubmit={checkTone} />

        {errorMessage && (
          <p
            role="alert"
            className="rounded-lg border border-red-900 bg-red-950 p-3 text-red-300"
          >
            {errorMessage}
          </p>
        )}

        {result && <ToneResult result={result} />}
      </div>
    </main>
  );
};

export default Home;