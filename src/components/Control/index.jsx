import axios from "axios";
import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const Control = () => {
    const dispatch = useDispatch();

    const playerList = useSelector((state) => {
        return state.player.playerList;
    });

    const deckCard = useSelector((state) => {
        return state.card.deckCard;
    });

    const countTurnGame = useSelector((state) => {
        return state.card.countTurnGame;
    });

    const shuffleCards = useCallback(() => {
        axios({
            url: `https://deckofcardsapi.com/api/deck/${deckCard.deck_id}/shuffle/`,
            method: "GET",
        })
            .then((res) => {
                dispatch({
                    type: "SHUFFLE_CARDS",
                    payload: res.data,
                });
            })
            .catch((err) => console.log(err));

        const players = [...playerList];
        players.map((player) => {
            return { ...player, ...(player.cards = []) };
        });

        dispatch({
            type: "SET_PLAYERS",
            payload: players,
        });

        dispatch({
            type: "REVEAL_CARDS",
            payload: false,
        });
    }, [deckCard, dispatch, playerList]);

    const drawCards = useCallback(() => {
        axios({
            url: `https://deckofcardsapi.com/api/deck/${deckCard.deck_id}/draw/?count=12`,
            method: "GET",
        })
            .then((res) => {
                const players = [...playerList];
                for (const i in res.data.cards) {
                    const playerIndex = i % 4;
                    players[playerIndex].cards.push(res.data.cards[i]);
                }

                dispatch({
                    type: "SET_PLAYERS",
                    payload: players,
                });
            })
            .catch((err) => console.log(err));
    }, [dispatch, deckCard, playerList]);

    const revealCards = useCallback(() => {
        dispatch({
            type: "REVEAL_CARDS",
            payload: true,
        });

        const players = [...playerList];
        // trừ mỗi người chơi 5000 tiền cược
        players.map((player) => {
            return { ...player, ...(player.totalPoint -= 5000) };
        });

        const result = [];
        // kiểm tra xem có trường hợp đặc biệt ko
        players.forEach((player) => {
            if (checkCardSpecial(player.cards) === 30) {
                result.push(player);
            }
        });

        if (result.length > 0) {
            // tiền cược 4 người là 20000 chia cho những ng có điểm cao
            const betPoint = Math.round(20000 / result.length);
            // cộng tiền cược cho từng người chơi
            result.forEach((player) => (player.totalPoint += betPoint));
        }

        // trường hợp bình thường
        if (result.length === 0) {
            // lấy ra danh sách đã tính điểm của các người chơi
            const arrScore = players.map((player) => calcScore(player.cards));
            // tìm điểm số cao nhất
            const maxScore = Math.max(...arrScore);
            // tìm những người chơi có điểm bằng với điểm số cao nhất
            const findPlayerMaxScore = players.filter(
                (player) => calcScore(player.cards) === maxScore
            );
            // tiền cược 4 người là 20000 chia cho những ng có điểm cao
            const betPoint = Math.round(20000 / findPlayerMaxScore.length);
            // cộng tiền cược cho từng người chơi
            findPlayerMaxScore.forEach(
                (player) => (player.totalPoint += betPoint)
            );
        }

        dispatch({
            type: "SET_PLAYERS",
            payload: players,
        });

        dispatch({
            type: "SET_SHUFFLED",
            payload: false,
        });

        dispatch({
            type: "COUNT_TURN_GAME",
        });
    }, [dispatch, playerList]);

    const checkCardSpecial = (arrCard) => {
        let result = 0;
        arrCard.forEach((card) => {
            if (
                card.value === "JACK" ||
                card.value === "QUEEN" ||
                card.value === "KING"
            ) {
                result += 10;
            }
        });
        return result;
    };

    const calcScore = (arrCard) => {
        let result = 0;
        arrCard.forEach((card) => {
            if (
                card.value === "JACK" ||
                card.value === "QUEEN" ||
                card.value === "KING" ||
                card.value === "10"
            ) {
                result += 10;
            } else if (card.value === "ACE") {
                result += 1;
            } else {
                result += card.value * 1;
            }
        });
        return result % 10;
    };

    useEffect(
        (props) => {
            if (countTurnGame === 5) {
                const players = [...playerList];
                const arrScore = players.map((player) => player.totalPoint);
                const maxScore = Math.max(...arrScore);
                const findPlayerMaxScore = players.filter(
                    (player) => player.totalPoint === maxScore
                );
                const alertPlayer = findPlayerMaxScore
                    .map((player) => player.username)
                    .join(", ");
                alert(`Người chơi ${alertPlayer} chiến thắng`);
            }
        },
        [countTurnGame, playerList]
    );

    return (
        <>
            <div className="d-flex justify-content-end container">
                <div className="border d-flex justify-content-center align-items-center px-2">
                    <button
                        disabled={deckCard.shuffled}
                        onClick={shuffleCards}
                        className="btn btn-success mr-2"
                    >
                        Shuffle
                    </button>
                    <button
                        disabled={
                            !deckCard.shuffled ||
                            playerList[0].cards.length !== 0
                        }
                        onClick={drawCards}
                        className="btn btn-info mr-2"
                    >
                        Draw
                    </button>
                    <button
                        disabled={
                            !deckCard.shuffled ||
                            playerList[0].cards.length === 0
                        }
                        onClick={revealCards}
                        className="btn btn-primary mr-2"
                    >
                        Reveal
                    </button>
                </div>
                <div className="d-flex">
                    {playerList.map((player) => {
                        return (
                            <div
                                key={player.username}
                                className="border px-3 text-center"
                            >
                                <p>{player.username}</p>
                                <p>{player.totalPoint}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Control;
