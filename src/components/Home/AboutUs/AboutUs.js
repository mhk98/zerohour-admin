// import React, { useState } from "react";

// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   Input,
//   Button,
// } from "@windmill/react-ui";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";

// import AboutUsTable from "./AboutUsTable";
// import { useCreateAboutUsMutation } from "../../../features/aboutUs/aboutUs";

// function AboutUs() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   function closeModal() {
//     setIsModalOpen(false);
//   }

//   const [file1, setFile1] = useState("");
//   const [file2, setFile2] = useState("");
//   const [file3, setFile3] = useState("");
//   const [image1, setImage1] = useState("");
//   const [image2, setImage2] = useState("");
//   const [image3, setImage3] = useState("");

//   function handleChange1(e) {
//     setFile1(URL.createObjectURL(e.target.files[0]));
//     if (e.target.files && e.target.files.length > 0) {
//       setImage1(e.target.files[0]);
//     }
//   }
//   function handleChange2(e) {
//     setFile2(URL.createObjectURL(e.target.files[0]));
//     if (e.target.files && e.target.files.length > 0) {
//       setImage2(e.target.files[0]);
//     }
//   }
//   function handleChange3(e) {
//     setFile3(URL.createObjectURL(e.target.files[0]));
//     if (e.target.files && e.target.files.length > 0) {
//       setImage3(e.target.files[0]);
//     }
//   }

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   const [createAboutUs] = useCreateAboutUsMutation();

//   const onFormSubmit = async (data) => {
//     console.log("formData", data);
//     const formData = new FormData();
//     formData.append("title", data.title);
//     formData.append("text", data.text);
//     formData.append("subtTitle1", data.subtTitle1);
//     formData.append("subtText1", data.subtText1);
//     formData.append("subtTitle2", data.subtTitle2);
//     formData.append("subtText2", data.subtText2);
//     formData.append("image1", image1);
//     formData.append("image2", image2);
//     formData.append("image3", image3);

//     // If using upload.array('files') or similar in backend

//     try {
//       const res = await createAboutUs(formData);
//       if (res.data?.success) {
//         toast.success(res.data.message);
//         reset();
//         setIsModalOpen(false);
//       } else {
//         toast.error(res.error?.data?.message || "Failed. Please try again.");
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred.");
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
//     <>
//       {/* <PageTitle>Dashboard</PageTitle> */}
//       <div className="w-full px-4 py-6 bg-gray-50">
//         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           {/* Header Section */}
//           <div>
//             <h4 className="text-2xl md:text-md font-semibold text-gray-900">
//               About Us
//             </h4>

//             {/* Modal */}
//             <Modal isOpen={isModalOpen} onClose={closeModal}>
//               <ModalHeader>About Us</ModalHeader>
//               <ModalBody>
//                 <form onSubmit={handleSubmit(onFormSubmit)}>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {/* Left Side */}

//                     <div className="mb-4">
//                       <label className="block text-sm mb-1 text-gray-700">
//                         Title
//                       </label>
//                       <Input
//                         type="text"
//                         {...register("title")}
//                         onKeyDown={handleEnter}
//                         className="input input-bordered w-full form-control shadow-md p-3"
//                       />
//                       {errors.title && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {errors.title.message}
//                         </p>
//                       )}
//                     </div>

//                     <div className="mb-4">
//                       <label className="block text-sm mb-1 text-gray-700">
//                         Text
//                       </label>
//                       <textarea
//                         rows={4}
//                         {...register("text")}
//                         className="textarea textarea-bordered w-full shadow-md p-3"
//                       ></textarea>
//                       {errors.text && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {errors.text.message}
//                         </p>
//                       )}
//                     </div>

//                     <div className="mb-4">
//                       <label className="block text-sm mb-1 text-gray-700">
//                         Subtitle 1
//                       </label>
//                       <Input
//                         type="text"
//                         {...register("subTitle1")}
//                         onKeyDown={handleEnter}
//                         className="input input-bordered w-full form-control shadow-md p-3"
//                       />
//                       {errors.subTitle1 && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {errors.subTitle1.message}
//                         </p>
//                       )}
//                     </div>

//                     <div className="mb-4">
//                       <label className="block text-sm mb-1 text-gray-700">
//                         Subtext 1
//                       </label>
//                       <textarea
//                         rows={4}
//                         {...register("subText1")}
//                         className="textarea textarea-bordered w-full shadow-md p-3"
//                       ></textarea>
//                       {errors.subText1 && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {errors.subText1.message}
//                         </p>
//                       )}
//                     </div>

//                     <div className="mb-4">
//                       <label className="block text-sm mb-1 text-gray-700">
//                         Subtitle 2
//                       </label>
//                       <Input
//                         type="text"
//                         {...register("subTitle2")}
//                         onKeyDown={handleEnter}
//                         className="input input-bordered w-full form-control shadow-md p-3"
//                       />
//                       {errors.subTitle2 && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {errors.subTitle2.message}
//                         </p>
//                       )}
//                     </div>

//                     <div className="mb-4">
//                       <label className="block text-sm mb-1 text-gray-700">
//                         Subtext 2
//                       </label>
//                       <textarea
//                         rows={4}
//                         {...register("subText2")}
//                         className="textarea textarea-bordered w-full shadow-md p-3"
//                       ></textarea>
//                       {errors.subText2 && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {errors.subText2.message}
//                         </p>
//                       )}
//                     </div>

//                     <div className="form-group">
//                       <label className="block text-sm mb-2 text-gray-700">
//                         Image 1
//                       </label>
//                       <input
//                         style={{ cursor: "pointer" }}
//                         accept="image/*"
//                         type="file"
//                         onChange={handleChange1}
//                       />
//                       {/* <img className="mt-2" src={file1} alt="" /> */}
//                     </div>
//                     <div className="form-group">
//                       <label className="block text-sm mb-2 text-gray-700">
//                         Image 2
//                       </label>
//                       <input
//                         style={{ cursor: "pointer" }}
//                         accept="image/*"
//                         type="file"
//                         onChange={handleChange2}
//                       />
//                       {/* <img className="mt-2" src={file2} alt="" /> */}
//                     </div>
//                     <div className="form-group">
//                       <label className="block text-sm mb-2 text-gray-700">
//                         Image 3
//                       </label>
//                       <input
//                         style={{ cursor: "pointer" }}
//                         accept="image/*"
//                         type="file"
//                         onChange={handleChange3}
//                       />
//                       {/* <img className="mt-2" src={file3} alt="" /> */}
//                     </div>
//                   </div>

//                   <div className="flex justify-end gap-2 mt-6">
//                     <Button type="submit" className="btn bg-brandRed">
//                       Save
//                     </Button>
//                   </div>
//                 </form>
//               </ModalBody>
//             </Modal>
//           </div>

//           {/* Right Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3">
//             <button
//               onClick={() => {
//                 setIsModalOpen(true);
//               }}
//               className="px-4 py-2 bg-brandRed text-white rounded-md text-sm md:text-base hover:bg-brandRed-700 transition"
//             >
//               + Add About Us
//             </button>
//           </div>
//         </div>
//       </div>
//       {/* <CTA /> */}

//       <AboutUsTable />
//       {/* <UserManagementTable/> */}
//     </>
//   );
// }

// export default AboutUs;

import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Button,
} from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import AboutUsTable from "./AboutUsTable";
import { useCreateAboutUsMutation } from "../../../features/aboutUs/aboutUs";

function AboutUs() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [file1, setFile1] = useState("");
  const [file2, setFile2] = useState("");
  const [file3, setFile3] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [createAboutUs] = useCreateAboutUsMutation();

  const closeModal = () => setIsModalOpen(false);

  const clearImages = () => {
    setFile1("");
    setFile2("");
    setFile3("");
    setImage1("");
    setImage2("");
    setImage3("");
  };

  const handleImageChange = (e, setFile, setImage) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };

  const onFormSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("text", data.text);
    formData.append("subTitle1", data.subTitle1);
    formData.append("subText1", data.subText1);
    formData.append("subTitle2", data.subTitle2);
    formData.append("subText2", data.subText2);
    formData.append("image1", image1);
    formData.append("image2", image2);
    formData.append("image3", image3);

    try {
      const res = await createAboutUs(formData);
      if ("data" in res && res.data?.success) {
        toast.success(res.data.message || "About Us created successfully!");
        reset();
        clearImages();
        closeModal();
      } else {
        toast.error(res.error?.data?.message || "Submission failed.");
      }
    } catch (error) {
      toast.error("Unexpected error occurred.");
    }
  };

  return (
    <>
      <div className="w-full px-4 py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h4 className="text-2xl font-semibold text-gray-900">About Us</h4>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <ModalHeader>About Us</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Title
                      </label>
                      <Input
                        type="text"
                        {...register("title", {
                          required: "Title is required",
                        })}
                        onKeyDown={handleEnter}
                        className="shadow-md p-3"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Text
                      </label>
                      <textarea
                        rows={4}
                        {...register("text", { required: "Text is required" })}
                        className="textarea w-full shadow-md p-3"
                      />
                      {errors.text && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.text.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Subtitle 1
                      </label>
                      <Input
                        type="text"
                        {...register("subTitle1", {
                          required: "Subtitle 1 is required",
                        })}
                        onKeyDown={handleEnter}
                        className="shadow-md p-3"
                      />
                      {errors.subTitle1 && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.subTitle1.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Subtext 1
                      </label>
                      <textarea
                        rows={4}
                        {...register("subText1", {
                          required: "Subtext 1 is required",
                        })}
                        className="textarea w-full shadow-md p-3"
                      />
                      {errors.subText1 && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.subText1.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Subtitle 2
                      </label>
                      <Input
                        type="text"
                        {...register("subTitle2", {
                          required: "Subtitle 2 is required",
                        })}
                        onKeyDown={handleEnter}
                        className="shadow-md p-3"
                      />
                      {errors.subTitle2 && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.subTitle2.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Subtext 2
                      </label>
                      <textarea
                        rows={4}
                        {...register("subText2", {
                          required: "Subtext 2 is required",
                        })}
                        className="textarea w-full shadow-md p-3"
                      />
                      {errors.subText2 && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.subText2.message}
                        </p>
                      )}
                    </div>

                    {/* Image Uploads */}
                    <div>
                      <label className="block text-sm mb-2 text-gray-700">
                        Image 1
                      </label>
                      <input
                        accept="image/*"
                        type="file"
                        onChange={(e) =>
                          handleImageChange(e, setFile1, setImage1)
                        }
                        className="mb-2"
                      />
                      {file1 && (
                        <img
                          src={file1}
                          alt="Preview 1"
                          className="w-24 h-24 object-cover"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-700">
                        Image 2
                      </label>
                      <input
                        accept="image/*"
                        type="file"
                        onChange={(e) =>
                          handleImageChange(e, setFile2, setImage2)
                        }
                        className="mb-2"
                      />
                      {file2 && (
                        <img
                          src={file2}
                          alt="Preview 2"
                          className="w-24 h-24 object-cover"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-700">
                        Image 3
                      </label>
                      <input
                        accept="image/*"
                        type="file"
                        onChange={(e) =>
                          handleImageChange(e, setFile3, setImage3)
                        }
                        className="mb-2"
                      />
                      {file3 && (
                        <img
                          src={file3}
                          alt="Preview 3"
                          className="w-24 h-24 object-cover"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <Button type="submit" className="bg-brandRed text-white">
                      Save
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </Modal>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-brandRed text-white rounded-md hover:bg-red-700 transition"
            >
              + Add About Us
            </button>
          </div>
        </div>
      </div>

      <AboutUsTable />
    </>
  );
}

export default AboutUs;
