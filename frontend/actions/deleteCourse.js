"use server";

export async function deleteCourse(courseId, token) {
   try {
      const response = await fetch(
         `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/courses/${courseId}`,
         {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
         }
      );

      if (!response.ok) {
         throw new Error("Failed to delete course");
      }

      return { success: true };
   } catch (error) {
      console.error("Error deleting course:", error);
      return { success: false, error: error.message };
   }
}
