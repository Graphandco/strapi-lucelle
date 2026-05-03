"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { addProduct } from "@/actions/addProduct";
import { getSupabaseCategories } from "@/actions/getSupabaseProduct";
import { getMyProfileRole } from "@/actions/getMyProfileRole";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

const ACCEPT_ATTR = "image/jpeg,image/png,image/gif,image/webp,image/avif";
const ACCEPT_TYPES = new Set([
   "image/jpeg",
   "image/png",
   "image/gif",
   "image/webp",
   "image/avif",
]);

function isAcceptedImage(file) {
   return file && ACCEPT_TYPES.has(file.type);
}

export default function AddProductForm() {
   const formRef = useRef(null);
   const nameInputRef = useRef(null);
   const imageInputRef = useRef(null);
   const dragCounter = useRef(0);

   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [categories, setCategories] = useState([]);
   const [dragActive, setDragActive] = useState(false);
   const [previewUrl, setPreviewUrl] = useState(null);
   const [imageName, setImageName] = useState(null);
   const [isAdmin, setIsAdmin] = useState(false);

   const clearImage = useCallback(() => {
      setPreviewUrl(null);
      setImageName(null);
      const input = imageInputRef.current;
      if (input) input.value = "";
   }, []);

   const assignFile = useCallback(
      (file) => {
         if (!file) return;
         if (!isAcceptedImage(file)) {
            toast.error(
               "Format non pris en charge (JPEG, PNG, GIF, WebP ou AVIF).",
            );
            return;
         }
         const input = imageInputRef.current;
         if (!input) return;

         clearImage();
         const dt = new DataTransfer();
         dt.items.add(file);
         input.files = dt.files;

         setPreviewUrl(URL.createObjectURL(file));
         setImageName(file.name);
      },
      [clearImage],
   );

   useEffect(() => {
      return () => {
         if (previewUrl) URL.revokeObjectURL(previewUrl);
      };
   }, [previewUrl]);

   useEffect(() => {
      let cancelled = false;
      (async () => {
         try {
            const [data, { role }] = await Promise.all([
               getSupabaseCategories(),
               getMyProfileRole(),
            ]);
            if (!cancelled) {
               setCategories(
                  [...(data ?? [])].map((c) => ({ ...c, id: String(c.id) })),
               );
               setIsAdmin(role === "admin");
            }
         } catch (e) {
            console.error(e);
         }
      })();
      return () => {
         cancelled = true;
      };
   }, []);

   const handleImageInputChange = (e) => {
      const file = e.target.files?.[0];
      if (file) assignFile(file);
   };

   const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current += 1;
      setDragActive(true);
   };

   const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
         dragCounter.current = 0;
         setDragActive(false);
      }
   };

   const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
   };

   const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) assignFile(file);
   };

   const openFilePicker = () => {
      imageInputRef.current?.click();
   };

   async function handleSubmit(event) {
      event.preventDefault();
      const form = formRef.current;
      if (!form) return;

      setLoading(true);
      setError(null);

      const formData = new FormData(form);

      try {
         const result = await addProduct(formData);

         if (!result.success) {
            throw new Error(
               result.error || "Erreur lors de l'ajout du produit",
            );
         }

         if (nameInputRef.current) {
            nameInputRef.current.value = "";
         }
         clearImage();
         toast.success("Produit ajouté avec succès");
      } catch (err) {
         console.error("Erreur détaillée:", err);
         setError(err.message);
      } finally {
         setLoading(false);
      }
   }

   return (
      <form
         ref={formRef}
         onSubmit={handleSubmit}
         className="max-w-2xl w-full space-y-6"
      >
         <div>
            <input
               ref={nameInputRef}
               type="text"
               id="name"
               name="name"
               required
               placeholder="Nom du produit"
               className="bg-card outline-none border-none rounded-lg w-full p-4 placeholder:text-white/30 placeholder:text-sm"
            />
         </div>

         <div>
            <select
               id="category"
               name="category"
               required
               className="bg-card outline-none border-none rounded-lg w-full p-4 text-white text-sm"
            >
               <option value="" className="text-white text-sm">
                  Sélectionner une catégorie
               </option>
               {categories.map((category) => (
                  <option
                     key={category.id}
                     value={category.id}
                     className="text-white text-sm"
                  >
                     {category.name}
                  </option>
               ))}
            </select>
         </div>

         {isAdmin ? (
            <div className="flex flex-col gap-1.5 rounded-lg bg-card/60 px-4 py-3">
               <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
                  <input
                     type="checkbox"
                     name="personal_product"
                     value="on"
                     defaultChecked
                     className="size-4 shrink-0 rounded border-white/30 bg-card accent-primary"
                  />
                  <span>Produit perso</span>
               </label>
               {/* <p className="text-xs text-white/50 pl-7">
                  Coché : visible pour toi uniquement. Décoché : produit
                  catalogue (tout le monde).
               </p> */}
            </div>
         ) : null}

         <div className="space-y-2">
            <span className="block text-white/70 text-sm">
               Image (facultatif)
            </span>
            <input
               ref={imageInputRef}
               id="image"
               name="image"
               type="file"
               accept={ACCEPT_ATTR}
               className="sr-only"
               onChange={handleImageInputChange}
            />
            <button
               type="button"
               onClick={openFilePicker}
               onDragEnter={handleDragEnter}
               onDragLeave={handleDragLeave}
               onDragOver={handleDragOver}
               onDrop={handleDrop}
               className={[
                  "relative w-full min-h-[220px] rounded-xl border-2 border-dashed transition-colors",
                  "flex flex-col items-center justify-center gap-3 px-6 py-8 text-center cursor-pointer",
                  "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  dragActive
                     ? "border-primary bg-primary/10 text-white"
                     : "border-white/25 bg-card/50 text-white/60 hover:border-primary/50 hover:bg-card hover:text-white/80",
               ].join(" ")}
            >
               {previewUrl ? (
                  <>
                     <img
                        src={previewUrl}
                        alt=""
                        className="max-h-28 w-auto max-w-full rounded-lg object-contain shadow-md"
                     />
                     <span className="text-sm text-white/80 truncate max-w-full px-2">
                        {imageName}
                     </span>
                     <span className="text-xs text-white/50">
                        Glisser une autre image ou cliquer pour remplacer
                     </span>
                  </>
               ) : (
                  <>
                     <Upload
                        className="size-8 text-white/40 shrink-0"
                        strokeWidth={1.25}
                        aria-hidden
                     />
                     <span className="text-base text-white/85 font-medium">
                        Glisser-déposer une image ici
                     </span>
                     <span className="text-sm text-white/50">
                        ou cliquer pour parcourir les fichiers
                     </span>
                     <span className="text-xs text-white/40">
                        JPEG, PNG, GIF, WebP ou AVIF
                     </span>
                  </>
               )}
            </button>
            {previewUrl ? (
               <button
                  type="button"
                  onClick={(e) => {
                     e.stopPropagation();
                     clearImage();
                  }}
                  className="inline-flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300"
               >
                  <X size={16} aria-hidden />
                  Retirer l’image
               </button>
            ) : null}
         </div>

         {error ? <div className="text-red-500 text-sm">{error}</div> : null}

         <button
            type="submit"
            disabled={loading}
            className="w-full font-normal bg-primary text-black py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
         >
            {loading ? "Ajout en cours..." : "Ajouter"}
         </button>
      </form>
   );
}
