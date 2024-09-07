const Buttons = (props: { list: (string | number)[]; onClick: Function }) => {
  return (
    <>
      {props.list.map((e, id) => {
        return (
          <button key={id} onClick={() => props.onClick(e)} className="item">
            {e}
          </button>
        );
      })}
    </>
  );
};

export default Buttons;
