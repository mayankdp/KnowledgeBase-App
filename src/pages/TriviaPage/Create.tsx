import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonItem,
    IonHeader,
    IonText,
    IonButton,
    IonInput,
    IonAvatar,
    IonAlert,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonImg

} from '@ionic/react';
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { firebase } from "../../Firebase/firebaseConfig";
import { Toast } from "../../components/toast";

import "../Home.css";

const Create: React.FC = () => {

    var empty: any[] | (() => any[]) = [];
    var db = firebase.firestore();
    var storageRef = firebase.storage();
    var uid = firebase.auth().currentUser?.uid;

    const history = useHistory();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [alert, setAlert] = useState(false);
    const [check, setCheck] = useState(false);
    const [dummy, setDummy] = useState(false);

    const [packName, setPackName] = useState("");
    const [questions, setQuestions] = useState(empty);

    function addQuestion() {
        var temp = {
            packName,
            questions
        }
        history.push("UserCreatePage", temp)
    }

    useEffect(() => {
        var temp: any = location.state;

        if(temp) {
            var iQuestions = temp.questions;
            var name = temp.packName;

            if (questions)
                setQuestions(iQuestions);
            else
                setQuestions(empty);

            if(name) {
                setPackName(name);
            }
            else
                setPackName("")
            
        }

        db.collection("users").doc(uid).get().then(function (doc) {
            var data = doc.data();
            setUsername(data?.username);
        })
    }, []);

    function uploadPics() {
        return new Promise<void>((resolve, reject) => {
            for (let question of questions) {
                if (question.image === "") {

                } else if (question.image !== "../assets/image.png") {
                    var randomId = Math.random().toString(36).substr(2, 12);
                    let uploadTask = storageRef.ref(randomId).putString(question.image, "data_url");
                    uploadTask.on("state_changed", (snapshot: any) => {
                        console.log("Progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    },
                        error => {
                            console.log(error);
                        },
                        () => {
                            uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
                                question.image = url;
                            })
                        });
                }
                else {
                    question.image = "";
                }
            }
            resolve();
        })
    }
    function checkInput() {
        if (questions.length > 0 && packName !== "") {
            setAlert(true);
        } else {
            setCheck(true);
        }
    }
    function createPack() {
        uploadPics().then(response => {
            db.collection("packs").add({
                invited: [],
                questions: questions,
                name: packName,
                username: username,
                uid: uid,
            }).then(function (docRef) {
                db.collection("users").doc(uid).update({
                    packs: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                })
            })
            history.push("/tabs/tab2");
            Toast("Pack Created!");
        }).catch(error => {
            console.log(error);
            console.log(questions)
        })
    }

    function removeQuestion(question: any) {
        const temp = questions;
        const index = temp.indexOf(question)
        if (index > -1)
            temp.splice(index, 1);

        setQuestions(temp)
        setDummy(true)

        document.querySelector("ion-item-sliding")?.closeOpened()
        console.log(questions)
    }
    return (
        <IonPage>
            <IonHeader>
                <IonItem lines="none">
                    <IonButton
                        style={{ position: "fixed", left: 0 }}
                        fill="clear"
                        onClick={() => history.push("/Packs")}
                    >
                        <IonImg
                            style={{ width: 45, height: 45 }}
                            src={"../assets/pinkGoBack.png"}
                        />
                    </IonButton>
                    <IonText class="headerText1">Create Pack</IonText>
                </IonItem>
            </IonHeader>

            <IonContent class='ionContent'>
                <IonInput
                    id="input"
                    value={packName}
                    maxlength={15}
                    title="Pack Name"
                    class="packInput"
                    type="text"
                    placeholder="Pack Name"
                    onIonChange={(e: any) => setPackName(e.target.value)}
                />

                <IonButton class="packButton" expand="block" fill="clear" color="tertiary" size="large" onClick={addQuestion}> Add Question </IonButton>

                {questions.map((question: any, index: any) => {
                    return (
                        <IonItemSliding id="slide" key={index}>
                            <IonItem lines="none" class='fql_item'>
                                <IonAvatar slot='start'>
                                    <img alt="" src={question.image ? question.image : ("../assets/image.png")} />
                                </IonAvatar>
                                <IonText class='fql_name'>{question.question}</IonText>
                            </IonItem>

                            <IonItemOptions side="end">
                                <IonItemOption color="danger" onClick={() => removeQuestion(question)}>Remove</IonItemOption>
                            </IonItemOptions>
                        </IonItemSliding>
                    )
                })}

                <IonButton id="create" color="tertiary" size="large" class="homeButtons" expand="full" onClick={checkInput}> Create Pack </IonButton>

                <IonAlert
                    cssClass='alert'
                    isOpen={alert}
                    onDidDismiss={() => setAlert(false)}
                    header={'Create Pack?'}
                    message={"Please make sure you have entered all of the questions"}
                    buttons={[
                        {
                            text: 'No',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: blah => {
                                console.log('Confirm Cancel');
                            }
                        },
                        {
                            text: 'Yes',
                            handler: () => {
                                createPack()
                            }
                        }
                    ]}
                />
                <IonAlert
                    cssClass='alert'
                    isOpen={check}
                    onDidDismiss={() => setCheck(false)}
                    header={'Required fields'}
                    message={"Please enter all required fields"}
                    buttons={["Ok"]}
                />
                <div className="dangerText">
                    You will not be able to add/edit any images or questions after submission
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Create;
