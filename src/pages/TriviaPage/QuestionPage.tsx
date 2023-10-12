import { firebase } from "../../Firebase/firebaseConfig";
import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonItem,
    IonHeader,
    IonBackButton,
    IonCard,
    IonRow,
    IonText,
    IonButton,
    IonImg,
    IonGrid,
} from '@ionic/react';

import { useHistory } from "react-router";

import StarRatingComponent from 'react-star-rating-component';
import { useLocation } from "react-router-dom";
import { Toast } from "../../components/toast";

const QuestionPage: React.FC = () => {
    const emptyarr: any = []
    const location = useLocation();
    const history = useHistory();

    const [points, setPoints] = useState(4);
    const [id, setId] = useState("");
    const [image, setImage] = useState("");

    const [isImage, setIsImage] = useState(false);

    const [category, setCategory] = useState("");
    const [questions, setQuestions] = useState(emptyarr);
    const [rating, setRating] = useState(0);
    const [total, setTotal] = useState(0);

    const [question, setQuestion] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [answer, setAnswer] = useState("");
    const [submitBool, setSubmitBool] = useState(false);

    const [norm, setNorm] = useState(false);
    const [end, setEnd] = useState(false);

    const [option1bool, setoption1Bool] = useState(false);
    const [option2bool, setoption2Bool] = useState(false);
    const [option3bool, setoption3Bool] = useState(false);
    const [option4bool, setoption4Bool] = useState(false);

    var db = firebase.firestore();
    var currUser = firebase.auth().currentUser?.uid;

    useEffect(() => {
        var category: any = location.state;
        setCategory(category);
        var query = category.toLowerCase().replace(" ", "");
        db.collection(query).get().then((snap) => {
            snap.forEach((doc) => {
                var data = doc.data();
                var arr = data.answered;
                var rat = data.rated;
                if (!arr.includes(currUser)) {
                    var item = ({
                        image: data.image,
                        question: data.question,
                        answer: data.answer,
                        option1: data.option1,
                        option2: data.option2,
                        option3: data.option3,
                        option4: data.option4,
                        id: doc.id,
                        rating: data.rating,
                        total: data.ratingTotal,
                    })
                    questions.push(item);

                    if(rat?.includes(currUser)) {
                        setSubmitBool(true)
                    }
                }
            });

            if (questions.length > 0) {
                let temp: String = questions[0].option1;
                if (temp.includes("https://firebasestorage.googleapis.com")) {
                    setNorm(false);
                    setIsImage(true);
                    setImage(questions[0].image);
                    setQuestion(questions[0].question);
                    setAnswer(questions[0].answer);
                    setOption1(questions[0].option1);
                    setOption2(questions[0].option2);
                    setOption3(questions[0].option3);
                    setOption4(questions[0].option4);
                    setId(questions[0].id);
                    setTotal(questions[0].total);
                    setRating((questions[0].rating)/(questions[0].total));
                } else {
                    setNorm(true);
                    setIsImage(false);
                    setImage(questions[0].image);
                    setQuestion(questions[0].question);
                    setAnswer(questions[0].answer);
                    setOption1(questions[0].option1);
                    setOption2(questions[0].option2);
                    setOption3(questions[0].option3);
                    setOption4(questions[0].option4);
                    setId(questions[0].id);
                    setTotal(questions[0].total);
                    setRating((questions[0].rating)/(questions[0].total));
                }
            } else {
                setQuestion("You have answered all questions");
                setNorm(false);
                setEnd(true);
                setSubmitBool(true);
                setIsImage(false);
                setImage("");
            }
        });
    }, []);

    function setAnswered() {
        var query = category.toLowerCase().replace(" ", "");
        db.collection(query).doc(id).update({
            answered: firebase.firestore.FieldValue.arrayUnion(currUser)
        })
    }

    function checkAnswer(option: any) {
        var temp = "set" + option + "Bool(true)"
        eval(temp);
        if (option === answer) {

            Toast("Correct! +" + points + " Points!")
            db.collection("users").doc(currUser).update({
                score: firebase.firestore.FieldValue.increment(points)
            })

            setPoints(4);

            setoption1Bool(false);
            setoption2Bool(false);
            setoption3Bool(false);
            setoption4Bool(false);

            questions.shift()

            setAnswered();
            if (questions.length > 0) {
                let temp: String = questions[0].option1;
                if (temp.includes("https://firebasestorage.googleapis.com")) {
                    setNorm(false);
                    setIsImage(true);
                    setImage(questions[0].image);
                    setQuestion(questions[0].question);
                    setAnswer(questions[0].answer);
                    setOption1(questions[0].option1);
                    setOption2(questions[0].option2);
                    setOption3(questions[0].option3);
                    setOption4(questions[0].option4);
                    setId(questions[0].id);
                    setTotal(questions[0].total);
                    setRating((questions[0].rating) / (questions[0].total));
                    setSubmitBool(false);
                } else {
                    setNorm(true);
                    setIsImage(false);
                    setImage(questions[0].image);
                    setQuestion(questions[0].question);
                    setAnswer(questions[0].answer);
                    setOption1(questions[0].option1);
                    setOption2(questions[0].option2);
                    setOption3(questions[0].option3);
                    setOption4(questions[0].option4);
                    setId(questions[0].id);
                    setTotal(questions[0].total);
                    setRating((questions[0].rating) / (questions[0].total));
                    setSubmitBool(false);
                }
            } else {
                setQuestion("You have answered all questions");
                setNorm(false);
                setEnd(true);
                setSubmitBool(true);
                setIsImage(false);
                setImage("");
            }
        } else {
            setPoints(points - 1);
            Toast("Wrong! -1 point, Try again.");
        }
    }

    function submitReview() {
        var query = category.toLowerCase().replace(" ", "");
        db.collection(query).doc(id).update({
            rated: firebase.firestore.FieldValue.arrayUnion(currUser),
            rating: firebase.firestore.FieldValue.increment(rating),
            ratingTotal: firebase.firestore.FieldValue.increment(1)
        })
        setSubmitBool(true);
    }

    function home() {
        history.replace("/tabs/tab2");
    }

    function goToCategory() {
        history.goBack();
    }

    function leaderboard() {
        history.replace("/tabs/tab3");
    }

    function packs() {
        history.replace("Packs");
    }

    return (
        <IonPage>
            <IonHeader>
                <IonItem lines="none">
                    <IonButton
                        id="back"
                        style={{ position: "fixed", left: 0 }}
                        fill="clear"
                        onClick={() => history.goBack()}
                    >
                        <IonImg
                            style={{ width: 45, height: 45 }}
                            src={"../assets/pinkGoBack.png"}
                        />
                    </IonButton>
                    <IonText class="headerText1">{category}</IonText>
                </IonItem>
            </IonHeader>

            <IonContent class='ionContent'>
                <IonCard class="questionCard">
                    {image ? (
                        <IonImg class="avatar" src={image} />
                    ) : null}
                    <h5 className="question">
                        {question}
                    </h5>
                    {isImage ? (
                        <>
                            <IonGrid>
                                <IonRow>
                                    <IonImg class="imageOption" onClick={() => checkAnswer("option1")} src={option1} />
                                    <IonImg class="imageOption" onClick={() => checkAnswer("option2")} src={option2} />
                                </IonRow>
                                <IonRow>
                                    <IonImg class="imageOption" onClick={() => checkAnswer("option3")} src={option3} />
                                    <IonImg class="imageOption" onClick={() => checkAnswer("option4")} src={option4} />
                                </IonRow>
                            </IonGrid>
                        </>
                    ) : (
                        (null)
                    )}

                    {end ? (
                        <>
                            <IonButton onClick={home} color="secondary" expand="block">
                                <IonText class="optionButton">Go to Home</IonText>
                            </IonButton>
                            <IonButton onClick={goToCategory} color="secondary" expand="block">
                                <IonText class="optionButton">Choose a new category</IonText>
                            </IonButton>
                            <IonButton onClick={leaderboard} color="secondary" expand="block">
                                <IonText class="optionButton">Go to Leaderboard</IonText>
                            </IonButton>
                            <IonButton onClick={packs} color="secondary" expand="block">
                                <IonText class="optionButton">Go to Packs</IonText>
                            </IonButton></>
                    ) : (null)}

                    {norm ? (
                        <>
                            <IonButton disabled={option1bool} onClick={() => checkAnswer("option1")} color="secondary" expand="block">
                                <IonText class="optionButton">{option1}</IonText>
                            </IonButton>
                            <IonButton disabled={option2bool} onClick={() => checkAnswer("option2")} color="secondary" expand="block">
                                <IonText class="optionButton">{option2}</IonText>
                            </IonButton>
                            <IonButton disabled={option3bool} onClick={() => checkAnswer("option3")} color="secondary" expand="block">
                                <IonText class="optionButton">{option3}</IonText>
                            </IonButton>
                            <IonButton disabled={option4bool} onClick={() => checkAnswer("option4")} color="secondary" expand="block">
                                <IonText class="optionButton">{option4}</IonText>
                            </IonButton></>
                    ) : (null)}



                </IonCard>
                {submitBool ? (
                    <div className="rating">
                        <StarRatingComponent
                            name="rate1"
                            starCount={5}
                            value={rating}
                            onStarClick={setRating}
                            editing={false}
                        />
                    </div>) : (
                    <div className="rating">
                        <StarRatingComponent
                            name="rate1"
                            starCount={5}
                            value={rating}
                            onStarClick={setRating}
                        />
                    </div>)}

                <div className="submitButton">
                    <IonButton disabled={submitBool} onClick={submitReview}>Submit</IonButton>
                </div>
            </IonContent>
        </IonPage>
    )
};
export default QuestionPage;
