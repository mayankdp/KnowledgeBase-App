//User Create Trivia Page
import React, { useEffect, useState } from "react";
import {
    IonContent,
    IonPage,
    IonInput,
    IonHeader,
    IonBackButton,
    IonButton,
    IonImg,
    IonItem,
    IonText,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonAlert,
    IonCard,
    IonGrid,
    IonCol,
    IonRow,
} from '@ionic/react';
import { Plugins, CameraResultType } from '@capacitor/core';
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";

const UserCreateTrivia: React.FC = () => {
    const { Camera } = Plugins;
    var empty: any[] | (() => any[]) = [];

    const history = useHistory();
    const location = useLocation();

    const [image, setImage] = useState("../assets/image.png");

    const [alert, setAlert] = useState(false);
    const [preview, setPreview] = useState(false);

    const [question, setQuestion] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [answer, setAnswer] = useState("");
    const [packName, setPackName] = useState("");

    const [questions, setQuestions] = useState(empty);

    useEffect(() => {
        var temp: any = location.state;
        var questions = temp.questions;
        var name = temp.packName;


        if (name)
            setPackName(name);
        else
            setPackName("");

        if (questions)
            setQuestions(questions);
        else
            setQuestions(empty)

        return () => {
            setImage("../assets/image.png");
            setAlert(false);
            setPreview(false);
            setQuestion("");
            setQuestions(empty);
            setOption1("");
            setOption2("");
            setOption3("");
            setOption4("");
            setAnswer("");
        }
    }, []);

    function submitQuestion() {
        if (question && option1 && option2 && option3 && option4 && answer) {
            var answered: any = [];
            var trivia = ({
                question,
                answer,
                option1,
                option2,
                option3,
                option4,
                answered,
                image: image,
            });
            questions.push(trivia);

            setQuestion("");
            setAnswer("");
            setOption1("");
            setOption2("");
            setOption3("");
            setOption4("");
            setImage("");

            var temp = {
                packName,
                questions
            }

            history.replace("Create", temp)
            // if (image !== "../assets/image.png") {
            //     let uploadTask = storageRef.ref(randomId).putString(image, "data_url");
            //     uploadTask.on("state_changed", (snapshot: any) => {
            //         console.log("Progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            //     },
            //         error => {
            //             console.log(error);
            //         },
            //         () => {
            //             uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
            //                 var trivia = ({
            //                     question,
            //                     answer,
            //                     option1,
            //                     option2,
            //                     option3,
            //                     option4,
            //                     answered,
            //                     image: url,
            //                 });
            //                 db.collection("userTrivia").doc().set(trivia);
            //             })
            //             history.push("/tabs/tab2")
            //             Toast("Question submitted!")
            //         });
            // } else {
            //     var trivia = ({
            //         question,
            //         answer,
            //         option1,
            //         option2,
            //         option3,
            //         option4,
            //         answered,
            //         image: temp,
            //     });
            //     db.collection("userTrivia").doc().set(trivia);
            //     history.push("/tabs/tab2")
            //     Toast("Question submitted!")
            // }
        } else {
            setAlert(true)
        }
    }

    async function takePicture() {
        const image = await Camera.getPhoto({
            quality: 50,
            allowEditing: false,
            resultType: CameraResultType.DataUrl
        })

        var imageUrl = image.dataUrl;

        if (imageUrl)
            setImage(imageUrl);
    }

    async function showPreview() {
        if (question && option1 && option2 && option3 && option4 && answer) {
            if (preview) setPreview(false)
            else setPreview(true);
        } else {
            setAlert(true)
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonRow>
                    <IonBackButton />
                    <IonItem lines="none">
                        <IonText class="headerText">Create Trivia</IonText>
                    </IonItem>
                </IonRow>
            </IonHeader>
            {preview ? (
                <IonContent className='ion-padding' class='ionContent'>
                    <IonItem><IonText class="ion-text-center" className="previewText">This is how the question will appear to others!</IonText></IonItem>
                    <IonCard class="questionCard">
                        {image !== "../assets/image.png" ? (<IonImg class="avatar" src={image} />) : (null)}
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
                                <IonButton onClick={showPreview}>Toggle Preview</IonButton>
                            </IonCol>
                            <IonCol>
                                <IonButton onClick={submitQuestion}>Submit Question</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            ) : (
                <IonContent className='ion-padding' class='ionContent'>
                    <IonImg class="avatar" src={image ? image : ("../assets/image.png")} />

                    <IonItem lines="none">
                        <IonText class="link" onClick={takePicture}>Add an image</IonText>
                    </IonItem>

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
                                <IonButton onClick={showPreview}>Show Preview</IonButton>
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

export default UserCreateTrivia;
