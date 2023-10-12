//User Categories Page
import React, { useEffect, useState } from 'react';
import {
    IonContent,
    IonPage,
    IonItem,
    IonHeader,
    IonBackButton,
    IonRow,
    IonText,
    IonCard,
    IonButton,
    IonImg

} from '@ionic/react';
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { Toast } from "../../components/toast";

import "../Home.css";

const PackQuestion: React.FC = () => {
    var empty: any[] | (() => any[]) = [];

    const history = useHistory();
    const location = useLocation();

    const [packName, setPackName] = useState("");
    const [questions, setQuestions] = useState(empty);
    const [image, setImage] = useState("");


    const [question, setQuestion] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [answer, setAnswer] = useState("");

    const [option1bool, setoption1Bool] = useState(false);
    const [option2bool, setoption2Bool] = useState(false);
    const [option3bool, setoption3Bool] = useState(false);
    const [option4bool, setoption4Bool] = useState(false);

    const [end, setEnd] = useState(false);


    useEffect(() => {
        var pack: any = location.state;
        setPackName(pack.name);
        var temp = pack.questions;

        setTimeout(() => {
            setQuestions(temp);
            if (temp.length > 0) {
                setImage(temp[0].image);
                setQuestion(temp[0].question);
                setAnswer(temp[0].answer);
                setOption1(temp[0].option1);
                setOption2(temp[0].option2);
                setOption3(temp[0].option3);
                setOption4(temp[0].option4);
            } else {
                setQuestion("You have answered all questions");
                setEnd(true);
            }
        }, 300);
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

            if (questions.length > 0) {
                setImage(questions[0].image);
                setQuestion(questions[0].question);
                setAnswer(questions[0].answer);
                setOption1(questions[0].option1);
                setOption2(questions[0].option2);
                setOption3(questions[0].option3);
                setOption4(questions[0].option4);
            } else {
                setQuestion("You have answered all questions");
                setEnd(true);
            }
        } else {
            Toast("Wrong!");
        }
    }

    function home() {
        history.replace("/tabs/tab2");
    }

    function packs() {
        history.replace("Packs");
    }

    return (
        <IonPage>
            <IonHeader>
                <IonRow>
                    <IonBackButton />
                    <IonItem lines="none">
                        <IonText class="headerText">{packName} Questions</IonText>
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
                    {end ? (
                        <>
                            <IonButton disabled={false} onClick={home} color="secondary" expand="block">
                                <IonText class="optionButton">Home</IonText>
                            </IonButton>
                            <IonButton disabled={false} onClick={packs} color="secondary" expand="block">
                                <IonText class="optionButton">Back to Packs</IonText>
                            </IonButton></>
                    ) : (
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
                    )}
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default PackQuestion;
