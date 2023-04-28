// Write your code here
import {Link} from 'react-router-dom'
import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {title, id, brand, price, rating, imageUrl} = productDetails

  return (
    <Link className="link" to={`/products/${id}`}>
      <li className="similar-product-list-item">
        <img
          className="similar-product-image"
          src={imageUrl}
          alt={`similar product ${title}`}
        />
        <h1 className="similar-product-title">{title}</h1>
        <p className="similar-product-brand">{brand}</p>
        <div className="similar-product-price-rating-container">
          <p className="similar-product-price">Rs {price}/- </p>
          <div className="star-box">
            <p className="rating-paragraph">{rating}</p>
            <img
              className="star"
              alt="star"
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            />
          </div>
        </div>
      </li>
    </Link>
  )
}

export default SimilarProductItem
