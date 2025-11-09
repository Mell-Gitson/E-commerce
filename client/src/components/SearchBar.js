import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const [types, setTypes] = useState([]);
    const [marques, setMarques] = useState([]);
    const [articles, setArticles] = useState([]);
    const [dropdown, setDropdown] = useState(false);

    const handleChangeSearch = (e) => {
        const sendData = {
            search: e.target.value
        }
        setSearch(e.target.value);
        fetchType(sendData);
        fetchMarque(sendData);
        fetchArticle(sendData);
    }

    function fetchType(search){
        fetch('http://localhost:8000/searchType', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(search)
        })
        .then(response => response.json())
        .then(receivedData => {
            console.log(receivedData)
            setTypes(receivedData)
        })
        .catch(error => console.error('Erreur lors de la récupération des types:', error)); 
    }

    function fetchMarque(search){
        fetch('http://localhost:8000/searchMarque', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(search)
        })
        .then(response => response.json())
        .then(receivedData => {
            console.log(receivedData)
            setMarques(receivedData) 
        })
        .catch(error => console.error('Erreur lors de la récupération des marques:', error));
    }

    function fetchArticle(search){
        const sendData = {
            searchTitle: search.search
        }
        fetch('http://localhost:8000/api/searchArticle', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sendData)
        })
            .then(response => response.json())
            .then(receivedData => {
                console.log(receivedData)
                setArticles(receivedData)
            })
            .catch(error => console.error('Erreur lors de la récupération des articles:', error));
    }  

    return ( 
        <div className="relative inline-block ml-16 max-w-lg text-center w-56">
            <input 
                value={search} 
                onChange={handleChangeSearch} 
                type="text" 
                name="searchBar" 
                placeholder='Entrez votre recherche ici' 
                onFocus={() => {setDropdown(true)}} 
                onBlur={() => {setTimeout(() => setDropdown(false), 200)}} 
                className="z-100 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            {search !== "" && (types.length > 0 || marques.length > 0 || articles.length > 0) &&
                <div 
                    className={`absolute left-0 mt-1 z-10 ${dropdown && 'block'} ${!dropdown && 'hidden'} bg-white rounded-lg shadow-lg w-full`}>
                    <ul className="py-2 text-sm text-black">
                        {types.length > 0 && types.map(type => (
                            <li key={type.name}><Link to={`/montres/type/${type.name}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{type.name} ({type.numberOfArticles})</Link></li>
                        ))}
                        {marques.length > 0 && marques.map(marque => (
                            <li key={marque.name}><Link to={`/montres/marque/${marque.name}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{marque.name} ({marque.numberOfArticles})</Link></li>
                        ))}
                        {articles.length > 0 && articles.map(article => (
                            <li key={article.title} className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                <Link to={`/article/${article.id}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                <img 
                                    src={article.image} 
                                    alt={article.title} 
                                    className="w-12 h-12 object-cover rounded-lg  md:block"
                                />
                                <div className="text-left">
                                    <p className="font-semibold">{article.title}</p>
                                    <p className="text-gray-500">{article.price}€</p>
                                </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            }
        </div>
    );
};

export default SearchBar;