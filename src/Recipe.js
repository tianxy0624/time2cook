import "./recipe.css";

export default function Recipe(props) {
  const recipeClick = () => {
    props.setShow(props.item);
  };
  return (
    <div
      className="recipe"
      style={{ position: "absolute", left: props.left, top: props.top }}
      onClick={() => recipeClick()}
    >
      <img src={props.img} alt="" />
      <hr></hr>
      <span>{props.value}</span>
    </div>
  );
}
