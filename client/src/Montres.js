import React, { useEffect, useState } from 'react';
import './Searchbar.css';
import ArticleCard from './components/ArticleCard';
import { useParams } from 'react-router-dom';

function Montres() {
    const [articles, setArticles] = useState([]);
    const [searchByTitleValue, setSearchByTitleValue] = useState("");
    const [searchByTypeValue, setSearchByTypeValue] = useState("");
    const [searchByMarqueValue, setSearchByMarqueValue] = useState("");
    const [types, setTypes] = useState([]);
    const [marques, setMarques] = useState([]);
    const params = useParams();

    const fetchArticles = (title, type, marque) => {
        const sendData = {};
        if (title) sendData.searchTitle = title;
        if (type) sendData.searchType = type;
        if (marque) sendData.searchMarque = marque;

        if (!title && !type && !marque) {
            fetch('http://localhost:8000/api/articles')
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setArticles(data);
                    } else {
                        console.error('Unexpected response format:', data);
                    }
                })
                .catch(error => console.error('Error fetching articles:', error));
            return;
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
                if (Array.isArray(receivedData)) {
                    if (receivedData.length == 1) {
                        fetch('http://localhost:8000/incrementViews', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(receivedData[0].id)
                        })
                        .then(response => response.json())
                        .then(jsonResponse => {
                            if(jsonResponse){
                                console.log(jsonResponse)
                            }
                        })
                    }
                    setArticles(receivedData);
                } else {
                    console.error('Unexpected response format:', receivedData);
                }
            })
            .catch(error => console.error('Error fetching articles:', error));
    }

    useEffect(() => {
        fetch('http://localhost:8000/allType')
            .then(response => response.json())
            .then(data => {
                setTypes(data);
            })
            .catch(error => console.error('Error fetching types:', error));

        fetch('http://localhost:8000/allMarque')
            .then(response => response.json())
            .then(data => {
                setMarques(data);
            })
            .catch(error => console.error('Error fetching marques:', error));
    }, []);

    useEffect(() => {
        console.log('Params changed:', params);
        if (params.marque) {
            setSearchByMarqueValue(params.marque);
            setSearchByTypeValue(""); 
            fetchArticles(searchByTitleValue, "", params.marque);
        } else if (params.type) {
            setSearchByTypeValue(params.type);
            setSearchByMarqueValue(""); 
            fetchArticles(searchByTitleValue, params.type, "");
        } else {
            setSearchByMarqueValue("");
            setSearchByTypeValue("");
            fetchArticles(searchByTitleValue, "", "");
        }
    }, [params]);

    const changeSearchByTitleValue = (e) => {
        setSearchByTitleValue(e.target.value);
        fetchArticles(e.target.value, searchByTypeValue, searchByMarqueValue);
    }

    const changeSearchByTypeValue = (e) => {
        setSearchByTypeValue(e.target.value);
        fetchArticles(searchByTitleValue, e.target.value, searchByMarqueValue);
    }

    const changeSearchByMarqueValue = (e) => {
        setSearchByMarqueValue(e.target.value);
        fetchArticles(searchByTitleValue, searchByTypeValue, e.target.value);
    }

    return (
        <div>
            <div className="search-container relative flex mx-auto mt-24">
                <label className="search-label" htmlFor="searchByTitle">Nom :</label>
                <input className="search-input" type="text" id="searchByTitle" value={searchByTitleValue} onChange={changeSearchByTitleValue}></input>

                <label className="search-label" htmlFor="searchByType">Catégorie :</label>
                <select className="search-select" name="searchByType" id="searchByType" value={searchByTypeValue} onChange={changeSearchByTypeValue}>
                    <option key="default" value="">Défaut</option>
                    {types.map(type => (
                        <option key={type.id} value={type.name}>{type.name}</option>
                    ))}
                </select>

                <label className="search-label" htmlFor="searchByMarque">Marque :</label>
                <select className="search-select" name="searchByMarque" id="searchByMarque" value={searchByMarqueValue} onChange={changeSearchByMarqueValue}>
                    <option key="default" value="">Défaut</option>
                    {marques.map(marque => (
                        <option key={marque.id} value={marque.name}>{marque.name}</option>
                    ))}
                </select>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex flex-wrap -mx-4">
                    {articles.map(article => (
                        <div className="w-full md:w-1/3 px-4 mb-8" key={article.id}>
                            <ArticleCard article={article} image={`/assets/${article.image}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default Montres;