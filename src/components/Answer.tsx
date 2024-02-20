
type Props = {
    item: string[]
}
function Answer(props: Props) {
    return (
        <div className="fs-1">
            {props.item.length === 0 ? '0' : props.item}
        </div>
    )
}

export default Answer
