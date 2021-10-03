import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";
const Login = () => {
  const auth = getAuth();
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Signed in successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        Swal.fire({
          icon: "error",
          title: errorMessage,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
      });
  };

  return (
    <div className="bg-spgray min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="px-6 py-8 rounded text-black w-full">
          <h1 className="mb-8 text-3xl text-center text-white font-inconsolata">
            LOG IN
          </h1>
          <input
            type="text"
            className="block font-inconsolata focus:outline-none w-full p-3 rounded-2xl mb-4"
            placeholder="Email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="block font-inconsolata focus:outline-none w-full p-3 rounded-2xl mb-4"
            placeholder="Password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => {
              e.key === "Enter" ? signIn() : null;
            }}
          />
          <button
            className="w-full font-inconsolata text-center py-3 rounded-full bg-green-400 text-white transition duration-1000 ease-in-out hover:bg-green-500 hover:scale-105 focus:outline-none my-1"
            onClick={() => signIn()}
          >
            Login
          </button>
        </div>
        <div className="text-white font-inconsolata mt-6">
          Don't have an account?
          <Link href="/signup">
            <a className="no-underline border-b border-blue text-blue ml-1">
              Sign up
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
