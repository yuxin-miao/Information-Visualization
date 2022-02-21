import "../../index.css"

export const ContainerBox = (props) => {
    const BackgroundStyle = {
        backgroundImage: `url(${props.url})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
    }

    return (
        <div className={`relative dotted ${props.className ? props.className : ''}`} style={props.url ? BackgroundStyle : {}}>
            <p className="text-white absolute font-ssp font-bold" style={{ top: '-10px', left: '40px' }}>
                { props.title || 'Title' }
            </p>
            {props.children}
        </div>
    )
}