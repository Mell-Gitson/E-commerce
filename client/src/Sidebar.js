import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar bg-orange-50">
      <h2>Admin Dashboard</h2>
      <ul>
        <li>
          <Link to="/admin/category">
            <i className="fa fa-list"></i> Catégorie
          </Link>
        </li>
        <li>
          <Link to="/admin/users">
            <i className="fa fa-users"></i> Users
          </Link>
        </li>
        <li>
          <Link to="/admin/articles">
            <i className="fa fa-newspaper"></i> Articles
          </Link>
        </li>
        <li>
        <Link to="/admin/articlesColors">
            <i className="fa fa-chart-bar"></i> Articles color
          </Link>
        </li>
        <li>
        <Link to="/admin/color">
            <i className="fa fa-chart-bar"></i> COlor
          </Link>
        </li>
        <li>
          <Link to="/admin/statistics">
            <i className="fa fa-chart-bar"></i> Statistics
          </Link>
        </li>
        <li>
          <Link to="/admin/gift">
            <i className="fa fa-chart-bar"></i> Gift
          </Link>
        </li>
        <li>
          <Link to="/admin/reduction">
            <i className="fa fa-chart-bar"></i> Reduction
          </Link>
        </li>
        
        <li>
          <Link to="/admin/AdminExcell">
            <i className="fa fa-chart-bar"></i> Excell
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;