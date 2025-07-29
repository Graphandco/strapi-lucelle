export default function PageTitle({ title, center, className = "" }) {
   return (
      <h1
         className={`text-2xl mb-5 px-1 text-primary ${
            center ? "text-center" : "text-left"
         } ${className}`}
      >
         {title}
      </h1>
   );
}
