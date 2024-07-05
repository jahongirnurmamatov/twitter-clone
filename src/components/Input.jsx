'use client';
import { app } from "@/firabase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";
import {addDoc, collection, getFirestore, serverTimestamp} from 'firebase/firestore'
export default function Input() {
  const { data: session } = useSession();
  const imageRef = useRef(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [postText,setPostText]=useState('');
  const [postLoading,setPostLoading]=useState(false);
  const db = getFirestore(app);


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
  const handleSumbit = async ()=>{
    setPostLoading(true);
    const docRef = await addDoc(collection(db,'posts'),{
        uid: session.user.uid,
        username: session.user.username,
        postText,
        postImg:imageFileUrl,
        profileImg:session.user.image,
        timestamp: serverTimestamp(),
    });
    setPostLoading(false);
    setPostText('');
    setImageFileUrl(null);
    setSelectedFile(null);
  }

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
          value={postText}
          onChange={(e)=>setPostText(e.target.value)}
        />
        {selectedFile && (
          <img 
          src={imageFileUrl} alt="image" 
          className={`w-full max-h-[250px] object-cover cursor-pointer ${imgLoading ? 'animate-pulse':''}`} />
        )}
        <div className="flex justify-between items-center pt-2.5">
          <HiOutlinePhotograph
            onClick={() => imageRef.current.click()}
            className="w-10 h-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer"
          />
          <input hidden onChange={addImageToPost} accept="image/*" type="file" ref={imageRef} />
          <button 
          disabled={postText.trim()==='' || postLoading|| imgLoading} 
          onClick={handleSumbit}
          className="bg-blue-400 text-white px-4 py-1.5 rounded-full shadow-md font-bold hover:brightness-95 disabled:opacity-50">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
