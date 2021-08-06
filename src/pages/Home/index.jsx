import React, { useState, useCallback } from "react";
import Game from "../Game";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";

const validationSchema = yup.object().shape({
    username: yup.string().required("This field is required!"),
    email: yup
        .string()
        .email("Invalid Email")
        .required("This field is required!"),
    phone: yup
        .string()
        .required("This field is required!")
        .matches(/^[0-9]{10}$/g, "Invalid Phone number"),
});

const Home = () => {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            phone: "",
        },
        validationSchema,
        validateOnMount: true,
    });

    const setAllTouched = useCallback(() => {
        Object.keys(formik.values).forEach((key) =>
            formik.setFieldTouched(key)
        );
    }, [formik]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            setAllTouched();
            if (!formik.isValid) return;

            dispatch({
                type: "ADD_PLAYER",
                payload: { ...formik.values, totalPoint: 25000, cards: [] },
            });

            setIsGameStarted(true);
        },
        [setAllTouched, formik, dispatch]
    );

    const setDefaultPlayer = useCallback(() => {
        const defaultPlayer = {
            username: "hoanglam",
            email: "lam@gmail.com",
            phone: "0396323430",
        };
        formik.setValues(defaultPlayer);
    }, [formik]);

    return (
        <>
            {isGameStarted ? (
                <Game />
            ) : (
                <div
                    className="text-center"
                    style={{
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <h1 className="diplay-4 mb-5"> Welcome to Pocker Center</h1>
                    <h3>Fill your info and start</h3>
                    <form onSubmit={handleSubmit} className="w-25 mx-auto">
                        <input
                            type="input"
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="username"
                            className="w-100 form-control mb-3"
                        />
                        {formik.touched.username && (
                            <p className="text-danger">
                                {formik.errors.username}
                            </p>
                        )}

                        <input
                            type="input"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="email"
                            className="w-100 form-control mb-3"
                        />
                        {formik.touched.email && (
                            <p className="text-danger">{formik.errors.email}</p>
                        )}

                        <input
                            type="input"
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="phone"
                            className="w-100 form-control mb-3"
                        />
                        {formik.touched.phone && (
                            <p className="text-danger">{formik.errors.phone}</p>
                        )}

                        <button type="submit" className="btn btn-success">
                            Start new Game
                        </button>

                        <button
                            onClick={setDefaultPlayer}
                            type="button"
                            className="btn btn-info"
                        >
                            Set Default player
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Home;
