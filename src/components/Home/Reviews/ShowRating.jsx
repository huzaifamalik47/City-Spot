import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const StyledRating = withStyles({
  iconFilled: {
    color: "#ff6d75",
  },
  iconHover: {
    color: "#ff3d47",
  },
})(Rating);

export default function ShowRating(props) {
  const [value, setValue] = React.useState(1);
  if (!props.rating) {
    return (
      <div>
        <Box component="fieldset" mb={3} borderColor="transparent">
          Not Yet Rated
        </Box>
      </div>
    );
  }
  if (props.totalreviews) {
    return (
      <div>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
          }}
          component="fieldset"
          mb={3}
          borderColor="transparent"
        >
          <Rating name="read-only" value={props.rating} readOnly />(
          {props.totalreviews})
        </Box>
      </div>
    );
  } else {
    return (
      <div>
        <Box
          style={{
            marginBottom: "10px",
          }}
          component="fieldset"
          mb={3}
          borderColor="transparent"
        >
          <Rating name="read-only" value={props.rating} readOnly />
        </Box>
      </div>
    );
  }
}
