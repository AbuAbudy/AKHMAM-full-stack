import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSun, FaMoon, FaTrash, FaEdit } from "react-icons/fa";
import Loader from "../../components/Loader";
import "../../styles/AdminBlog.css";

function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
    preview: "",
    tags: "",      // comma-separated string
    category: "",  // new field for category
  });
  const [editingId, setEditingId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
  }, [darkMode]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/blog");
      // Normalize tags: parse JSON string to array if needed
      const normalizedPosts = res.data.posts.map((post) => {
        let tags = post.tags;
        if (typeof tags === "string") {
          try {
            tags = JSON.parse(tags);
          } catch {
            tags = [];
          }
        }
        return { ...post, tags };
      });
      setPosts(normalizedPosts || []);
    } catch (err) {
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/blog/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setForm((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      description: post.description,
      image: null,
      preview: post.image ? `http://localhost:5000/${post.image}` : "",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
      category: post.category || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    if (form.image) formData.append("image", form.image);

    // Convert tags string to array and append as JSON string in formData
    const tagsArray = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    formData.append("tags", JSON.stringify(tagsArray));

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`/api/blog/${editingId}`, formData);
        toast.success("Post updated successfully");
      } else {
        await axios.post("/api/blog", formData);
        toast.success("Post created successfully");
      }
      setForm({ title: "", description: "", image: null, preview: "", tags: "", category: "" });
      setEditingId(null);
      fetchPosts();
    } catch (err) {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        setLoading(true);
        await axios.delete(`/api/blog/${id}`);
        toast.success("Post deleted successfully");
        fetchPosts();
      } catch (err) {
        toast.error("Failed to delete post");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`admin-container ${darkMode ? "dark" : ""}`}>
      <div className="admin-header">
        <h2>Manage Blog Posts</h2>
        <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-toggle">
          {darkMode ? <FaMoon /> : <FaSun />}
        </button>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        ></textarea>

        {/* Category select */}
        <input
  type="text"
  name="category"
  list="category-options"
  placeholder="Category (select or type new)"
  value={form.category}
  onChange={handleChange}
  required
/>
<datalist id="category-options">
  {categories.map((cat) => (
    <option key={cat.id} value={cat.name} />
  ))}
</datalist>


        {/* Tags input */}
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
        />

        {form.preview && (
          <img src={form.preview} alt="Preview" className="preview-image" />
        )}

        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        <button type="submit" disabled={loading}>
          {editingId ? "Update" : "Create"} Post
        </button>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div className="admin-list">
          {posts.map((post) => (
            <div key={post.id} className="admin-item">
              {post.image && (
                <img
                  src={`http://localhost:5000/${post.image}`}
                  alt={post.title}
                  className="post-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "http://localhost:5000/assets/uploads/default.jpg";
                  }}
                />
              )}
              <h3>{post.title}</h3>
              <p>{post.description}</p>

              {/* Show category */}
              <p className="post-category">
                <strong>Category: </strong>{post.category || <em>None</em>}
              </p>

              {/* Show tags safely */}
              <div className="tags-container">
                {Array.isArray(post.tags) && post.tags.length > 0 ? (
                  post.tags.map((tag, idx) => (
                    <span key={idx} className="tag">
                      {tag}
                    </span>
                  ))
                ) : (
                  <small>No tags</small>
                )}
              </div>

              <div className="admin-buttons">
                <button onClick={() => handleEdit(post)}>
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDelete(post.id)} className="delete">
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminBlog;