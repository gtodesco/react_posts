import { FC, useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { commentsState, postsState } from '../../store';
import { Comment, Post } from '../../interfaces';
import s from '../Post/post.module.css';

const PostComponent: FC = () => {

  const params = useParams();

  const [posts] = useRecoilState<Post[]>(postsState);
  const [comments, setComments] = useRecoilState<Comment[]>(commentsState);

  const [post, setPost] = useState<Post>({id: 0, userId: 0, title: '', body: ''});
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [newCommentEmail, setNewCommentEmail] = useState<string>('');
  const [newCommentName, setNewCommentName] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    // Search for the post in store
    const post = posts.filter((post) => {
      return post.id === Number(params.postId);
    })
    setPost(post[0]);

    // Get post's comments
    let postComments = comments.filter((comment) => {
      return comment.postId === Number(params.postId)
    })
    /* If the store doesn't has any comment from this post, fetch the endpoint filtering by post ID
      Then save the new comments in the store and set the comments for this post
    */
    if (postComments.length === 0) {
      const getComments = async () => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${params.postId}`);
        const newComments = await response.json();
        setComments(comments.concat(newComments));
        setPostComments(newComments);
      }
      getComments();
    }
    else {
      setPostComments(postComments);
    }

  }, []);

  const submitComment = () => {
    const comment: Comment = {
      id: comments.length + 1,
      email: newCommentEmail,
      name: newCommentName,
      body: newComment,
      postId: Number(params.postId)
    }
    // When submit a comment, it's saves the new comment in the store, add to this post's comments and erase the inputs' content
    setComments(comments.concat(comment));
    setPostComments(postComments.concat(comment));
    setNewCommentEmail('');
    setNewCommentName('');
    setNewComment('');
  }

  return (
    <div>
      <Link to="/">
        <button className={s.back}>Voltar</button>
      </Link>
      <h1 className={s.title}>{post.title}</h1>
      <article className={s.body}>{post.body}</article>
  
      <h3 className={s.title}>Comments</h3>
      <section className={s.comments}>
        {postComments.map((comment) => (
          <article key={comment.id}>
            <h5>{comment.name} - {comment.email}</h5>
            {comment.body}
          </article>
        ))}
      </section>

      <h3 className={s.title}>Submit your comment</h3>
      <section className={s.inputs}>
        <input
          placeholder='Email'
          value={newCommentEmail}
          onChange={e => setNewCommentEmail(e.target.value)}/>
        <input
          placeholder='Name'
          value={newCommentName}
          onChange={e => setNewCommentName(e.target.value)}/>
      </section>
      <section className={s.inputs}>
        <textarea
          placeholder='Comment here...'
          value={newComment}
          onChange={e => setNewComment(e.target.value)}/>
      </section>
      <section className={s.inputs}>
        <button onClick={submitComment}>Submit</button>
      </section>
    </div>
  )
}

export default PostComponent