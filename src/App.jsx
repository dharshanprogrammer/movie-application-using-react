import React, { useEffect, useLayoutEffect, useState } from "react";
import "./index.css";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
const API_BASE_URL = "https://api.themoviedb.org/3";
import { useAsync, useDebounce } from "react-use";
import {Update_Search_Count} from "./appwrite.js";
import { getTrendingMovies } from "./appwrite.js";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const[DebounceValue,SetDeBouncevalue] = useState('')
  const [SearchTerm, SetSearchTerm] = useState("");
  const[IsTrendingLoading,SetTrendingLoading] =useState(true)
  const [errorMessage, SetErrorMessage] = useState("");

  const [MoviesList, SetMoviesList] = useState([]);

  const [IsLoading, SetIsLoading] = useState(true);

  const[TrendingMovies,SetTrendingMovies] =useState([]);

  useDebounce(()=>SetDeBouncevalue(SearchTerm),500,[SearchTerm])


  const fetchMovies = async (query = '') => {
    SetErrorMessage("");
    SetIsLoading(true);
    try {
      const endpoint = query ?
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`:
      `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed To Fetch Data");
      }
      const data = await response.json();
      if (data.response === "False") {
        SetErrorMessage(data.Error || "Error Fetching Moives");
        SetMoviesList([]);
      }
      SetMoviesList(data.results || []);
      if(query && data.results.length>0)
      {
        Update_Search_Count(query,data.results[0]);
      }
    } catch (error) {
      console.log(`Error Fetching Movies ${error}`);
      SetErrorMessage("Error Fetching Movies");
    } finally {
      SetIsLoading(false);
    }
  };

  const loadTrendingMovies = async () =>{
    SetTrendingLoading(true)
    try {
      const trending_movies =await getTrendingMovies();
      SetTrendingMovies(trending_movies);
      SetTrendingLoading(false);

    } catch (error) {
      console.log(`error Fetching Trending Movies ${error}`);
      SetTrendingLoading(true);
    }
  }
  useEffect(()=>{
    fetchMovies(DebounceValue);
  },[DebounceValue])

  useEffect(()=>{
    loadTrendingMovies();
  },[])
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Hero Bannar" />
          <h1>
            Find <span className="text-gradient">Movies</span>You'll Enjoy
            Without the Hassle
          </h1>
          <Search value={SearchTerm} setSearchTerm={SetSearchTerm} />
          
        </header>
        {!IsTrendingLoading ? (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              
              {TrendingMovies.map((movie, index)=>{
                return(<li key={movie.$id}>
                    <p>{index+1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                </li>)
              })}
            </ul>
          </section>
        ):(<section className="trending">
          <h2>Loading Trending Movies</h2>
          <Spinner/>

        </section>)
        }
        <section className="all-movies">
          <h2 className="mt-10">Popular Movies</h2>
          {IsLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {MoviesList.map((movie) => (
                <MovieCard key={movie.key} movie = {movie}/>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
