import "../../index.css"

export const ContainerBox = (props) => {
    return (
        <div className={`relative dotted ${props.className ? props.className : ''}`}>
            <p className="text-white absolute font-ssp font-bold" style={{ top: '-10px', left: '40px' }}>
                { props.title || 'Title' }
            </p>
        </div>
    )
}