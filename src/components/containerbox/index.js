import "../../index.css"

export const ContainerBox = (props) => {
    return (
        <div className={`relative dotted ${props.className ? props.className : ''}`}>
            <p className="text-white absolute" style={{ top: '-10px', left: '40px', fontFamily: "SourceSansPro", fontSize: '100%', fontWeight: 'bold' }}>
                { props.title || 'Title' }
            </p>
        </div>
    )
}