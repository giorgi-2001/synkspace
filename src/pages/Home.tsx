import CreatePostForm from "../features/posts/CreatePostForm"
import PostList from "../features/posts/PostList"

const Home = () => {

  return (
    <section className="max-w-2xl mx-auto">
      <CreatePostForm />
      <PostList />
    </section>
  )
}

export default Home