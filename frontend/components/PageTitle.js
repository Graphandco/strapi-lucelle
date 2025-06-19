export default function PageTitle({ title, center }) {
   return (
      <h1
         className={`text-2xl mb-5 px-1 text-primary ${
            center ? "text-center" : "text-left"
         }`}
      >
         {title}
      </h1>
   );
}
