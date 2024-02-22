const Buttons = (props: { buttons: string[], handleClick: Function }) => {
    const { buttons, handleClick } = props

    return (
        <>
            {buttons.map((el, i) => {
                return (
                    <button type='button' onClick={() => handleClick(el)} className="item" key={i}>{el}</button>
                )
            })}
        </>
    )
}

export default Buttons


