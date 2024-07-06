'use client';
import { HiOutlineChat, HiOutlineHeart, HiOutlineTrash,HiHeart } from "react-icons/hi";
import { signIn, useSession } from "next-auth/react";
import { collection, deleteDoc, doc, getFirestore, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { app } from "@/firabase";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "@/atom/modalAtom";


export default function Icons({id,uid}) {
  const {data:session} = useSession();
  const [isLiked,setIsliked] = useState(false);
  const [likes,setLikes] = useState([]);
  const [open,setOpen]=useRecoilState(modalState);
  const [postId,setPostId] = useRecoilState(postIdState)
  const db = getFirestore(app);
  const [comments,setComments]=useState([]);

  const likePost = async()=>{
    if(session){
      if(isLiked){
        await deleteDoc(doc(db,'posts',id,'likes',session?.user.uid))
      }else{
        await setDoc(doc(db,'posts',id, 'likes',session?.user.uid),{
          username:session.user.username,
          timestamp:serverTimestamp(),
        })
      }
      
    }else{
      signIn();
    }
  }
  const deletePost =async()=>{
    if(window.confirm('Are you sure you want to delete the post?')){
      if(session?.user?.uid===uid){
        deleteDoc(doc(db,'posts',id)).then(()=>{
          console.log('succesfully deleted');
          window.location.reload();
        }).catch((error)=>{
          console.log(error)
        })
      }else{
        alert('You are not authorized to delete posts of other people')
      }
  
    }
  }

  useEffect(()=>{
    const unsubscribe=onSnapshot(collection(db,'posts',id,'comments'),(snapshot)=>{
      setComments(snapshot.docs);
    });
    return ()=>unsubscribe();
  },[db,id])
  
  useEffect(()=>{
    onSnapshot(collection(db,'posts',id,'likes'),(snapshot)=>{
      setLikes(snapshot.docs);
    });
  },[db]);

  useEffect(()=>{
    setIsliked(likes.findIndex((like)=>like.id===session?.user?.uid)!==-1)
  },[likes]);

  return (
    <div className="flex justify-start gap-5 p-2 text-gray-500 ">
        <div className="flex items-center gap-1">
        <HiOutlineChat onClick={()=>{
          if(!session){
            signIn();
          }else{
            setOpen(!open);
            setPostId(id);
          }
        }}
        className="h-7 w-7 cursor-pointer rounded-full transition duration-200 ease-in-out hover:text-sky-500 hover:bg-sky-100" />
        {
          comments.length>0 && (<span className="text-xs">{comments.length}</span>)
        }
        </div>
        <div className="flex items-center gap-1">
        {
          isLiked ? (<HiHeart  onClick={likePost}
            className="h-7 w-7 cursor-pointer rounded-full transition text-red-600 duration-200 ease-in-out hover:text-red-500 hover:bg-red-100" />):
            (
              <HiOutlineHeart  onClick={likePost}
        className="h-7 w-7 cursor-pointer rounded-full transition duration-200 ease-in-out hover:text-red-500 hover:bg-red-100" />
            )
        }
        {likes.length>0 && <span className={`text-xs ${isLiked&& 'text-red-600'}`}>{likes.length}</span>}
        </div>
        {
          session?.user.uid===uid && (
            <HiOutlineTrash  onClick={deletePost}
        className="h-7 w-7 cursor-pointer rounded-full transition duration-200
         ease-in-out hover:text-red-500 hover:bg-red-100" />
          )
        }
    </div>
  )
}
