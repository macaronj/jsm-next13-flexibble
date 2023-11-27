"use client";
import { ProjectInterface, SessionInterface } from "@/common.types";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import Formfield from "./Formfield";
import { categoryFilters } from "@/constant";
import CustomMenu from "./CustomMenu";
import Button from "./Button";
import {
  createNewProject,
  fetchToken,
  getProjectDetails,
  updateProject,
} from "@/lib/actions";
import { useRouter } from "next/navigation";

type Props = {
  type: string;
  session: SessionInterface;
  project?: ProjectInterface;
};

const ProjectForm = ({ type, session, project }: Props) => {
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    const { token } = await fetchToken();

    try {
      if (type === "create") {
        await createNewProject(form, session?.user?.id, token);

        router.push("/");
      }
      if (type === "edit") {
        await updateProject(form, project?.id as string, token);

        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.includes("image")) {
      return alert("Please upload an Image.");
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result as string;

      handleStateChange("image", result);
    };
  };

  const handleStateChange = (fieldName: string, value: string) => {
    setForm((prevState) => ({ ...prevState, [fieldName]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: project?.title || "",
    description: project?.description || "",
    image: project?.image || "",
    liveUrl: project?.liveUrl || "",
    githubUrl: project?.githubUrl || "",
    category: project?.category || "",
  });

  return (
    <form onSubmit={handleFormSubmit} className="flexStart form">
      <div className="flexStart form_image-container">
        <label htmlFor="poster" className="flexCenter form_image-label">
          {!form.image && "Choose a poster for your project"}
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          required={type === "create"}
          className="form_image-input"
          onChange={handleChangeImage}
        />
        {form.image && (
          <Image
            src={form?.image}
            className="sm:p-10 object-contain z-20"
            alt="Project poster"
            fill
          />
        )}
      </div>
      <Formfield
        title="Title"
        state={form.title}
        placeholder="Flxbbl"
        setState={(value) => handleStateChange("title", value)}
      />

      <Formfield
        title="Description"
        state={form.description}
        placeholder="Describe your project"
        setState={(value) => handleStateChange("description", value)}
      />

      <Formfield
        type="url"
        title="Website Url"
        state={form.liveUrl}
        placeholder="https://example.com"
        setState={(value) => handleStateChange("liveUrl", value)}
      />

      <Formfield
        type="url"
        title="GitHub Url"
        state={form.githubUrl}
        placeholder="https://github.com/username"
        setState={(value) => handleStateChange("githubUrl", value)}
      />

      <CustomMenu
        title="category"
        state={form.category}
        filters={categoryFilters}
        setState={(value) => handleStateChange("category", value)}
      />

      <div className="flexStart w-full">
        <Button
          title={
            isSubmitting
              ? `${type === "create" ? "Creating" : "Editing"}`
              : `${type === "create" ? "Create" : "Edit"}`
          }
          type="submit"
          leftIcon={isSubmitting ? "" : "/plus.svg"}
          submitting={isSubmitting}
        ></Button>
      </div>
    </form>
  );
};

export default ProjectForm;
