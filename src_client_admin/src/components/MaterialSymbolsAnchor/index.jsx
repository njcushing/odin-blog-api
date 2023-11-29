import PropTypes from 'prop-types';
import './index.css';

const MaterialSymbolsAnchor = ({
    href,
    ariaLabel,
    text,
    sizeRem,
}) => {
    return (
        <a
            className="MaterialSymbolsAnchor"
            style={{
                width: `${sizeRem}rem`,
                height: `${sizeRem}rem`,
            }}
            href={href}
            aria-label={ariaLabel}
        >
            <ul><li
                className="material-symbols-rounded"
                style={{
                    fontSize: `${sizeRem * 0.8}rem`,
                }}
            >{text}</li></ul>
        </a>
    )
};

MaterialSymbolsAnchor.propTypes = {
    href: PropTypes.string,
    ariaLabel: PropTypes.string,
    text: PropTypes.string,
    sizeRem: PropTypes.number,
}

MaterialSymbolsAnchor.defaultProps = {
    href: null,
    ariaLabel: "",
    text: "Button",
    sizeRem: 1.0,
}

export default MaterialSymbolsAnchor;