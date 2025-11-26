import React, { useState } from "react";
import { Button } from "@windmill/react-ui";
import { Editor } from "@tinymce/tinymce-react";
import toast from "react-hot-toast";
import NewsTable from "./NewsTable";
import { useCreateNewsMutation } from "../../features/news/news";


const News = () => {
  const [text, setText] = useState("");
  const [createNews] = useCreateNewsMutation();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    excerpt: "",
    isBreaking: false,
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("slug", formData.title.toLowerCase().replace(/ /g, "-"));
    data.append("author", formData.author);
    data.append("category", formData.category);
    data.append("excerpt", formData.excerpt);
    data.append("content", text);
    data.append("isBreaking", formData.isBreaking);

    if (image) {
      data.append("image", image);
    }

    const response = await createNews(data);

    if (response.data?.success) {
      toast.success("✅ News Created Successfully!");

      setFormData({
        title: "",
        author: "",
        category: "",
        excerpt: "",
        isBreaking: false,
      });
      setText("");
      setImage(null);

      document.getElementById("my_modal_4").close();
    } else {
      toast.error("❌ Failed to create news!");
    }
  };

  return (
    <>
      <div className="w-full mx-auto p-4 md:p-6 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h4 className="text-2xl font-semibold">News</h4>

          <Button
            className="bg-brandRed text-white mb-3"
            onClick={() => document.getElementById("my_modal_4").showModal()}
          >
            + Add News
          </Button>
        </div>

        <dialog id="my_modal_4" className="modal">
          <form className="space-y-4 max-w-2xl w-full" onSubmit={handleSubmit}>
            {/* Title */}
            <div>
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* Author */}
            <div>
              <label>Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Category */}
                <div>
      <label>Category</label>
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Category</option>

        {/* Static Category Options */}
        <option value="National">National</option>
        <option value="Politics">Politics</option>
        <option value="Sports">Sports</option>
        <option value="Technology">Technology</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Business">Business</option>
        <option value="Health">Health</option>
        <option value="Education">Education</option>
        <option value="Lifestyle">Lifestyle</option>
        <option value="World News">World News</option>
      </select>
    </div>


            {/* Excerpt */}
            <div>
              <label>Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* TinyMCE Editor */}
            <div>
              <label>Content</label>
              <Editor
                apiKey="fmljm0xvo4qvhqyeozgqyvl07anhguhupqc6hp8mc78v1rbz"
                initialValue=""
                init={{
                  height: 300,
                  menubar: false,
                }}
                onEditorChange={(content) => setText(content)}
              />
            </div>

            {/* Breaking News */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isBreaking"
                checked={formData.isBreaking}
                onChange={handleChange}
              />
              <label>Breaking News?</label>
            </div>

            {/* Image */}
            <div>
              <label>Thumbnail Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border p-2 rounded"
              />
              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  className="w-24 h-24 mt-2 rounded object-cover"
                />
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => document.getElementById("my_modal_4").close()}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-brandRed text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </dialog>

        <NewsTable />
      </div>
    </>
  );
};

export default News;
