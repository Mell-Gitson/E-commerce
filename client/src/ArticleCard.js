import React from 'react';

const ArticleCard = ({ article }) => (
  <div className="max-w-sm rounded overflow-hidden shadow-lg">
    <img className="w-full" src={article.image1} alt={article.title} />
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2">{article.title}</div>
      <p className="text-gray-700 text-base">{article.content}</p>
      <p className="text-gray-700 text-base"><strong>Price: </strong>${article.price}</p>
      <p className="text-gray-700 text-base"><strong>Views: </strong>{article.views}</p>
      <p className="text-gray-700 text-base"><strong>Searches: </strong>{article.search}</p>
    </div>
  </div>
);

export default ArticleCard;
