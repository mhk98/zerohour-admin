import React, { useState } from "react";
import response from "../utils/demo/tableData";
import { useForm } from "react-hook-form";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Button,
} from "@windmill/react-ui";
import { useUserRegisterMutation } from "../features/auth/auth";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function Students() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [phone, setPhone] = useState("");

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = response.length;

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  // useEffect(() => {
  //   setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage))
  // }, [page])

  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [userRegister] = useUserRegisterMutation();
  const history = useHistory();

  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const First_Name = localStorage.getItem("FirstName");
  const Last_Name = localStorage.getItem("LastName");

  const onFormSubmit = async (data) => {
    const role = "student";
    console.log("formData", data);
    const formData = new FormData();
    formData.append("FirstName", data.FirstName);
    formData.append("LastName", data.LastName);
    formData.append("CreatedOn", `${First_Name} ${Last_Name}`);
    formData.append("Email", data.Email);
    formData.append("Password", data.Password);
    // formData.append("Phone", `${data.CountryCode}${data.Phone}`);
    formData.append("Phone", phone); // phone from PhoneInput state
    formData.append("Branch", data.Branch);
    formData.append("Address", data.Address);
    formData.append("Role", role);
    if (image) {
      formData.append("image", image);
    }

    console.log("formData", formData);

    try {
      const res = await userRegister(formData);
      if (res.data?.success) {
        toast.success(res.data.message);
        setIsModalOpen(false);
      } else {
        toast.error(
          res.error?.data?.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };

  return (
    <>
      {/* <PageTitle>Dashboard</PageTitle> */}
      <div className="w-full px-4 py-6 bg-gray-50">
        <div>
          {/* Left: Title and Subtitle */}
          <div>
            <h4 className="text-2xl md:text-md font-semibold text-gray-900">
              Students
            </h4>
            <p className="text-sm md:text-sm text-gray-500 mt-1">
              Manage your Students and their Profiles
            </p>
          </div>

          {/* Right: Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Request Program Options */}
            <button className="px-4 py-2 bg-white text-brandRed border-2 border-brandRed rounded-md text-sm md:text-base transition">
              <Link to="/app/archive-student">Archived Students</Link>
            </button>

            {/* Register New Student */}
            <button
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-brandRed text-white rounded-md text-sm md:text-base hover:bg-brandRed-700 transition"
            >
              + Register New Student
            </button>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <ModalHeader>Register New Student</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Side */}

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        First Name
                      </label>
                      <Input
                        type="text"
                        {...register("FirstName")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.FirstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.FirstName.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        {...register("LastName")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.LastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.LastName.message}
                        </p>
                      )}
                    </div>

                    {/* <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-700">Mobile Number</label>
                  <Input
                    type="number"
                    {...register("Phone")}
                    onKeyDown =  {handleEnter}
                    className="input input-bordered w-full form-control shadow-md p-3"
                  />
                  {errors.Phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.Phone.message}</p>
                  )}
                </div> */}

                    {/* <div className="mb-4">
              <label className="block text-sm mb-1 text-gray-700">Mobile Number</label>
              <div className="flex">
                <select
                  className="input input-bordered shadow-md p-3 rounded-l-md"
                  style={{ borderRight: "none" }}
                  defaultValue="+880"
                  {...register("CountryCode")}
                >
                  <option value="+880">🇧🇩 +880</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <Input
                  type="tel"
                  {...register("Phone")}
                  onKeyDown={handleEnter}
                  placeholder="1XXXXXXXXX"
                  className="input input-bordered shadow-md p-3 rounded-r-md"
                />
              </div>
              {errors.Phone && <p className="text-red-500 text-sm mt-1">{errors.Phone.message}</p>}
            </div> */}

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Mobile Number
                      </label>
                      <PhoneInput
                        country={"bd"}
                        value={phone}
                        onChange={setPhone}
                        inputProps={{
                          name: "Phone",
                          required: true,
                          className:
                            "w-full px-10 py-3 rounded border border-gray-300 shadow-sm",
                        }}
                        containerStyle={{ width: "100%" }}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Address
                      </label>
                      <Input
                        type="text"
                        {...register("Address")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.Address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.Address.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Email
                      </label>
                      <Input
                        type="email"
                        {...register("Email")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.Email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm text-gray-700 mb-2">
                        Branch
                      </label>
                      <select
                        {...register("Branch")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full shadow-md p-3"
                      >
                        <option value="">Select Branch</option>
                        <option value="Edu Anchor">Edu Anchor</option>
                        <option value="Dhaka">Dhaka</option>
                        <option value="Khulna">Khulna</option>
                        <option value="Barishal">Barishal</option>
                        <option value="Satkhira">Satkhira</option>
                        <option value="Tangail">Tangail</option>
                        <option value="Jashore">Jashore</option>
                        <option value="Rangpur">Rangpur</option>
                        <option value="Dinajpur">Dinajpur</option>
                        <option value="Gopalganj">Gopalganj</option>
                        <option value="Savar">Savar</option>
                        <option value="Feni">Feni</option>
                      </select>
                      {errors.Branch && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.Branch.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Password
                      </label>
                      <Input
                        type="password"
                        {...register("Password")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.Password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.Password.message}
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="font-weight-700">Profile Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        style={{ paddingTop: "12px" }}
                        onChange={handleImageChange}
                      />
                      {/* <input type="file" accept="application/pdf" onChange={handleImageChange} /> */}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <Button type="submit" className="btn bg-brandRed">
                      Save
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </div>
      {/* <CTA /> */}

      {/* <StudentFilter/> */}
    </>
  );
}

export default Students;
