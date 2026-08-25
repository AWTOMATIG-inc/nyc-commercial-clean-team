"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuidv4 } from "uuid";
import InputBox from "@/components/InputBox";
import SelectBox from "@/components/SelectBox";
import { pageYupSchema } from "@/yup/pageYupSchema";

const defaultStats = [
  { id: "10001", title: "PROJECTS COMPLETED", number: "200", suffix: "+" },
  { id: "10002", title: "FAST QUOTING", number: "24", suffix: "Hrs" },
  { id: "10003", title: "LICENSED & INSURED", number: "100", suffix: "%" },
  { id: "10004", title: "HAPPY CUSTOMERS", number: "98", suffix: "%" },
];

export default function PageForm({ pagesData, pageNames }) {
  const [loading, setLoading] = useState(false);
  const beforeRef = useRef(null);
  const afterRef = useRef(null);
  const [feature, setFeature] = useState("");
  const [compareCard, setCompareCard] = useState({
    title: "",
    beforeImage: "",
    afterImage: "",
  });

  const [stats, setStats] = useState({
    title: "",
    number: "",
    suffix: "",
  });

  const [features, setFeatures] = useState(pagesData?.features || []);
  const [comparedList, setComparedList] = useState(pagesData?.facilities || []);
  const [statsList, setStatsList] = useState(pagesData?.stats || []);
  const [bannerImage, setBannerImage] = useState(pagesData?.bannerImage || "");

  const path = usePathname();
  const isEdit = path.includes("edit");
  const router = useRouter();

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pageName: pagesData?.pageName || "",
      title: pagesData?.title || "",
      subTitle: pagesData?.subTitle || "",
      shortDescription: pagesData?.shortDescription || "",
    },
    resolver: yupResolver(pageYupSchema()),
  });

  const onSubmit = async (e) => {
    const formData = new FormData();
    formData.append("pageName", e.pageName);
    formData.append("title", e.title);
    formData.append("subTitle", e.subTitle);
    formData.append("shortDescription", e.shortDescription);

    if (comparedList.length === 0)
      return toast.error("Compare list is required");

    formData.append("facilities", JSON.stringify(comparedList));

    if (statsList.length === 0) return toast.error("Stats section is required");

    formData.append("stats", JSON.stringify(statsList));

    if (features.length === 0) return toast.error("Features are required");

    formData.append("features", JSON.stringify(features));

    if (!bannerImage) return toast.error("Banner Image is required");

    formData.append("bannerImage", bannerImage);

    setLoading(true);

    if (isEdit) {
      try {
        const res = await fetch(`/api/pages/${pagesData?._id}`, {
          method: "PUT",
          body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          reset();
          toast.success("Page updated successfully!");
          router.push("/dashboard/pages");
        } else {
          toast.error(data?.error || "Update failed");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await fetch("/api/pages", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          reset();
          setStatsList([]);
          setFeatures([]);
          setComparedList([]);
          setBannerImage("");
          toast.success("Page created successfully!");
          router.push("/dashboard/pages");
        } else {
          toast.error(data?.error || "Page creation failed");
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const removeImage = async (image) => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    try {
      await fetch(`/api/image-uploader`, {
        method: "DELETE",
        body: formData,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const imageUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);
    try {
      const res = await fetch("/api/image-uploader", {
        method: "POST",
        body: formData,
      });
      const imageUrl = await res.json();
      setLoading(false);
      return imageUrl.image;
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleCamparedCard = async () => {
    const { title, afterImage, beforeImage } = compareCard;
    if (!title || !afterImage || !beforeImage) {
      return toast.error("Title, before and after images are required!");
    }
    const afterImageU = await imageUpload(afterImage);
    const beforeImageU = await imageUpload(beforeImage);
    setComparedList((prev) => [
      ...prev,
      {
        id: uuidv4(),
        title,
        afterImage: afterImageU,
        beforeImage: beforeImageU,
      },
    ]);
    if (afterRef.current) afterRef.current.value = "";
    if (beforeRef.current) beforeRef.current.value = "";
    setCompareCard({ id: "", title: "", beforeImage: "", afterImage: "" });
  };

  const handleBannner = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (bannerImage) {
      await removeImage(bannerImage);
    }
    const image = await imageUpload(file);
    setBannerImage(image);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-inter">
      {/* Loading Overlay */}
      {loading && (
        <div className="bg-slate-900/50 backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#ed0505] border-t-transparent animate-spin" />
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-jetbrains tracking-tight">
            {isEdit ? "Edit Dynamic Page" : "Create New Dynamic Page"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure dynamic commercial page content, features, and specs.
          </p>
        </div>

        <Link
          className="flex items-center gap-2 px-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 font-bold transition-all shadow-2xs w-fit"
          href="/dashboard/pages"
        >
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          <span>Back to Pages</span>
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Basic Page Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
              <Icon icon="lucide:layers" className="w-4 h-4 text-[#1d2f64]" />
              <span>1. Basic Page Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="pageName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <SelectBox
                    label="Page Name Identifier"
                    placeholder="Select Page Name"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    required
                    options={pageNames}
                    error={errors?.pageName?.message}
                  />
                )}
              />

              <InputBox
                label="Page Main Title"
                required={true}
                error={errors.title?.message}
                {...register("title")}
              />
              <InputBox
                label="SubTitle"
                required={true}
                error={errors.subTitle?.message}
                {...register("subTitle")}
              />
              <InputBox
                label="Short Description"
                required={true}
                error={errors?.shortDescription?.message}
                {...register("shortDescription")}
              />
            </div>
          </div>

          {/* Section 2: Banner & Features */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
              <Icon icon="lucide:image" className="w-4 h-4 text-[#1d2f64]" />
              <span>2. Banner Image & Key Features</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Banner Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Banner Hero Image <span className="text-[#ed0505]">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannner}
                  className="w-full px-4 py-2.5 text-xs bg-white border border-slate-300 hover:border-slate-400 rounded-xl focus:outline-none focus:border-[#1d2f64] text-slate-700 cursor-pointer shadow-2xs"
                />

                <div className="min-h-32 bg-slate-50 border border-slate-300 rounded-xl p-3 flex items-center justify-center">
                  {bannerImage ? (
                    <div className="relative group">
                      <Image
                        src={`/api/uploads/page/${bannerImage}`}
                        alt="Banner Preview"
                        width={220}
                        height={120}
                        className="rounded-lg object-cover border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          removeImage(bannerImage);
                          setBannerImage("");
                        }}
                        className="absolute -top-2 -right-2 bg-rose-600 text-white p-1 rounded-full shadow-md hover:bg-rose-700 transition-colors"
                        title="Remove Image"
                      >
                        <Icon icon="lucide:x" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">No banner image uploaded</span>
                  )}
                </div>
              </div>

              {/* Key Features Tags */}
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <InputBox
                      label="Add Key Feature Tag"
                      value={feature}
                      onChange={(e) => setFeature(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!feature.trim()) return;
                      setFeatures((prev) => [
                        ...prev,
                        { id: uuidv4(), name: feature.trim() },
                      ]);
                      setFeature("");
                    }}
                    className="px-4 py-3 bg-[#1d2f64] hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all shadow-2xs shrink-0"
                  >
                    Add
                  </button>
                </div>

                <div className="min-h-32 bg-slate-50 border border-slate-300 rounded-xl p-3 flex flex-wrap gap-2 items-start">
                  {features.length === 0 ? (
                    <span className="text-xs text-slate-400 font-medium w-full text-center py-4">
                      No feature tags added yet
                    </span>
                  ) : (
                    features.map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1.5 bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs"
                      >
                        <span>{item.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFeatures((prev) =>
                              prev.filter((f) => f.id !== item.id)
                            )
                          }
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Icon icon="lucide:x" className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Compare Showcase */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
              <Icon icon="lucide:columns" className="w-4 h-4 text-[#1d2f64]" />
              <span>3. Before & After Facility Showcase Cards</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputBox
                label="Showcase Title"
                value={compareCard.title}
                onChange={(e) =>
                  setCompareCard((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Before Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={beforeRef}
                  onChange={(e) =>
                    setCompareCard((prev) => ({
                      ...prev,
                      beforeImage: e.target.files[0],
                    }))
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 hover:border-slate-400 rounded-xl cursor-pointer shadow-2xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  After Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={afterRef}
                  onChange={(e) =>
                    setCompareCard((prev) => ({
                      ...prev,
                      afterImage: e.target.files[0],
                    }))
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 hover:border-slate-400 rounded-xl cursor-pointer shadow-2xs"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCamparedCard}
                className="px-4 py-2.5 bg-[#1d2f64] hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all shadow-2xs"
              >
                Add Showcase Card
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 border border-slate-300 rounded-xl p-4 min-h-32">
              {comparedList.length === 0 ? (
                <span className="text-xs text-slate-400 font-medium col-span-full text-center py-4">
                  No compare showcase cards added yet
                </span>
              ) : (
                comparedList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-300 rounded-xl p-2 relative shadow-2xs"
                  >
                    <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden border border-slate-200">
                      <Image
                        src={`/api/uploads/page/${item.beforeImage}`}
                        alt="before"
                        width={100}
                        height={120}
                        className="object-cover w-full h-24"
                      />
                      <Image
                        src={`/api/uploads/page/${item.afterImage}`}
                        alt="after"
                        width={100}
                        height={120}
                        className="object-cover w-full h-24"
                      />
                    </div>
                    <p className="text-xs font-bold text-slate-900 text-center mt-2 truncate">
                      {item.title}
                    </p>
                    <button
                      type="button"
                      onClick={async () => {
                        await removeImage(item.afterImage);
                        await removeImage(item.beforeImage);
                        setComparedList((prev) =>
                          prev.filter((f) => f.id !== item.id)
                        );
                      }}
                      className="absolute -top-2 -right-2 bg-rose-600 text-white p-1 rounded-full shadow-md hover:bg-rose-700 transition-colors"
                    >
                      <Icon icon="lucide:x" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 4: Performance Statistics */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Icon icon="lucide:bar-chart-3" className="w-4 h-4 text-[#1d2f64]" />
                <span>4. Performance Statistics Section</span>
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stats-default"
                  className="rounded border-slate-300 text-[#ed0505] focus:ring-[#ed0505] cursor-pointer"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setStatsList(defaultStats);
                    } else {
                      setStatsList([]);
                    }
                  }}
                />
                <label htmlFor="stats-default" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  Use Default Stats
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputBox
                label="Stat Title"
                value={stats.title}
                onChange={(e) =>
                  setStats((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <InputBox
                label="Number Value"
                type="number"
                min="0"
                value={stats.number}
                onChange={(e) =>
                  setStats((prev) => ({ ...prev, number: e.target.value }))
                }
              />
              <InputBox
                label="Suffix (e.g. +, %)"
                value={stats.suffix}
                onChange={(e) =>
                  setStats((prev) => ({ ...prev, suffix: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!stats.title || !stats.number) return;
                  setStatsList((prev) => [
                    ...prev,
                    { id: uuidv4(), ...stats },
                  ]);
                  setStats({ title: "", number: "", suffix: "" });
                }}
                className="px-4 py-2.5 bg-[#1d2f64] hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all shadow-2xs"
              >
                Add Stat Item
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 border border-slate-300 rounded-xl p-4 min-h-24">
              {statsList.length === 0 ? (
                <span className="text-xs text-slate-400 font-medium col-span-full text-center py-2">
                  No stats items added
                </span>
              ) : (
                statsList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-300 rounded-xl p-3 flex flex-col items-center justify-center relative shadow-2xs"
                  >
                    <h5 className="text-xl font-extrabold font-jetbrains text-[#ed0505]">
                      {item.number}{item.suffix}
                    </h5>
                    <p className="text-xs font-bold text-slate-700 text-center uppercase tracking-wider mt-1">
                      {item.title}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setStatsList((prev) =>
                          prev.filter((f) => f.id !== item.id)
                        )
                      }
                      className="absolute -top-2 -right-2 bg-rose-600 text-white p-1 rounded-full shadow-md hover:bg-rose-700 transition-colors"
                    >
                      <Icon icon="lucide:x" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/dashboard/pages"
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs transition-all shadow-2xs"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-white bg-[#ed0505] hover:bg-red-700 font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Icon icon={isEdit ? "lucide:save" : "lucide:send"} className="w-4 h-4" />
              <span>{loading ? "Processing..." : isEdit ? "Update Page" : "Publish Page"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
