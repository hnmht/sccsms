export const transformProps = (props) => {
    let newStyles = {};
    if (Array.isArray(props.style)) {
        props.style.forEach(a => {
            if (typeof (a) === "object") {
                newStyles = { ...newStyles, ...a }
            }
        });
    }
    if (!newStyles.paddingHorizontal) { newStyles.paddingHorizontal = 16 };
    if (!newStyles.fontSize) { newStyles.fontSize = 16 };
    if (!newStyles.marginLeft) { newStyles.marginLeft = 56 };
    if (!newStyles.marginRight) { newStyles.marginRight = 56 };
    if (!newStyles.height) { newStyles.height = 48 };
    if (!newStyles.color) { newStyles.color = "rgb(27,27,31" };
    if (props.placeholderTextColor) { newStyles.placeholderTextColor = props.placeholderTextColor };
    if (props.selectionColor) { newStyles.selectionColor = props.selectionColor };

    return newStyles;
}