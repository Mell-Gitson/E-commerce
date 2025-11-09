import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCardPanier = ({ article, handleRemove }) => (
  <div className="flex mt-4 max-w-full rounded overflow-hidden shadow-lg bg-white">
    <div style={{ width: '10%', paddingBottom: '10%', position: 'relative' }}>
      <img 
        style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} src={`/assets/${article.image}`} alt={article.title} />
    </div>
    <div className="w-2/3 px-6 py-4 flex flex-col justify-between">
      <div>
        <div className="font-bold text-xl mb-2">{article.title}</div>

        <p className="text-gray-700 text-base mb-2"><strong>Price: </strong>{(article.price * (1 - article.reduction / 100)).toFixed(2)  }€</p>
        {
        console.log('ARTICLE' + article.reduction)
        }
       
        <p className="text-gray-700 text-base mb-2"><strong>Quantite: </strong>{article.quantite}</p>
      </div>
      <div className="flex justify-between items-center">
        <Link to={`/article/${article.id}`} className="text-center text-white font-bold py-2 px-4 rounded bg-grayBanner hover:bg-gray-700 inline-block mt-2">
          Voir
        </Link>
        <button onClick={() => handleRemove(article.id)} className="text-center text-white font-bold py-2 px-4 rounded bg-red-500 hover:bg-red-700 inline-block mt-2">
          Supprimer
        </button>
      </div>
    </div>
  </div>
);

export default ArticleCardPanier;
