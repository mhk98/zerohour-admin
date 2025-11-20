// import React, { useEffect, useState } from "react";
// import { Button } from "@windmill/react-ui";
// import { Editor } from "@tinymce/tinymce-react";
// import { useCreateProductMutation } from "../../features/product/product";
// import toast from "react-hot-toast";
// import NewsTable from "./NewsTable";

// const News = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     short_description: "",
//     description: "",
//     weight: "",
//     price: "",
//     purchase_price: "",
//     category_id: "",
//     subCategoryItem_id: "",
//   });

//   const [isLoading, setIsLoading] = useState(true);
//   const [isError, setIsError] = useState(false);

//   const [text, setText] = useState("");
//   const [defaultImage, setDefaultImage] = useState(null);
//   const [galleryImages, setGalleryImages] = useState([]);

//   // Handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle default image upload
//   const handleDefaultImage = (e) => {
//     setDefaultImage(e.target.files[0]);
//   };

//   // Handle gallery images upload
//   const handleGalleryImages = (e) => {
//     setGalleryImages([...e.target.files]);
//   };

//   const handleEditorChange = (content) => {
//     setText(content);
//   };

//   const [createProduct] = useCreateProductMutation();

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = new FormData();
//       data.append("title", formData.title);
//       data.append("category_id", formData.category_id);
//       data.append("subCategoryItem_id", formData.subCategoryItem_id);
//       data.append("short_description", formData.short_description);
//       data.append("weight", formData.weight);
//       data.append("purchase_price", formData.purchase_price);
//       data.append("price", formData.price);
//       data.append("description", text); // Append the content from the editor

//       if (defaultImage) {
//         data.append("default_image", defaultImage);
//       }

//       if (galleryImages.length > 0) {
//         galleryImages.forEach((img) => {
//           data.append("gallery_images", img);
//         });
//       }

//       const response = await createProduct(data);

//       if (response.data?.success) {
//         toast.success("✅ Product Created Successfully!");

//         // Reset form on success
//         setFormData({
//           title: "",
//           short_description: "",
//           description: "",
//           weight: "",
//           price: "",
//           purchase_price: "",
//           category_id: "",
//           subCategoryItem_id: "",
//         });
//         setText("");
//         setDefaultImage(null);
//         setGalleryImages([]);
//         setIsModalOpen(false); // Close modal on success
//       } else {
//         toast.error(
//           response.error?.data?.message || "Failed to create product!"
//         );
//       }
//     } catch (error) {
//       console.error("❌ Error:", error);
//       toast.error("Failed to create product!");
//     }
//   };

//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/v1/category`
//         );
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         setCategories(data.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const [subCategories, setSubCategories] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/v1/subCategoryItem`
//         );
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         setSubCategories(data.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   console.log("categories", categories);
//   console.log("subCategories", subCategories);

//   return (
//     <>
//       <div className="w-full mx-auto p-4 md:p-6 bg-gray-100 min-h-screen">
//         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           {/* Header Section */}
//           <div>
//             <h4 className="text-2xl md:text-md font-semibold text-gray-900">
//               Product
//             </h4>
//           </div>

//           {/* Right Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3">
//             <Button
//               className="px-4 py-2 bg-brandRed text-white rounded-md text-sm md:text-base hover:bg-brandRed-700 transition"
//               // onClick={() => setIsModalOpen(true)}
//               onClick={() => {
//                 document.getElementById("my_modal_4").showModal();
//                 // eslint-disable-next-line no-undef
//               }}
//             >
//               + Add Product
//             </Button>
//           </div>
//         </div>

//         {/* Modal for Adding Product Information */}
//         {/* <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//           <ModalHeader className="mb-4">Add Product Information</ModalHeader>
//           <ModalBody> */}
//         <dialog id="my_modal_4" className="modal">
//           <form className="space-y-4 w-full max-w-2xl" onSubmit={handleSubmit}>
//             {/* Title */}
//             <div>
//               <label className="block text-gray-700 text-left">Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 className="w-full border rounded p-2"
//                 required
//               />
//             </div>

//             {/* Short Description */}
//             <div>
//               <label className="block text-gray-700 text-left">
//                 Short Description
//               </label>
//               <textarea
//                 name="short_description"
//                 value={formData.short_description}
//                 onChange={handleChange}
//                 className="w-full border rounded p-2"
//                 required
//               />
//             </div>

//             {/* Description (TinyMCE Editor) */}
//             <div style={{ width: "100%" }}>
//               <label className="block text-gray-700 text-left">
//                 Description
//               </label>
//               <Editor
//                 apiKey="fmljm0xvo4qvhqyeozgqyvl07anhguhupqc6hp8mc78v1rbz"
//                 initialValue={text}
//                 init={{
//                   height: 300,
//                   menubar: false,
//                   plugins: [
//                     "advlist",
//                     "autolink",
//                     "lists",
//                     "link",
//                     "image",
//                     "charmap",
//                     "preview",
//                     "anchor",
//                     "searchreplace",
//                     "visualblocks",
//                     "code",
//                     "fullscreen",
//                     "insertdatetime",
//                     "media",
//                     "table",
//                     "help",
//                     "wordcount",
//                   ],
//                   toolbar:
//                     "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
//                     "alignright alignjustify | bullist numlist outdent indent | removeformat | help",
//                   content_style:
//                     "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
//                 }}
//                 onEditorChange={handleEditorChange}
//               />
//             </div>

//             {/* Weight */}
//             <div>
//               <label className="block text-gray-700 text-left">
//                 Product Weight
//               </label>
//               <input
//                 type="text"
//                 name="weight"
//                 value={formData.weight}
//                 onChange={handleChange}
//                 className="w-full border rounded p-2"
//                 required
//               />
//             </div>

//             {/*Purchase Price */}
//             <div>
//               <label className="block text-gray-700 text-left">
//                 Purchase Price
//               </label>
//               <input
//                 type="number"
//                 name="purchase_price"
//                 value={formData.purchase_price}
//                 onChange={handleChange}
//                 className="w-full border rounded p-2"
//                 required
//               />
//             </div>

//             {/* Price */}
//             <div>
//               <label className="block text-gray-700 text-left">Price</label>
//               <input
//                 type="number"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 className="w-full border rounded p-2"
//                 required
//               />
//             </div>

//             {/* Category */}
//             <div>
//               <label className="block text-gray-700 text-left">Category</label>
//               <select
//                 name="category_id" // ✅ add name
//                 value={formData.category_id}
//                 onChange={handleChange}
//                 className="input input-bordered w-full p-2 border border-gray-300"
//                 required
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((category) => (
//                   <option key={category.categoryId} value={category.categoryId}>
//                     {category.text}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Sub Category */}
//             <div>
//               <label className="block text-gray-700 text-left">
//                 Sub Category
//               </label>
//               <select
//                 name="subCategoryItem_id" // ✅ add name
//                 value={formData.subCategoryItem_id}
//                 onChange={handleChange}
//                 className="input input-bordered w-full p-2 border border-gray-300"
//                 required
//               >
//                 <option value="">Select Sub Category</option>
//                 {subCategories.map((subCategory) => (
//                   <option
//                     key={subCategory.subCategoryItemId}
//                     value={subCategory.subCategoryItemId}
//                   >
//                     {subCategory.subCategoryItemTitle}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Default Image */}
//             <div>
//               <label className="block text-gray-700 text-left">
//                 Default Image
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleDefaultImage}
//                 className="w-full border p-2 rounded"
//               />
//               {defaultImage && (
//                 <img
//                   src={URL.createObjectURL(defaultImage)}
//                   alt="Preview"
//                   className="mt-2 w-32 h-32 object-cover rounded"
//                 />
//               )}
//             </div>

//             {/* Gallery Images */}
//             <div>
//               <label className="block text-gray-700 text-left">
//                 Gallery Images
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleGalleryImages}
//                 className="w-full border p-2 rounded"
//               />
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {galleryImages.map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={URL.createObjectURL(img)}
//                     alt="Preview"
//                     className="w-20 h-20 object-cover rounded"
//                   />
//                 ))}
//               </div>
//             </div>

//             <div className="flex justify-end space-x-2 mt-4">
//               <button
//                 type="button"
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//                 onClick={() => document.getElementById("my_modal_4").close()}
//               >
//                 Close
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-brandRed text-white rounded hover:bg-brandRed"
//                 onClick={() => document.getElementById("my_modal_4").close()}
//               >
//                 Save
//               </button>
//             </div>
//           </form>
//         </dialog>
//         {/* </ModalBody>
//         </Modal> */}

//         <NewsTable />
//       </div>
//     </>
//   );
// };

// export default News;


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
            className="bg-brandRed text-white"
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
