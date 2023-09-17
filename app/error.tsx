"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Error = () => {

  const router = useRouter()

  return <main className="container h-screen flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold">There was an error!</h1>
    <p className="text-2xl">Please try again later.</p>

      <Button aria-label="Back To Home" type="button" onClick={() => router.push('/')} >Home</Button>

  </main>;
};
export default Error;
