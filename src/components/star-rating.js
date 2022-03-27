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
