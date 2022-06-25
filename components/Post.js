import React, { useEffect, useState } from 'react';
import {
    BookmarkIcon,
    ChatIcon,
    DotsHorizontalIcon,
    EmojiHappyIcon,
    HeartIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import { useSession } from 'next-auth/react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

import Moment from 'react-moment';

function Post( {id, username, userImg, img, caption}) {

  const {data: session} = useSession();

  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLike] = useState(false);

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid));
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', session.user.uid),{
        username: session.user.username,
      });
    }
  }

  useEffect( 
    () => onSnapshot(
            collection(db, 'posts', id, 'likes'), 
              (snapshot) => setLikes(snapshot.docs)  
        ), 
    [db, id]);

  useEffect(
      () => 
          setHasLike(
            likes.findIndex((like) => like.id === session?.user?.uid) !== -1
          ),

      [likes]);

    
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const sendComment = async (e) => {
      e.preventDefault();

      const commentToSend = comment;
      setComment('');

      await addDoc(collection(db, 'posts' , id, 'comments'), {
        comment: commentToSend,
        username: session.user.username,
        userImage: session.user.image,
        timestamp: serverTimestamp(),
      });

  }

  useEffect(
    () => onSnapshot(
            query(
              collection(db, 'posts', id, 'comments'), orderBy('timestamp', 'desc')
            ),
              (snapshot) => setComments(snapshot.docs)
    
          )
    ,[db, id]);

  return (
    <div>

        {/* Post */}
        <div className='bg-white 
                        my-6 
                        border
                        rounded-sm'>

             {/* PostHeader  */}
            <div className='flex
                            items-center
                            p-5'>

                <img src={userImg} alt='' 
                    className=' rounded-full
                                h-14 w-14
                                object-contain
                                border 
                                p-1 mr-3 '/>

                <p className='flex-1 font-bold'>{username}</p>

                <DotsHorizontalIcon className='h-5' />
            </div>

            {/* Image */}
            <img src={img} className="object-cover w-full" alt='' />

            {/* Buttons */}
            {session && (
                <div className='flex justify-between px-4 pt-4'>

                  <div className='flex space-x-4 ' >

                      {hasLiked ? (
                        <HeartIconFilled onClick={likePost} className='customBtnClass text-red-500' />
                      ) : (
                        <HeartIcon onClick={likePost} className='customBtnClass' />
                      )}
                      
                      <ChatIcon className='customBtnClass' />
                      <PaperAirplaneIcon className='customBtnClass' />
                  </div>

                  <BookmarkIcon className='customBtnClass' />
                </div>
            )}
            
            
            {/* Caption */}
            <p className='p-5 truncate'>
              {likes.length > 0 && (
                <p className='font-bold mb-1'>{likes.length} likes</p>
              )}
              <span className='font-bold mr-1'>{username} </span>
              {caption}
            </p>

            {/* Comments */}
            {comments.length > 0 && (
              <div className='ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin'>
                  {comments.map((comment) => (
                    <div key={comments.id} className='flex items-center space-x-2 mb-3'>
                        <img  className='h-7 rounded-full'
                              src={comment.data().userImage}
                              alt='' />

                        <p className='text-sm flex-1'>
                          <span className='font-bold'>
                            {comment.data().username}
                          </span>{" "}
                          {comment.data().comment}
                        </p>

                        <Moment fromNow className='pr-5 text-xs'>
                          {comment.data().timestamp?.toDate()}
                        </Moment>
                    </div>
                  ))}
              </div>
            )}

            {/* InputBox */}
            {session && (
              <form className='flex items-center p-4'>
                  <EmojiHappyIcon className='h-7' />
                  <input 
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    type="text"
                    placeholder="Add a comment..."
                    className='border-none flex-1 focus:ring-0 outline-none'
                  />
                  <button 
                        type='submit' 
                        disabled={!comment.trim} 
                        onClick={sendComment} className='font-semibold text-blue-400'>Post</button>
              </form>
            )}
            
            
        </div>
    </div>
  )
}

export default Post