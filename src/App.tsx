import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { postsState } from './store';
import { Link } from "react-router-dom";
import './App.css';

const App = () => {

  const [posts, setPosts] = useRecoilState(postsState);

  useEffect(() => {
    const getPosts = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const newPosts = await response.json();
      setPosts(newPosts);
    }
    getPosts();

  }, []);

  return (
    <div className="App">
      <h1>Lastest posts</h1>
      <div className='grid-posts'>
        {posts.map((post) => (
          <div key={post.id} className='post'>
            <h1>{post.title}</h1>
            <div className='actions'>
              <Link to={`/post/${post.id}`}>
                <button>Read more</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
