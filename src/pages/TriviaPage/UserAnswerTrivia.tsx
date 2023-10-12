//User Answer Page
import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonCard,
    IonHeader,
    IonBackButton,
    IonButton,
    IonText,
    IonImg,
    IonRow,
    IonItem,
} from '@ionic/react';
import { firebase } from "../../Firebase/firebaseConfig";
import { Toast } from "../../components/toast";
import StarRatingComponent from 'react-star-rating-component';

const UserAnswerTrivia: React.FC = () => {
    var db = firebase.firestore();
    var currUser = firebase.auth().currentUser?.uid;
    const emptyarr: any = []

    const [id, setId] = useState("");
    const [image, setImage] = useState("");

    const [questions, setQuestions] = useState(emptyarr);

    const [question, setQuestion] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [answer, setAnswer] = useState("");

    const [rating, setRating] = useState(0);
    const [total, setTotal] = useState(0);
    const [submitBool, setSubmitBool] = useState(false);

    const [option1bool, setoption1Bool] = useState(false);
    const [option2bool, setoption2Bool] = useState(false);
    const [option3bool, setoption3Bool] = useState(false);
    const [option4bool, setoption4Bool] = useState(false);

    function setAnswered() {
        db.collection("userTrivia").doc(id).update({
            answered: firebase.firestore.FieldValue.arrayUnion(currUser)
        })
    }

    useEffect(() => {
        db.collection("userTrivia").get().then((snap) => {
            snap.forEach((doc) => {
                var data = doc.data();
                var arr = data.answered;
                if (!arr.includes(currUser)) {
                    var item = ({
                        question: data.question,
                        answer: data.answer,
                        option1: data.option1,
                        option2: data.option2,
                        option3: data.option3,
                        option4: data.option4,
                        image: data.image,
                        id: doc.id,
                        rating: data.rating,
                        total: data.ratingTotal,
                    })
                    questions.push(item);
                }
            });

            if (questions.length > 0) {
                setQuestion(questions[0].question);
                setAnswer(questions[0].answer);
                setOption1(questions[0].option1);
                setOption2(questions[0].option2);
                setOption3(questions[0].option3);
                setOption4(questions[0].option4);
                setImage(questions[0].image);
                setId(questions[0].id);
                setTotal(questions[0].total);
                setRating((questions[0].rating)/(questions[0].total));
                setSubmitBool(false);
            } else {
                setQuestion("You have answered all questions");
                setOption1("Go to Homepage");
                setOption2("New Category");
                setOption3("");
                setOption4("");
            }
        });
    }, []);

    function checkAnswer(option: any) {
        var temp = "set" + option + "Bool(true)"
        eval(temp);
        if (option === answer) {
            Toast("Correct!")
            setoption1Bool(false);
            setoption2Bool(false);
            setoption3Bool(false);
            setoption4Bool(false);

            questions.shift()
            console.log(questions.length);

            setAnswered();
            if (questions.length > 0) {
                setQuestion(questions[0].question);
                setAnswer(questions[0].answer);
                setOption1(questions[0].option1);
                setOption2(questions[0].option2);
                setOption3(questions[0].option3);
                setOption4(questions[0].option4);
                setImage(questions[0].image);
                setId(questions[0].id);
                setTotal(questions[0].total);
                setRating((questions[0].rating)/(questions[0].total));
                setSubmitBool(false);
            } else {
                setQuestion("You have answered all questions");
                setOption1("Go to Homepage");
                setOption2("New Category");
                setOption3("");
                setOption4("");
            }
        } else {
            Toast("Wrong answer, Try Again!")
        }
    }

    function submitReview() {
        db.collection("userTrivia").doc(id).update({
            rating: firebase.firestore.FieldValue.increment(rating),
            ratingTotal: firebase.firestore.FieldValue.increment(1)
        })
        console.log(rating);
        setSubmitBool(true);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonRow>
                    <IonBackButton />
                    <IonItem lines="none">
                        <IonText class="headerText">Answer User Trivia</IonText>
                    </IonItem>
                </IonRow>
            </IonHeader>
            <IonContent class='ionContent'>
                <IonCard class="questionCard">

                    {image ? (
                        <IonImg class="avatar" src={image} />
                    ) : null}
                    <h5 className="question">
                        {question}
                    </h5>

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
                    </IonButton>
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
    );
};

export default UserAnswerTrivia;
