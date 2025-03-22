// original code...
import { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    // Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [isTyping, setIsTyping] = useState(false); // Track if the user is typing
  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
            query
          )}&api_key=${API_KEY}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;

// import { useEffect, useState, useRef } from "react";

// Custom debounce hook
// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   const timerRef = useRef();

//   useEffect(() => {
//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//     }

//     timerRef.current = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(timerRef.current);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// };

// const App = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const debouncedSearchTerm = useDebounce(searchTerm, 500);

//   useEffect(() => {
//     console.log("Debounced search term:", debouncedSearchTerm);
//   }, [debouncedSearchTerm]);

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//       <h1>Debounce Test</h1>
//       <input
//         type="text"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         placeholder="Type something..."
//         style={{
//           color: "white",
//           padding: "10px",
//           fontSize: "16px",
//           width: "300px",
//           marginBottom: "20px",
//         }}
//       />
//       <p>
//         <strong>Debounced Value:</strong> {debouncedSearchTerm}
//       </p>
//     </div>
//   );
// };

// export default App;

// import { useEffect, useState, useRef } from "react";
// import Search from "./components/Search.jsx";
// import Spinner from "./components/Spinner.jsx";
// import MovieCard from "./components/MovieCard.jsx";

// const API_BASE_URL = "https://api.themoviedb.org/3";
// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// // Custom debounce hook
// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   const timerRef = useRef();

//   useEffect(() => {
//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//     }

//     timerRef.current = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(timerRef.current);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// };

// const App = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [movieList, setMovieList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Use the custom debounce hook
//   const debouncedSearchTerm = useDebounce(searchTerm, 500);

//   const fetchMovies = async (query = "") => {
//     setIsLoading(true);
//     setErrorMessage("");
//     try {
//       const endpoint = query
//         ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
//             query
//           )}&api_key=${API_KEY}`
//         : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
//       console.log("Fetching movies from:", endpoint); // Debugging log
//       const response = await fetch(endpoint, {
//         method: "GET",
//         headers: {
//           accept: "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success === false) {
//         throw new Error(data.status_message);
//       }
//       setMovieList(data.results || []);
//     } catch (error) {
//       console.error(`Error fetching movies: ${error.message}`);
//       setErrorMessage(
//         error.message || "Error fetching movies. Please try again later."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log("Fetching movies for:", debouncedSearchTerm); // Debugging log
//     fetchMovies(debouncedSearchTerm);
//   }, [debouncedSearchTerm]);

//   return (
//     <main>
//       <div className="pattern" />
//       <div className="wrapper">
//         <header>
//           <img src="./hero.png" alt="Hero Banner" />
//           <h1>
//             Find <span className="text-gradient">Movies</span> You'll Enjoy
//             Without the Hassle.
//           </h1>
//         </header>
//         <section className="all-movies">
//           <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//           <h1 className="text-white">{searchTerm}</h1>

//           <h2 className="mt-[40px]">All Movies</h2>

//           {isLoading ? (
//             <Spinner />
//           ) : errorMessage ? (
//             <p className="text-red-500">{errorMessage}</p>
//           ) : (
//             <ul>
//               {movieList.map((movie) => (
//                 <MovieCard key={movie.id} movie={movie} />
//               ))}
//             </ul>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// };

// export default App;

// import { useEffect, useState, useRef } from "react";
// import Search from "./components/Search.jsx";
// import Spinner from "./components/Spinner.jsx";
// import MovieCard from "./components/MovieCard.jsx";

// const API_BASE_URL = "https://api.themoviedb.org/3";
// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// // Custom debounce hook
// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   const timerRef = useRef();

//   useEffect(() => {
//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//     }

//     timerRef.current = setTimeout(() => {
//       console.log("Debounced value updated:", value); // Debugging log
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(timerRef.current);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// };

// const App = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [movieList, setMovieList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Use the custom debounce hook
//   const debouncedSearchTerm = useDebounce(searchTerm, 500);

//   const fetchMovies = async (query = "") => {
//     setIsLoading(true);
//     setErrorMessage("");
//     try {
//       const endpoint = query
//         ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
//             query
//           )}&api_key=${API_KEY}`
//         : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
//       console.log("Fetching movies from:", endpoint); // Debugging log
//       const response = await fetch(endpoint, {
//         method: "GET",
//         headers: {
//           accept: "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success === false) {
//         throw new Error(data.status_message);
//       }
//       setMovieList(data.results || []);
//     } catch (error) {
//       console.error(`Error fetching movies: ${error.message}`);
//       setErrorMessage(
//         error.message || "Error fetching movies. Please try again later."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (debouncedSearchTerm.trim() !== "") {
//       console.log("Fetching movies for:", debouncedSearchTerm); // Debugging log
//       fetchMovies(debouncedSearchTerm);
//     } else {
//       // If the search term is empty, fetch popular movies or clear the list
//       console.log("Fetching popular movies");
//       fetchMovies();
//     }
//   }, [debouncedSearchTerm]);

//   return (
//     <main>
//       <div className="pattern" />
//       <div className="wrapper">
//         <header>
//           <img src="./hero.png" alt="Hero Banner" />
//           <h1>
//             Find <span className="text-gradient">Movies</span> You'll Enjoy
//             Without the Hassle.
//           </h1>
//         </header>
//         <section className="all-movies">
//           <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//           <h1 className="text-white">{searchTerm}</h1>

//           <h2 className="mt-[40px]">All Movies</h2>

//           {isLoading ? (
//             <Spinner />
//           ) : errorMessage ? (
//             <p className="text-red-500">{errorMessage}</p>
//           ) : (
//             <ul>
//               {movieList.map((movie) => (
//                 <MovieCard key={movie.id} movie={movie} />
//               ))}
//             </ul>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// };

// export default App;

// import { useEffect, useState, useRef } from "react";
// import Search from "./components/Search.jsx";
// import Spinner from "./components/Spinner.jsx";
// import MovieCard from "./components/MovieCard.jsx";

// const API_BASE_URL = "https://api.themoviedb.org/3";
// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// // Custom debounce hook
// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   const timerRef = useRef();

//   useEffect(() => {
//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//     }

//     timerRef.current = setTimeout(() => {
//       console.log("Debounced value updated:", value); // Debugging log
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(timerRef.current);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// };

// const App = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [movieList, setMovieList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Use the custom debounce hook
//   const debouncedSearchTerm = useDebounce(searchTerm, 500);

//   const fetchMovies = async (query = "") => {
//     setIsLoading(true);
//     setErrorMessage("");
//     try {
//       const endpoint = query
//         ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
//             query
//           )}&api_key=${API_KEY}`
//         : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
//       console.log("Fetching movies from:", endpoint); // Debugging log
//       const response = await fetch(endpoint, {
//         method: "GET",
//         headers: {
//           accept: "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success === false) {
//         throw new Error(data.status_message);
//       }
//       setMovieList(data.results || []);
//     } catch (error) {
//       console.error(`Error fetching movies: ${error.message}`);
//       setErrorMessage(
//         error.message || "Error fetching movies. Please try again later."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (debouncedSearchTerm.trim() !== "") {
//       console.log("Fetching movies for:", debouncedSearchTerm); // Debugging log
//       fetchMovies(debouncedSearchTerm);
//     } else {
//       // If the search term is empty, fetch popular movies or clear the list
//       console.log("Fetching popular movies");
//       fetchMovies();
//     }
//   }, [debouncedSearchTerm]);

//   return (
//     <main>
//       <div className="pattern" />
//       <div className="wrapper">
//         <header>
//           <img src="./hero.png" alt="Hero Banner" />
//           <h1>
//             Find <span className="text-gradient">Movies</span> You'll Enjoy
//             Without the Hassle.
//           </h1>
//         </header>
//         <section className="all-movies">
//           <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//           <h1 className="text-white">{searchTerm}</h1>

//           <h2 className="mt-[40px]">All Movies</h2>

//           {isLoading ? (
//             <Spinner />
//           ) : errorMessage ? (
//             <p className="text-red-500">{errorMessage}</p>
//           ) : (
//             <ul>
//               {movieList.map((movie) => (
//                 <MovieCard key={movie.id} movie={movie} />
//               ))}
//             </ul>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// };

// export default App;

// import { useEffect, useState, useRef } from "react";
// import Search from "./components/Search.jsx";
// import Spinner from "./components/Spinner.jsx";
// import MovieCard from "./components/MovieCard.jsx";

// const API_BASE_URL = "https://api.themoviedb.org/3";
// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// const API_OPTIONS = {
//   method: "GET",
//   headers: {
//     accept: "application/json",
//   },
// };

// const App = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
//   const [movieList, setMovieList] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isTyping, setIsTyping] = useState(false); // Track if the user is typing
//   const timerRef = useRef(null); // Ref to store the timer

//   // Debounce logic
//   useEffect(() => {
//     if (timerRef.current) {
//       clearTimeout(timerRef.current); // Clear the previous timer
//     }

//     if (searchTerm.trim() !== "") {
//       setIsTyping(true); // Disable input while typing
//       timerRef.current = setTimeout(() => {
//         setIsTyping(false); // Re-enable input after 500ms
//         setDebouncedSearchTerm(searchTerm); // Update debounced search term
//       }, 500);
//     } else {
//       setDebouncedSearchTerm(""); // Clear debounced search term if input is empty
//     }

//     // Cleanup timer on unmount
//     return () => {
//       if (timerRef.current) {
//         clearTimeout(timerRef.current);
//       }
//     };
//   }, [searchTerm]);

//   const fetchMovies = async (query = "") => {
//     setIsLoading(true);
//     setErrorMessage("");

//     try {
//       const endpoint = query
//         ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
//             query
//           )}&api_key=${API_KEY}`
//         : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;

//       const response = await fetch(endpoint, API_OPTIONS);

//       if (!response.ok) {
//         throw new Error("Failed to fetch movies");
//       }

//       const data = await response.json();

//       if (data.Response === "False") {
//         setErrorMessage(data.Error || "Failed to fetch movies");
//         setMovieList([]);
//         return;
//       }

//       setMovieList(data.results || []);
//     } catch (error) {
//       console.error(`Error fetching movies: ${error}`);
//       setErrorMessage("Error fetching movies. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (debouncedSearchTerm.trim() !== "") {
//       fetchMovies(debouncedSearchTerm);
//     } else {
//       fetchMovies(); // Fetch popular movies if search term is empty
//     }
//   }, [debouncedSearchTerm]);

//   return (
//     <main>
//       <div className="pattern" />
//       <div className="wrapper">
//         <header>
//           <img src="./hero.png" alt="Hero Banner" />
//           <h1>
//             Find <span className="text-gradient">Movies</span> You'll Enjoy
//             Without the Hassle
//           </h1>
//           <Search
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             isTyping={isTyping} // Pass isTyping to disable input
//           />
//         </header>

//         <section className="all-movies">
//           <h2>All Movies</h2>
//           {isLoading ? (
//             <Spinner />
//           ) : errorMessage ? (
//             <p className="text-red-500">{errorMessage}</p>
//           ) : (
//             <ul>
//               {movieList.map((movie) => (
//                 <MovieCard key={movie.id} movie={movie} />
//               ))}
//             </ul>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// };

// export default App;
