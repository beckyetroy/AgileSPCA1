import React from "react";
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import MoviePage from "./pages/movieDetailsPage";
import PersonPage from "./pages/personDetailsPage";
import FavoriteMoviesPage from "./pages/favoriteMoviesPage";
import MustWatchMoviesPage from "./pages/mustWatchMoviesPage";
import MovieReviewPage from "./pages/movieReviewPage";
import SiteHeader from './components/siteHeader'
import UpcomingMoviesPage from "./pages/upcomingMoviesPage";
import CastListPage from "./pages/castListPage";
import CrewListPage from "./pages/crewListPage";
import { TrendingMoviesPageWeek, TrendingMoviesPageDay} from "./pages/trendingMoviesPage";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import MoviesContextProvider from "./contexts/moviesContext";
import AddMovieReviewPage from './pages/addMovieReviewPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 360000,
      refetchInterval: 360000, 
      refetchOnWindowFocus: false
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SiteHeader />
        <MoviesContextProvider>
        <Routes>
          <Route path="/reviews/:id" element={ <MovieReviewPage /> } />
          <Route path="/movies/favorites" element={<FavoriteMoviesPage />} />
          <Route path="/movies/mustwatch" element={<MustWatchMoviesPage />} />
          <Route path="/movies/:id" element={<MoviePage />} />
          <Route path="/person/:id" element={<PersonPage />} />
          <Route path="/movies/:id/cast" element={<CastListPage />} />
          <Route path="/movies/:id/crew" element={<CrewListPage />} />
          <Route path="/movies/upcoming" element={<UpcomingMoviesPage />} />
          <Route path="/movies/trending/week" element={<TrendingMoviesPageWeek />} />
          <Route path="/movies/trending/today" element={<TrendingMoviesPageDay />} />
          <Route path="/" element={<HomePage/>} />
          <Route path="*" element={ <Navigate to="/" /> } />
          <Route path="/reviews/form" element={ <AddMovieReviewPage /> } />
        </Routes>
        </MoviesContextProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));