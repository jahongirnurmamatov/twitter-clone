import { app } from '@/firabase';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React from 'react'
import { HiArrowLeft } from 'react-icons/hi';
import Link from 'next/link';
import Post from '@/components/Post';
export default async function page({params}) {
    let data = {};
    const db = getFirestore(app);
    
    const querySnapshot = await getDoc(doc(db,'posts', params.id));
    data = {...querySnapshot.data(),id:querySnapshot.id}

  return (
    <div className='max-w-xl mx-auto border-r border-l min-h-screen'>
        <div className='flex items-center space-x-2 py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200'>
            <Link className='hover:bg-gray-100 rounded-full p-2' href={'/'}>
            <HiArrowLeft className='h-5 w-5'/>
            </Link>
            <h2 className='sm:text-lg'>Back</h2>
        </div>
        <Post post={data} id={data.id}/>
    </div>
  )
}
