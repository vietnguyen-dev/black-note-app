import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useRef, React } from 'react';

function App() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [postToEdit, setPostToEdit] = useState(null);
  const [postToComment, setPostToComment] = useState(null);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  // const [selectedComment, setCommentedPost] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const content = useRef(null);
  const editingContent = useRef(null);
  const comment = useRef(null);
  const likeState = useRef(null);
  

  function getPosts() {
    fetch('http://localhost:8080/posts').then(response => {
      return response.json()
    }).then(json => {
      setPosts(json);
      console.log(json);
      setLoaded(true);
      if (selectedPost) {
        setSelectedPost(selectedPost => {
          return json.find((post) => post.post_ID === selectedPost.post_ID)
        });
      }
    })
  }

  useEffect(() => {
    getPosts();
  }, []);

  function putPost() {
    fetch('http://localhost:8080/put-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: 1,
        content: content.current.value,
        // liked: liked.current.value
      })
    }).then(response => {
      if (response.ok) {
        content.current.value = '';
        getPosts();  
      } else {
        alert("You have no power here!")
      }
    }).catch(e => {
      console.error(e);
    });
  }

  function deletePost(id) {
    fetch('http://localhost:8080/delete-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post: id
      })
    }).then(response => {
      getPosts();
    }).catch(e => {
      console.error(e);
    });
  }

  function submitEdit() {
    fetch('http://localhost:8080/update-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post: postToEdit.post_ID,
        content: editingContent.current.value
      })
    }).then(response => {
      if (response.ok) {
        getPosts();
        setPostToEdit(null); 
      }
    }).catch(e => {
      console.error(e);
    });
  }
  
  function changePostStatus(id, likedStatus) {
    let likeState = likedStatus;
    if(likedStatus === 1) {
      likeState = 0;
    } else {
      likeState = 1;
    }
    likePost(id, likeState);
  }

  function changeCommentStatus(id, likedStatus) {
    let likeState = likedStatus;
    if(likedStatus === 1) {
      likeState = 0;
    } else {
      likeState = 1;
    }
    likeComment(id, likeState);
  }

  function likePost(id, likeState){
    fetch('http://localhost:8080/like-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post: id,
        like: likeState
      })
    }).then(response => {
        getPosts();
        likeState = null;
        
    }).catch(e => {
      console.error(e);
    });
  }

  function likeComment(id, likeState){
    fetch('http://localhost:8080/like-comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comment: id,
        like: likeState
      })
    }).then(response => {
      getComments(selectedPost.post_ID);
      likeState = null;
    }).catch(e => {
      console.error(e);
    });
  }

  function getComments(post) {
    fetch(`http://localhost:8080/get-comments/${post}`).then(response => {
      return response.json()
    }).then(comms => {
      setComments(comms);
    }).catch(e => console.error(e));
  }

  function submitComment() {
    fetch('http://localhost:8080/put-comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post: selectedPost.post_ID,
        comment: comment.current.value,
        user: 1
      })
    }).then(response => {
      if (response.ok) {
        getComments(selectedPost.post_ID);
        comment.current.value = "";
      }
    }).catch(e => {
      console.error(e);
    });
  }

  function deleteComment(id){
    fetch('http://localhost:8080/delete-comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comment: id
        // like: id.liked
      })
    }).then(response => {
      if (response.ok) {
        getComments(selectedPost.post_ID);
      }
    }).catch(e => {
      console.error(e);
    });
  }

  function updateComment(){
    fetch('http://localhost:8080/update-comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        commentID: commentToEdit.comment_ID,
        comment: editingContent.current.value
      })
    }).then(response => {
      if (response.ok) {
        getComments(selectedPost.post_ID);
        setCommentToEdit(null); 
      }
    }).catch(e => {
      console.error(e);
    });
  }

  function selectPost(post) {
    setSelectedPost(post);
    if (post) {
      getComments(post.post_ID);   
    } else {
      setComments([]);
    }
  }

  return (
    <div className="App">
      {loaded ? (
        <div className='container'>   
          {selectedPost ? (
            <div>
              <button onClick={() => selectPost(null)}>Back</button>
              <div style={{ margin: 10, padding: 10, background: '#ffff00' }}>
                <div className="dropdown">
                        <button className="dropbtn" >...</button>
                        <div className="dropdown-content">
                            <button onClick={() => setPostToEdit(selectedPost)}>Edit</button>
                            <br></br>
                            <button onClick={() => deletePost(selectedPost.post_ID)}>Delete</button>
                        </div>
                </div>
                <h1>Post:</h1>
                <p>{selectedPost.content}</p>
                <button onClick={() =>changePostStatus(selectedPost.post_ID,selectedPost.liked)}>Like: {selectedPost.liked}</button>
                <div>
                  <h2>Comments:</h2>
                  
                  {comments.map((comment) => (
                    <div key={comment.comment_ID}>
                         <p>{comment.comment}</p>
                         <button onClick={() =>changeCommentStatus(comment.comment_ID, comment.liked)}>Like: {comment.liked}</button>
                         <div className="dropdown">
                        <button className="dropbtn" >...</button>
                        <div className="dropdown-content">
                            <button onClick={() => setCommentToEdit(comment)}>Edit</button>
                            <br></br>
                            <button onClick={() => deleteComment(comment.comment_ID)}>Delete</button>
                        </div>
                    </div>
                    </div> 
                  ))}
                </div>
                <div style={{
                  margin: 40,
                  border: '1px solid red',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <textarea ref={comment} placeholder={"Put your comment here!"}></textarea>
                  <button onClick={submitComment}>Submit Comment</button>
                </div>
              </div>
            </div>
          ): (
              <div>
                <div>
                  <textarea ref={content}></textarea>
                  <button onClick={putPost}>Send the post!!!!</button>
                </div>
                {posts.map((post) => (
                  <div key={post.post_ID} style={{margin: 10, padding: 10, background: '#ddd'}}>
                     <div className="dropdown">
                        <button className="dropbtn" >...</button>
                        <div className="dropdown-content">
                            <button onClick={() => setPostToEdit(post)}>Edit</button>
                            <br></br>
                            <button onClick={() => deletePost(post.post_ID)}>Delete</button>
                        </div>
                    </div>
                    <p onClick={() => selectPost(post)}>
                      {post.content}
                    </p>
                    
                    <button onClick={() =>changePostStatus(post.post_ID, post.liked)}>Like: {post.liked}</button>
                    <button onClick={() => selectPost(post)}>Comment</button>
                    {/* <span>new Date(post.created_time).toLocaleString()</span> */}
                    <p>Date Post: {new Date(post.post_time).toLocaleString('en-US')}</p>
                  </div>
                ))}
                
              </div>
          )}
          

          {postToEdit && (
            <div style={{
              margin: 40,
              border: '1px solid blue',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <textarea ref={editingContent} defaultValue={postToEdit.content}></textarea>
              <button onClick={submitEdit}>Done Editing</button>
            </div>
          )}

          {commentToEdit && (
            <div style={{
              margin: 40,
              border: '1px solid blue',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <textarea ref={editingContent} defaultValue={commentToEdit.comment}></textarea>
              <button onClick={updateComment}>Done Editing</button>
            </div>
          )}

          {postToComment && (
            <div style={{
              margin: 40,
              border: '1px solid red',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <textarea ref={comment} placeholder={"Put your comment here!"}></textarea>
              <button onClick={submitComment}>Submit Comment</button>
            </div>
          )}
        </div>
      ): (
          <h1>LOADING.....</h1>
          //send
      )}
      
     
    </div>
  );
}

export default App;
