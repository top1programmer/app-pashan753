/*import ReactStars from "react-rating-stars-component";

export const StarRating = (props) => {

  let stars = {
    className:"rating",
    count: 5,
    value: props.rating,
    onChange: (newRating) => {
      props.setRating(newRating)
    },
    edit: props.isAuthenticated? true: false,
    size: 25,
    activeColor: "#ffd700"
  };
  return   <ReactStars {...stars}/>
}
*/


import {useState} from 'react';

export const StarRating = ({count, value,
    inactiveColor='#ddd',
    size=24,
    activeColor='#f00', changeRating}) =>{

  const stars = Array.from({length: count}, () => '🟊')
  const handleChange = (e, value) => {
    changeRating(e, value + 1);
  }

  return (
    <div>
      {stars.map((s, index) => {
        let style = inactiveColor;
        if (index < value) {
          style=activeColor;
        }
        return (
          <span className={"star"}
            key={index}
            style={{color: style, width:size, height:size, fontSize: size}}
            onClick={(e)=>  handleChange(e, index)}>{s}</span>
        )
      })}
    </div>
  )
}

// export const StarRatingDemo = (props) => {
//
//   const [rating, setRating] = useState(props.rating || 0);
//
//   const handleChange = (e, value) => {
//     props.changeRating(e, value)
//     //setRating(value);
//   }
//   return (
//     <div>
//       <StarRating
//        count={5}
//        size={25}
//        value={props.rating}
//        activeColor ={'#febc0b'}
//        inactiveColor={'#ddd'}
//        onChange={handleChange}  />
//     </div>
//   )
// }
