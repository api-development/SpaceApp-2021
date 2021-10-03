import { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  limit,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Login from "../component/login";
import Swal from "sweetalert2";
const Index = () => {
  const storage = getStorage();
  const auth = getAuth();
  const db = getFirestore();
  const [user, setUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const dummySpace = useRef();
  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
  }, []);

  const addMessage = (url = null) => {
    if (newMessage?.trim()) {
      addDoc(collection(db, "messages"), {
        text: newMessage,
        url,
        createdAt: serverTimestamp(),
        uid: user.uid,
        displayName: user.displayName,
      });
    }
    setNewMessage("");
  };

  const logout = () => {
    signOut(auth).catch((error) => {
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

  useEffect(() => {
    onSnapshot(
      query(collection(db, "messages"), orderBy("createdAt"), limit(100)),
      (doc) => {
        setMessages(
          doc.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
        dummySpace?.current?.scrollIntoView();
      }
    );
  }, []);

  const uploadFile = (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, "file/" + new Date());
    uploadBytes(storageRef, file).then(async (snapshot) => {
      await getDownloadURL(ref(storage, snapshot.metadata.fullPath)).then(
        (url) => {
          addDoc(collection(db, "messages"), {
            text: file.name,
            url,
            createdAt: serverTimestamp(),
            uid: user.uid,
            displayName: user.displayName,
          });
        }
      );
      Swal.fire({
        icon: "success",
        title: "Upload file successfully",
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
  if (loading) return <div className="bg-spgray w-full h-screen"></div>;
  if (user) {
    return (
      <div className="bg-spgray w-full h-screen relative">
        <section>
          <div className="absolute right-0 flex flex-row p-4">
            <button
              className="text-white cursor-pointer flex flex-row"
              onClick={() => logout()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <p className="px-2 font-inconsolata">Log Out</p>
            </button>
          </div>
        </section>
        <section>
          <div className="absolute flex flex-col pl-8 items-center h-5/6 top-16 left-0 text-white w-full overflow-y-auto scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-800">
            {messages.map((message) => {
              if (message.url) {
                return (
                  <a
                    className="text-xl bg-transparent w-full pb-1 font-inconsolata"
                    key={message.id}
                  >
                    {`${
                      message.createdAt?.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) ||
                      new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    } | ${message.displayName} > `}
                    <a
                      className="text-blue-500"
                      href={message.url}
                      target="_blank"
                    >{`@${message.text}`}</a>
                  </a>
                );
              } else {
                return (
                  <p
                    className="text-xl bg-transparent w-full pb-1 font-inconsolata"
                    key={message.id}
                  >
                    {`${
                      message.createdAt?.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) ||
                      new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    } | ${message.displayName} > ${message.text}`}
                  </p>
                );
              }
            })}
            <div ref={dummySpace}></div>
          </div>
        </section>
        <section>
          <div className="absolute flex flex-row items-center bottom-0 left-0 text-white w-full p-4">
            <label
              htmlFor="uploadFile"
              className="cursor-pointer ml-4 mr-2 bg-white hover:bg-gray-200 text-spgray rounded-full p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </label>
            <input
              type="file"
              id="uploadFile"
              className="opacity-0 w-0 h-0"
              onChange={(e) => {
                uploadFile(e.target.files[0]);
              }}
            />
            <label for="textBox" className="mr-4 cursor-text">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </label>
            <input
              className="text-xl bg-transparent w-full overflow-ellipsis overflow-hidden border-none active:outline-none focus:outline-none font-inconsolata"
              id="textBox"
              autocomplete="off"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                e.key === "Enter" ? addMessage() : null;
              }}
              autoFocus
            />
          </div>
        </section>
      </div>
    );
  } else {
    return <Login></Login>;
  }
};
export default Index;
