import "./option.css";

export default function Option(props) {
  const addItem = () => {
    if (props.searchItem !== "") {
      props.search(props.searchItem + "," + props.value);
    } else {
      props.search(props.value);
    }
  };
  return (
    <div
      className="option"
      style={{ background: props.color, top: props.top + "px" }}
    >
      <img className="ingredient" src={props.item} alt="indegrent" />
      <span>{props.value}</span>
      <img
        className="add_icon"
        src="add_icon.png"
        alt="add"
        onClick={() => addItem()}
      />
    </div>
  );
}
