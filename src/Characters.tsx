import { faGlobe, faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, Suspense } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

type Character = {
  name: string;
  status: string;
  image: string;
  location: string;
};

const useCharacters = () => {
  return useQuery<Character[], Error>(["chacters"], () =>
    fetch("https://rickandmortyapi.com/api/character")
      .then((response) => response.json())
      .then((json) => json.results)
      .then((characters) =>
        characters.map((c: any) => ({
          ...c,
          location: c.location.name,
        }))
      )
  );
};

type Props = {
  character: Character;
};

const Character: FC<Props> = ({ character }) => (
  <li className="flex w-96 rounded-r-md bg-gray-700 shadow-lg shadow-gray-900">
    <img src={character.image} className="w-32 rounded-l-md" />
    <div className="flex flex-col justify-between p-4">
      <h2 className="text-xl">{character.name}</h2>
      <ul className="text-sm text-gray-300">
        <li>
          <FontAwesomeIcon icon={faHeartbeat} className="mr-1" />{" "}
          {character.status}
        </li>
        <li>
          <FontAwesomeIcon icon={faGlobe} className="mr-1" />{" "}
          {character.location}
        </li>
      </ul>
    </div>
  </li>
);

const Characters = () => {
  const { data } = useCharacters();
  return (
    <div className="min-h-screen bg-gray-800 p-10 text-gray-100">
      <h1 className="text-4xl">Characters</h1>
      <ul className="mt-10 grid justify-items-center gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {data?.map((c) => (
          <Character key={c.name} character={c} />
        ))}
      </ul>
      <Link
        to="/"
        className="block pt-10 underline decoration-purple-500 decoration-2 hover:decoration-pink-500"
      >
        Back
      </Link>
    </div>
  );
};

const Loading = () => <p>Loading ...</p>;

const Wrapper = () => (
  <Suspense fallback={<Loading />}>
    <Characters />
  </Suspense>
);

export default Wrapper;
