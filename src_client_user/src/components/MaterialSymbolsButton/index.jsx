import PropTypes from 'prop-types';
import './index.css';

const MaterialSymbolsAnchor = ({
    ariaLabel,
    text,
    onClickHandler,
    sizeRem,
}) => {
    return (
        <button
            className="MaterialSymbolsAnchor"
            style={{
                width: `${sizeRem}rem`,
                height: `${sizeRem}rem`,
            }}
            onClick={(e) => {
                onClickHandler(e);
                e.currentTarget.blur();
                e.preventDefault();
            }}
            onMouseLeave={(e) => {
                e.currentTarget.blur();
            }}
            aria-label={ariaLabel}
        >
            <ul><li
                className="material-symbols-rounded"
                style={{
                    fontSize: `${sizeRem * 0.8}rem`,
                }}
            >{text}</li></ul>
        </button>
    )
};

MaterialSymbolsAnchor.propTypes = {
    ariaLabel: PropTypes.string,
    text: PropTypes.string,
    onClickHandler: PropTypes.func,
    sizeRem: PropTypes.number,
}

MaterialSymbolsAnchor.defaultProps = {
    ariaLabel: "",
    text: "Button",
    onClickHandler: () => {},
    sizeRem: 1.0,
}

export default MaterialSymbolsAnchor;