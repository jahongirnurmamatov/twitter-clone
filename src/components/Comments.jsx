'use client';

import { app } from "@/firabase";
import { collection, getFirestore, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import Comment from "./Comment";

export default function Comments({ id }) {
  const db = getFirestore(app);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'posts', id, 'comments'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [db, id]);

  return (
    <div>
      {comments.length === 0 ? (
        <p>No comments found.</p>
      ) : (
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} commentId={comment.id} originalPostId={id} />
        ))
      )}
    </div>
  );
}
