import React, { Fragment, useEffect } from "react";
import "./index.css";
import Controls from "../../components/Control";
import Main from "../../components/Main";
import axios from "axios";
import { useDispatch } from "react-redux";

const Game = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        axios({
            url: "https://deckofcardsapi.com/api/deck/new/",
            method: "GET",
        })
            .then((res) => {
                dispatch({
                    type: "SET_DECK_CARD",
                    payload: res.data,
                });
            })
            .catch((err) => console.log(err));
    }, [dispatch]);

    return (
        <Fragment>
            <Controls />
            <Main />
        </Fragment>
    );
};

export default Game;
