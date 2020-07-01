const getTrProps = (state, rowInfo, instance) => {
    if (rowInfo) {
        return {
            style: {
                border: "solid 1px black",
                width: '100%',
                height: '100%',
            }
        }
    }
    return {};
}

export default getTrProps;