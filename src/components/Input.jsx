'use client';
import { app } from "@/firabase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";

export default function Input() {
  const { data: session } = useSession();
  const imageRef = useRef(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);

  const addImageToPost = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage();
    }
  }, [selectedFile]);

  if (!session) return null;

  const uploadImageToStorage = () => {
    setImgLoading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + selectedFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
      },
      (error) => {
        console.log(error);
        setImageFileUrl(null);
        setImgLoading(false);
        setSelectedFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setImgLoading(false);
        });
      }
    );
  };

  return (
    <div className="flex border-b border-gray-200 p-3 space-x-3 w-full">
      <img
        className="w-11 h-11 rounded-full cursor-pointer hover:brightness-95"
        src={session.user.image}
        alt="user-img"
      />
      <div className="w-full divide-y divide-gray-200">
        <textarea
          className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700"
          type="text"
          placeholder="What's happening?"
          rows={2}
        />
        {selectedFile && (
          <img src={imageFileUrl} alt="image" className="w-full max-h-[250px] object-cover cursor-pointer" />
        )}
        <div className="flex justify-between items-center pt-2.5">
          <HiOutlinePhotograph
            onClick={() => imageRef.current.click()}
            className="w-10 h-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer"
          />
          <input hidden onChange={addImageToPost} accept="image/*" type="file" ref={imageRef} />
          <button className="bg-blue-400 text-white px-4 py-1.5 rounded-full shadow-md font-bold hover:brightness-95 disabled:opacity-50">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
