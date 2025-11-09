import React, { useEffect, useState } from 'react';
import ArticleCard from './components/ArticleCard';
import Banner from './components/Banner';
import Article1 from './components/Article1';
// import Article2 from './components/Article2';
import './App.css';


const Home = () => {
  const [articles, setArticles] = useState([]);
  const [filterType, setFilterType] = useState("popular");

  const changeFilterType = (e) => {
    setFilterType(e.target.value);
    console.log(e.target.value)
    if(e.target.value === "popular"){
      console.log("popular")
      fetch('http://localhost:8000/popular')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          console.log(data);
          setArticles(data);
        } else {
          console.error('Unexpected response format:', data);
        }
      })
      .catch(error => console.error('Error fetching articles:', error));
    } else if(e.target.value === "news") {
      console.log("news")
      fetch('http://localhost:8000/news')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          console.log(data);
          setArticles(data);
        } else {
          console.error('Unexpected response format:', data);
        }
      })
      .catch(error => console.error('Error fetching articles:', error));
    } else {
      console.log("recommended")
      fetch('http://localhost:8000/recommended')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          console.log(data);
          setArticles(data);
        } else {
          console.error('Unexpected response format:', data);
        }
      })
      .catch(error => console.error('Error fetching articles:', error));
    }
  }


  useEffect(() => {
    fetch('http://localhost:8000/popular')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          console.log(data);
          setArticles(data);
        } else {
          console.error('Unexpected response format:', data);
        }
      })
      .catch(error => console.error('Error fetching articles:', error));
  }, []);


  return (
    <div className="container mx-auto px-4">
      <Banner />

      <div className="flex justify-between items-center mt-8 mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Nos Produits</h2>
        <select
          className="text-lg p-2 rounded-md bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600  transform transition-all duration-300 hover:scale-105"
          value={filterType}
          onChange={changeFilterType}>
          <option value="popular">Populaires</option>
          <option value="recommended">Recommandés</option>
          <option value="news">News</option>
        </select>
      </div>

      {/* <h2 className="text-4xl font-bold text-center mb-8">Nouveauté</h2> */}

      <div className="flex justify-center shadow-lg lg:pb-6 rounded-md bg-white  transform transition-all duration-700 hover:scale-105">
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 lg:gap-12 ">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              className="rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105"
              image={`/assets/${article.image1}`}/>
          ))}
        </div>
      </div>

      <div className="mt-12 mb-12">
        <Article1 />
      </div>
    </div>
  );
};
export default Home;