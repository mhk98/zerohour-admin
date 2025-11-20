// import React, { useEffect, useState } from "react";
// import { FaTrash } from "react-icons/fa";
// import { LiaEditSolid } from "react-icons/lia";
// import { useForm } from "react-hook-form";
// import {
//   useGetAllAboutUsQuery,
//   useUpdateAboutUsMutation,
//   useDeleteAboutUsMutation,
// } from "../../../features/aboutUs/aboutUs";
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   Input,
//   Button,
// } from "@windmill/react-ui";
// import toast from "react-hot-toast";

// export default function AboutUsTable() {
//   const { data, isLoading, isError, error } = useGetAllAboutUsQuery({});
//   const [aboutUs, setAboutUs] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);
//   const [file1, setFile1] = useState("");
//   const [file2, setFile2] = useState("");
//   const [file3, setFile3] = useState("");
//   const [image1, setImage1] = useState("");
//   const [image2, setImage2] = useState("");
//   const [image3, setImage3] = useState("");

//   const [updateAboutUs] = useUpdateAboutUsMutation();
//   const [deleteAboutUs] = useDeleteAboutUsMutation();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   useEffect(() => {
//     if (isError) {
//       console.log("Error fetching", error);
//     } else if (!isLoading && data) {
//       setAboutUs(data?.data);
//     }
//   }, [data, isLoading, isError, error]);

//   const handleChange1 = (e) => {
//     setFile1(URL.createObjectURL(e.target.files[0]));
//     setImage1(e.target.files[0]);
//   };
//   const handleChange2 = (e) => {
//     setFile2(URL.createObjectURL(e.target.files[0]));
//     setImage2(e.target.files[0]);
//   };
//   const handleChange3 = (e) => {
//     setFile3(URL.createObjectURL(e.target.files[0]));
//     setImage3(e.target.files[0]);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     reset();
//     setFile1("");
//     setFile2("");
//     setFile3("");
//     setImage1("");
//     setImage2("");
//     setImage3("");
//   };

//   const onFormEdit = async (formDataInput) => {
//     const formData = new FormData();
//     formData.append("title", formDataInput.title);
//     formData.append("text", formDataInput.text);
//     formData.append("subtTitle1", formDataInput.subtTitle1);
//     formData.append("subtText1", formDataInput.subtText1);
//     formData.append("subtTitle2", formDataInput.subtTitle2);
//     formData.append("subtText2", formDataInput.subtText2);
//     if (image1) formData.append("image1", image1);
//     if (image2) formData.append("image2", image2);
//     if (image3) formData.append("image3", image3);

//     try {
//       const res = await updateAboutUs({ id: selectedId, data: formData });
//       if (res.data?.success) {
//         toast.success(res.data.message);
//         closeModal();
//       } else {
//         toast.error(res.error?.data?.message || "Failed to update.");
//       }
//     } catch {
//       toast.error("An unexpected error occurred.");
//     }
//   };

//   const handleEdit = (item) => {
//     setSelectedId(item.id);
//     setFile1(item.image1);
//     setFile2(item.image2);
//     setFile3(item.image3);
//     setIsModalOpen(true);
//     reset({
//       title: item.title,
//       text: item.text,
//       subtTitle1: item.subtTitle1,
//       subtText1: item.subtText1,
//       subtTitle2: item.subtTitle2,
//       subtText2: item.subtText2,
//     });
//   };

//   const handleDelete = async (id) => {
//     try {
//       const res = await deleteAboutUs(id);
//       if (res.data?.success) {
//         toast.success(res.data.message);
//       } else {
//         toast.error("Failed to delete.");
//       }
//     } catch {
//       toast.error("Unexpected error during delete.");
//     }
//   };

//   const handleEnter = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const form = e.target.form;
//       const index = Array.prototype.indexOf.call(form, e.target);
//       form.elements[index + 1]?.focus();
//     }
//   };

//   return (
//     <div className="w-full px-4 py-6 bg-gray-50">
//       <div>
//         <h4 className="text-2xl font-semibold text-gray-900">About Us</h4>
//       </div>

//       <div className="overflow-x-auto p-4">
//         <table className="min-w-full w-full border border-gray-200 bg-white shadow-md rounded-lg">
//           <thead className="bg-gray-100 text-sm text-gray-700">
//             <tr>
//               <th className="p-3">Title</th>
//               <th className="p-3">Text</th>
//               <th className="p-3">SubTitle 1</th>
//               <th className="p-3">SubText 1</th>
//               <th className="p-3">SubTitle 2</th>
//               <th className="p-3">SubText 2</th>
//               <th className="p-3">Image 1</th>
//               <th className="p-3">Image 2</th>
//               <th className="p-3">Image 3</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {aboutUs.length > 0 ? (
//               aboutUs.map((item, idx) => (
//                 <tr
//                   key={item.id}
//                   className={`text-sm border-t border-gray-200 ${
//                     idx % 2 === 0 ? "bg-gray-50" : "bg-white"
//                   }`}
//                 >
//                   <td className="p-3">{item.title}</td>
//                   <td className="p-3">{item.text}</td>
//                   <td className="p-3">{item.subTitle1}</td>
//                   <td className="p-3">{item.subText1}</td>
//                   <td className="p-3">{item.subTitle2}</td>
//                   <td className="p-3">{item.subText2}</td>
//                   <td className="p-3">
//                     <img
//                       className="mt-2"
//                       src={`http://localhost:5000${item.image1}`}
//                       alt=""
//                     />
//                   </td>
//                   <td className="p-3">
//                     <img
//                       className="mt-2"
//                       src={`http://localhost:5000${item.image2}`}
//                       alt=""
//                     />
//                   </td>
//                   <td className="p-3">
//                     <img
//                       className="mt-2"
//                       src={`http://localhost:5000${item.image3}`}
//                       alt=""
//                     />
//                   </td>
//                   <td className="p-3 flex gap-3">
//                     <LiaEditSolid
//                       onClick={() => handleEdit(item)}
//                       className="cursor-pointer text-blue-600"
//                     />
//                     <FaTrash
//                       onClick={() => handleDelete(item.id)}
//                       className="cursor-pointer text-red-500"
//                     />
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center p-4 text-gray-500">
//                   No About Us entries found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal */}
//       <Modal isOpen={isModalOpen} onClose={closeModal}>
//         <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
//           <ModalHeader>
//             {selectedId ? "Edit About Us" : "Add About Us"}
//           </ModalHeader>
//           <ModalBody>
//             <form onSubmit={handleSubmit(onFormEdit)} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="mb-4">
//                   <label className="block text-sm mb-1 text-gray-700">
//                     Title
//                   </label>
//                   <Input
//                     type="text"
//                     {...register("title")}
//                     onKeyDown={handleEnter}
//                     className="input input-bordered w-full form-control shadow-md p-3"
//                   />
//                   {errors.title && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.title.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm mb-1 text-gray-700">
//                     Text
//                   </label>
//                   <textarea
//                     rows={4}
//                     {...register("text")}
//                     className="textarea textarea-bordered w-full shadow-md p-3"
//                   ></textarea>
//                   {errors.text && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.text.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm mb-1 text-gray-700">
//                     Subtitle 1
//                   </label>
//                   <Input
//                     type="text"
//                     {...register("subTitle1")}
//                     onKeyDown={handleEnter}
//                     className="input input-bordered w-full form-control shadow-md p-3"
//                   />
//                   {errors.subTitle1 && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.subTitle1.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm mb-1 text-gray-700">
//                     Subtext 1
//                   </label>
//                   <textarea
//                     rows={4}
//                     {...register("subText1")}
//                     className="textarea textarea-bordered w-full shadow-md p-3"
//                   ></textarea>
//                   {errors.subText1 && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.subText1.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm mb-1 text-gray-700">
//                     Subtitle 2
//                   </label>
//                   <Input
//                     type="text"
//                     {...register("subTitle2")}
//                     onKeyDown={handleEnter}
//                     className="input input-bordered w-full form-control shadow-md p-3"
//                   />
//                   {errors.subTitle2 && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.subTitle2.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm mb-1 text-gray-700">
//                     Subtext 2
//                   </label>
//                   <textarea
//                     rows={4}
//                     {...register("subText2")}
//                     className="textarea textarea-bordered w-full shadow-md p-3"
//                   ></textarea>
//                   {errors.subText2 && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.subText2.message}
//                     </p>
//                   )}
//                 </div>
//                 {/* Image Inputs */}
//                 <div>
//                   <label className="text-sm text-gray-700">Image 1</label>{" "}
//                   <br />
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleChange1}
//                   />
//                   {file1 && (
//                     <img
//                       src={`http://localhost:5000${file1}`}
//                       alt="Image1"
//                       className="w-32 mt-2"
//                     />
//                   )}
//                 </div>

//                 <div>
//                   <label className="text-sm text-gray-700">Image 2</label>
//                   <br />
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleChange2}
//                   />
//                   {file2 && (
//                     <img
//                       src={`http://localhost:5000${file2}`}
//                       alt="Image2"
//                       className="w-32 mt-2"
//                     />
//                   )}
//                 </div>

//                 <div>
//                   <label className="text-sm text-gray-700">Image 3</label>
//                   <br />
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleChange3}
//                   />
//                   {file3 && (
//                     <img
//                       src={`http://localhost:5000${file3}`}
//                       alt="Image3"
//                       className="w-32 mt-2"
//                     />
//                   )}
//                 </div>
//               </div>

//               <div className="flex justify-end mt-6">
//                 <Button type="submit" className="bg-brandRed text-white">
//                   Save
//                 </Button>
//               </div>
//             </form>
//           </ModalBody>
//         </div>
//       </Modal>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { LiaEditSolid } from "react-icons/lia";
import { useForm } from "react-hook-form";
import {
  useGetAllAboutUsQuery,
  useUpdateAboutUsMutation,
  useDeleteAboutUsMutation,
} from "../../../features/aboutUs/aboutUs";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Button,
} from "@windmill/react-ui";
import toast from "react-hot-toast";

export default function AboutUsTable() {
  const { data, isLoading, isError, error } = useGetAllAboutUsQuery({});
  const [aboutUs, setAboutUs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [file1, setFile1] = useState("");
  const [file2, setFile2] = useState("");
  const [file3, setFile3] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");

  const [updateAboutUs] = useUpdateAboutUsMutation();
  const [deleteAboutUs] = useDeleteAboutUsMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!isLoading && data?.data) {
      setAboutUs(data.data);
    }
  }, [data, isLoading]);

  const handleChange1 = (e) => {
    const file = e.target.files[0];
    setFile1(URL.createObjectURL(file));
    setImage1(file);
  };
  const handleChange2 = (e) => {
    const file = e.target.files[0];
    setFile2(URL.createObjectURL(file));
    setImage2(file);
  };
  const handleChange3 = (e) => {
    const file = e.target.files[0];
    setFile3(URL.createObjectURL(file));
    setImage3(file);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
    reset();
    setFile1("");
    setFile2("");
    setFile3("");
    setImage1("");
    setImage2("");
    setImage3("");
  };

  const onFormEdit = async (formDataInput) => {
    const formData = new FormData();
    formData.append("title", formDataInput.title);
    formData.append("text", formDataInput.text);
    formData.append("subTitle1", formDataInput.subTitle1);
    formData.append("subText1", formDataInput.subText1);
    formData.append("subTitle2", formDataInput.subTitle2);
    formData.append("subText2", formDataInput.subText2);
    if (image1) formData.append("image1", image1);
    if (image2) formData.append("image2", image2);
    if (image3) formData.append("image3", image3);

    try {
      const res = await updateAboutUs({ id: selectedId, data: formData });
      if (res.data?.success) {
        toast.success(res.data.message);
        closeModal();
      } else {
        toast.error(res.error?.data?.message || "Failed to update.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleEdit = (item) => {
    setSelectedId(item.id);
    setFile1(item.image1);
    setFile2(item.image2);
    setFile3(item.image3);
    setIsModalOpen(true);
    reset({
      title: item.title,
      text: item.text,
      subTitle1: item.subTitle1,
      subText1: item.subText1,
      subTitle2: item.subTitle2,
      subText2: item.subText2,
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteAboutUs(id);
      if (res.data?.success) {
        toast.success(res.data.message);
      } else {
        toast.error("Failed to delete.");
      }
    } catch {
      toast.error("Unexpected error during delete.");
    }
  };

  const isBlobUrl = (url) => url.startsWith("blob:");

  return (
    <div className="w-full px-4 py-6 bg-gray-50">
      <h4 className="text-2xl font-semibold text-gray-900">About Us</h4>

      <div className="overflow-x-auto p-4">
        <table className="min-w-full w-full border border-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Text</th>
              <th className="p-3">SubTitle 1</th>
              <th className="p-3">SubText 1</th>
              <th className="p-3">SubTitle 2</th>
              <th className="p-3">SubText 2</th>
              <th className="p-3">Image 1</th>
              <th className="p-3">Image 2</th>
              <th className="p-3">Image 3</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {aboutUs.length > 0 ? (
              aboutUs.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`text-sm border-t border-gray-200 ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.text}</td>
                  <td className="p-3">{item.subTitle1}</td>
                  <td className="p-3">{item.subText1}</td>
                  <td className="p-3">{item.subTitle2}</td>
                  <td className="p-3">{item.subText2}</td>
                  <td className="p-3">
                    <img
                      className="w-20 h-auto"
                      src={`http://localhost:5000${item.image1}`}
                      alt="img1"
                    />
                  </td>
                  <td className="p-3">
                    <img
                      className="w-20 h-auto"
                      src={`http://localhost:5000${item.image2}`}
                      alt="img2"
                    />
                  </td>
                  <td className="p-3">
                    <img
                      className="w-20 h-auto"
                      src={`http://localhost:5000${item.image3}`}
                      alt="img3"
                    />
                  </td>
                  <td className="p-3 flex gap-3">
                    <LiaEditSolid
                      onClick={() => handleEdit(item)}
                      className="cursor-pointer text-blue-600"
                    />
                    <FaTrash
                      onClick={() => handleDelete(item.id)}
                      className="cursor-pointer text-red-500"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4 text-gray-500">
                  No entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Editing */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>
          {selectedId ? "Edit About Us" : "Add About Us"}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onFormEdit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Text Fields */}
              <div>
                <label className="block text-sm mb-1">Title</label>
                <Input
                  {...register("title", { required: "Title is required" })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Text</label>
                <textarea
                  {...register("text", { required: "Text is required" })}
                  className="textarea w-full"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">SubTitle 1</label>
                <Input {...register("subTitle1")} />
              </div>

              <div>
                <label className="block text-sm mb-1">SubText 1</label>
                <textarea
                  {...register("subText1")}
                  className="textarea w-full"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">SubTitle 2</label>
                <Input {...register("subTitle2")} />
              </div>

              <div>
                <label className="block text-sm mb-1">SubText 2</label>
                <textarea
                  {...register("subText2")}
                  className="textarea w-full"
                />
              </div>

              {/* Image Uploads */}
              <div>
                <label className="text-sm">Image 1</label>
                <input type="file" accept="image/*" onChange={handleChange1} />
                {file1 && (
                  <img
                    src={
                      isBlobUrl(file1)
                        ? file1
                        : `http://localhost:5000${file1}`
                    }
                    alt="img1"
                    className="w-24 mt-2"
                  />
                )}
              </div>

              <div>
                <label className="text-sm">Image 2</label>
                <input type="file" accept="image/*" onChange={handleChange2} />
                {file2 && (
                  <img
                    src={
                      isBlobUrl(file2)
                        ? file2
                        : `http://localhost:5000${file2}`
                    }
                    alt="img2"
                    className="w-24 mt-2"
                  />
                )}
              </div>

              <div>
                <label className="text-sm">Image 3</label>
                <input type="file" accept="image/*" onChange={handleChange3} />
                {file3 && (
                  <img
                    src={
                      isBlobUrl(file3)
                        ? file3
                        : `http://localhost:5000${file3}`
                    }
                    alt="img3"
                    className="w-24 mt-2"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button type="submit" className="bg-brandRed text-white">
                Save
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
