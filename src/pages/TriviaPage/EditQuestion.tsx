import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonHeader,
    IonImg,
    IonItem,
    IonButton,
    IonText,
    IonInput,
    IonAvatar,
    IonLabel,
    IonTextarea,
    IonSelectOption,
    IonSelect,
    IonGrid,
    IonRow,
    IonCol,
    IonAlert,
    IonCard,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { Plugins, CameraResultType } from '@capacitor/core';
import { firebase } from "../../Firebase/firebaseConfig";

const EditQuestion: React.FC = () => {
    const { Camera } = Plugins;

    const history = useHistory();
    const location = useLocation();

    const [image, setImage] = useState("");

    const [index, setIndex] = useState(0);

    const [alert, setAlert] = useState(false);
    const [preview, setPreview] = useState(false);

    const [question, setQuestion] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [answer, setAnswer] = useState("");

    const [questionArr, setQuestionArr] = useState(Array());
    var empty: any[] | (() => any[]) = [];


    const [pack, setPack] = useState({
        id: "",
        invited: empty,
        name: "",
        questions: empty,
        user: "",
    });

    useEffect(() => {
        var temp: any = location.state!;
        var pack = temp.pack;
        var question = pack.questions[temp.index];
        var filtered = pack.questions.filter((item: any) => item !== question);

        setQuestionArr(filtered);
        setIndex(temp.index);
        setPack(pack);
        setImage(question.image);
        setQuestion(question.question);
        setOption1(question.option1);
        setOption2(question.option2);
        setOption3(question.option3);
        setOption4(question.option4);
        setAnswer(question.answer);
    }, []);

    function submitQuestion() {
        let temp = (questionArr.concat({
            image,
            answer,
            option1,
            option2,
            option3,
            option4,
            answered:[],
            question,
        }));

        let sendItem = {
            id:pack.id,
            invited:pack.invited,
            name:pack.name,
            questions:temp,
            user: pack.user,
        }

        history.replace("/PackView", sendItem)

    }

    return (
        <IonPage>
            <IonHeader>
                <IonItem lines="none">
                    <IonButton
                        style={{ position: "fixed", left: 0 }}
                        fill="clear"
                        onClick={() => history.replace("/PackView", pack)}
                    >
                        <IonImg
                            style={{ width: 45, height: 45 }}
                            src={"../assets/pinkGoBack.png"}
                        />
                    </IonButton>
                    <IonText class="headerText1">Edit Question</IonText>
                </IonItem>
            </IonHeader>

            {preview ? (
                <IonContent className='ion-padding' class='ionContent'>
                    <IonItem><IonText class="ion-text-center" className="previewText">This is how the question will appear to others!</IonText></IonItem>
                    <IonCard class="questionCard">
                        {image ? (<IonImg class="avatar" src={image} />) : (null)}
                        <h5 className="question">
                            {question}
                        </h5>

                        <IonButton color="secondary" expand="block">
                            <IonText class="optionButton">{option1}</IonText>
                        </IonButton>
                        <IonButton color="secondary" expand="block">
                            <IonText class="optionButton">{option2}</IonText>
                        </IonButton>
                        <IonButton color="secondary" expand="block">
                            <IonText class="optionButton">{option3}</IonText>
                        </IonButton>
                        <IonButton color="secondary" expand="block">
                            <IonText class="optionButton">{option4}</IonText>
                        </IonButton>
                    </IonCard>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <IonButton onClick={() => setPreview(!preview)}>Toggle Preview</IonButton>
                            </IonCol>
                            <IonCol>
                                <IonButton onClick={() => console.log("Submitted")}>Submit Question</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            ) : (
                <IonContent className='ion-padding' class='ionContent'>
                    <IonImg class="avatar" src={image ? image : ("../assets/image.png")} />

                    <IonLabel class="createText">Question <IonText class="required">(required)</IonText></IonLabel>
                    <IonTextarea id="question" maxlength={100} value={question} class="loginInput" placeholder="Type question here..." onIonChange={(e: any) => setQuestion(e.target.value)} />

                    <IonLabel class="createText">Option A <IonText class="required">(required)</IonText></IonLabel>
                    <IonInput id="option1" maxlength={28} value={option1} required class="loginInput" placeholder="Type Option A..." onIonChange={(e: any) => setOption1(e.target.value)} />

                    <IonLabel class="createText">Option B <IonText class="required">(required)</IonText></IonLabel>
                    <IonInput id="option2" maxlength={28} value={option2} class="loginInput" placeholder="Type Option B..." onIonChange={(e: any) => setOption2(e.target.value)} />

                    <IonLabel class="createText">Option C <IonText class="required">(required)</IonText></IonLabel>
                    <IonInput id="option3" maxlength={28} value={option3} class="loginInput" placeholder="Type Option C..." onIonChange={(e: any) => setOption3(e.target.value)} />

                    <IonLabel class="createText">Option D <IonText class="required">(required)</IonText></IonLabel>
                    <IonInput id="option4" maxlength={28} value={option4} class="loginInput" placeholder="Type Option D..." onIonChange={(e: any) => setOption4(e.target.value)} />

                    <IonItem lines="none">
                        <IonLabel style={{ color: "white" }}>Select Answer <IonText class="required">(required)</IonText></IonLabel>
                        <IonSelect id="select" class="loginInput" placeholder="Select Answer" value={answer} onIonChange={e => setAnswer(e.detail.value)}>
                            <IonSelectOption value="option1">Option A</IonSelectOption>
                            <IonSelectOption value="option2">Option B</IonSelectOption>
                            <IonSelectOption value="option3">Option C</IonSelectOption>
                            <IonSelectOption value="option4">Option D</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <IonButton onClick={() => setPreview(!preview)}>Show Preview</IonButton>
                            </IonCol>
                            <IonCol>
                                <IonButton onClick={submitQuestion}>Submit Question</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <IonAlert
                        cssClass='alert'
                        isOpen={alert}
                        onDidDismiss={() => setAlert(false)}
                        header={'Required fields'}
                        message={"Please enter all required fields"}
                        buttons={["Ok"]}
                    />
                </IonContent>
            )}

        </IonPage>
    );
};

export default EditQuestion;