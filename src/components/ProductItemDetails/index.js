// Write your code here
import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiConstantStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  redirectToProduct: 'REDIRECT',
}

class ProductItemDetails extends Component {
  state = {
    itemDetails: {},
    dataFetchingStatus: apiConstantStatus.initial,
    itemQty: 1,
  }

  onIncreaseQty = () => {
    this.setState(prevState => ({itemQty: prevState.itemQty + 1}))
  }

  onDecreaseQty = () => {
    const {itemQty} = this.state
    if (itemQty > 1) {
      this.setState(prevState => ({itemQty: prevState.itemQty - 1}))
    }
  }

  componentDidMount = async () => {
    this.setState({dataFetchingStatus: apiConstantStatus.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    const formattedData = {
      availability: data.availability,
      brand: data.brand,
      description: data.description,
      imageUrl: data.image_url,
      price: data.price,
      rating: data.rating,
      similarProducts: data.similar_products.map(eachItem => ({
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        title: eachItem.title,
        style: eachItem.style,
        price: eachItem.price,
        description: eachItem.description,
        brand: eachItem.brand,
        totalReviews: eachItem.total_reviews,
        rating: eachItem.rating,
      })),
      style: data.style,
      title: data.title,
      totalReviews: data.total_reviews,
    }
    if (response.ok) {
      this.setState({
        itemDetails: formattedData,
        dataFetchingStatus: apiConstantStatus.success,
      })
    } else {
      this.setState({dataFetchingStatus: apiConstantStatus.failure})
    }
  }

  redirectToProduct = () => {
    this.setState({dataFetchingStatus: apiConstantStatus.redirectToProduct})
  }

  render() {
    const {itemDetails, itemQty, dataFetchingStatus} = this.state
    if (dataFetchingStatus === apiConstantStatus.redirectToProduct) {
      return <Redirect to="/products" />
    }
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      similarProducts,
      title,
      totalReviews,
    } = itemDetails

    return (
      <>
        <Header />
        <div>
          {apiConstantStatus.inProgress === dataFetchingStatus && (
            <div className="loader-container" data-testid="loader">
              <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
            </div>
          )}
          {apiConstantStatus.success === dataFetchingStatus && (
            <>
              <div className="product-details-main-container">
                <div>
                  <img
                    className="product-image-container"
                    alt="product"
                    src={imageUrl}
                  />
                </div>
                <div>
                  <div>
                    <h1 className="product-title">{title}</h1>
                    <p className="product-price">Rs {price}/-</p>
                  </div>
                  <div className="d-flex-align-item-center">
                    <div className="d-flex-align-item-center review">
                      <p className="rating-paragraph">{rating}</p>
                      <img
                        className="star"
                        alt="star"
                        src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                      />
                    </div>
                    <p className="total-reviews">{totalReviews} Reviews</p>
                  </div>
                  <p className="description">{description}</p>
                  <p className="description">
                    <span className="specification-key">Available:</span>{' '}
                    {availability}
                  </p>
                  <p className="description">
                    <span className="specification-key">Brand:</span> {brand}
                  </p>
                  <hr />
                  <div className="d-flex-align-item-center">
                    <button
                      onClick={this.onDecreaseQty}
                      className="qty-increase-decrease-btn"
                      data-testid="minus"
                      type="button"
                    >
                      <BsDashSquare />
                    </button>
                    <p className="qty">{itemQty}</p>
                    <button
                      onClick={this.onIncreaseQty}
                      className="qty-increase-decrease-btn"
                      data-testid="plus"
                      type="button"
                    >
                      <BsPlusSquare />
                    </button>
                  </div>
                  <button className="add-to-cart-btn" type="button">
                    ADD TO CART
                  </button>
                </div>
              </div>
              <h1 className="similar-product-heading">Similar Products</h1>
              <ul className="similar-product-ul">
                {similarProducts.map(eachProduct => (
                  <SimilarProductItem
                    productDetails={eachProduct}
                    key={eachProduct.id}
                  />
                ))}
              </ul>
            </>
          )}
          {apiConstantStatus.failure === dataFetchingStatus && (
            <div className="failure-view-container">
              <img
                className="failure-image"
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
                alt="failure view"
              />
              <h1 className="product-not-found-heading">Product Not Found</h1>
              <button
                className="continue-shopping-button"
                onClick={this.redirectToProduct}
                type="button"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
