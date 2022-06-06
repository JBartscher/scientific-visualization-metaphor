import { FC } from "react";
import { Link } from "react-router-dom";

const Title: FC = ({ children }) => (
  <h1 className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl lg:text-6xl">
    {children}
  </h1>
);

const Newsletter = () => (
  <div className="flex h-screen flex-col items-center justify-center dark:bg-gray-800">
    <Title>Rick &amp; Morty Newsletter</Title>
    <form className="relative mt-10 flex group">
      <div className="absolute -inset-1 rounded-2xl bg-pink-500 opacity-70 blur group-hover:-inset-2" />
      <input
        type="email"
        name="email"
        placeholder="rick@sanchez.com"
        className="relative rounded-l-2xl"
      />
      <button className="relative rounded-r-2xl bg-purple-700 px-4 text-gray-100 hover:bg-purple-600">
        Subscribe
      </button>
    </form>
    <Link
      className="mt-10 text-gray-300 underline decoration-purple-500 decoration-2 hover:decoration-pink-500"
      to="/characters"
    >
      Characters
    </Link>
  </div>
);

export default Newsletter;
