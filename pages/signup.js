import Link from "next/link";
import { useEffect, useState } from "react";
import Router from "next/router";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import Swal from "sweetalert2";
const SignUp = () => {
  const auth = getAuth();
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const createUser = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: username,
        });
        await Swal.fire({
          icon: "success",
          title: "Signed up successfully",
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
        Router.push("/");
      })
      .catch((error) => {
        const errorMessage = error.message;
        Swal.fire({
          icon: "error",
          title: errorMessage,
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
      });
  };
  return (
    <div className="bg-spgray min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="px-6 py-8 rounded text-black w-full">
          <h1 className="mb-8 font-inconsolata text-3xl text-center text-white ">
            SIGN UP
          </h1>
          <input
            type="text"
            className="block font-inconsolata focus:outline-none w-full p-3 rounded-2xl mb-4"
            placeholder="Username"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
          />
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
          />
          <input
            type="password"
            className="block font-inconsolata focus:outline-none w-full p-3 rounded-2xl mb-4"
            placeholder="Confirm Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full font-inconsolata text-center py-3 rounded-full bg-green-400 text-white transition duration-1000 ease-in-out hover:bg-green-500 hover:scale-105 focus:outline-none my-1"
            onClick={() => createUser()}
          >
            Create Account
          </button>
        </div>
        <div className="text-white font-inconsolata mt-6">
          Already have an account?
          <Link href="/">
            <a className="no-underline font-inconsolata border-b border-blue text-blue ml-1">
              Log in
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
