let initialState = {
    deckCard: {},
    isReveal: false,
    countTurnGame: 0,
};

const reducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case "SET_DECK_CARD":
            state.deckCard = payload;
            return { ...state };
        case "REVEAL_CARDS":
            state.isReveal = payload;
            return { ...state };
        case "SHUFFLE_CARDS":
            state.deckCard = payload;
            return { ...state };
        case "SET_SHUFFLED":
            state.deckCard.shuffled = payload;
            return { ...state };
        case "COUNT_TURN_GAME":
            state.countTurnGame = state.countTurnGame + 1;
            return { ...state };
        default:
            return state;
    }
};

export default reducer;
