import { ShoppingBasket } from "@material-ui/icons";
import "../Reviews/Reviews.css";
import ShowRating from "../Reviews/ShowRating";
import img from "../../../img/vendor.svg";
import { Link } from "react-router-dom";
export default function ReviewComponent(props) {
  return (
    <>
      <div className="reviews-members pt-4 pb-4">
        <div className="media">
          <a href="#">
            <img
              alt="Generic placeholder image"
              src={img}
              className="mr-3 rounded-pill"
            />
          </a>
          <div className="media-body">
            <div className="reviews-members-header">
              <span className="star-rating float-right">
                <a href="#">
                  <i className="icofont-ui-rating active"></i>
                </a>
                <a href="#">
                  <i className="icofont-ui-rating active"></i>
                </a>
                <a href="#">
                  <i className="icofont-ui-rating active"></i>
                </a>
                <a href="#">
                  <i className="icofont-ui-rating active"></i>
                </a>
                <a href="#">
                  <i className="icofont-ui-rating"></i>
                </a>
              </span>
              <h6 className="mb-1">
                <Link
                  to={`/allvendors/${props.vendorid}`}
                  className="text-black"
                  href="#"
                >
                  {props.vendorname}
                </Link>
              </h6>
              <p className="text-gray">{props.date}</p>
            </div>
            <div className="reviews-members-body">
              <p>{props.review}</p>
            </div>
            <div className="reviews-members-footer">
              <a className="total-like" href="#">
                <i className="icofont-thumbs-up"></i> Rating
              </a>{" "}
              <a className="total-like" href="#">
                <i className="icofont-thumbs-down"></i>
                <ShowRating rating={props.rating} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
