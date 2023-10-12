import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonItem,
    IonHeader,
    IonText,
    IonButton,
    IonAvatar,
    IonAlert,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonImg,
    IonFooter

} from '@ionic/react';
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { firebase } from "../../Firebase/firebaseConfig";
import { Toast } from "../../components/toast";

import "../Home.css";

const PackView: React.FC = () => {

    var empty: any[] | (() => any[]) = [];
    var db = firebase.firestore();
    var storageRef = firebase.storage();
    var uid = firebase.auth().currentUser?.uid;

    const history = useHistory();
    const location = useLocation();

    const [friends, setFriends] = useState(empty);
    const [invite, setInvite] = useState(empty);

    const [alert, setAlert] = useState(false);
    const [id, setId] = useState("");
    const [dummy, setDummy] = useState(false);

    const [pack, setPack] = useState(empty);
    const [questions, setQuestions] = useState(empty);

    const [invited, setInvited] = useState(empty);

    useEffect(() => {
        var pack: any = location.state;
        var fin: any = [];

        setId(pack.id);
        setPack(pack);
        setQuestions(pack.questions);
        setInvited(pack.invited);

        for (let f of pack.invited) {
            fin.push(f.uid)
        }

        db.collection("users").doc(uid).get().then(function (doc) {
            var data = doc.data();
            var temp = data?.friends;
            var arr: any = [];

            for (let p of temp) {
                if (p.status === "Friends" && !fin.includes(p.uid)) {
                    arr.push(p)
                }
            }

            setFriends(arr);
        })
    }, []);

    function removeQuestion(question: any) {
        if (questions.length > 1) {
            const temp = questions;
            const index = temp.indexOf(question)
            if (index > -1)
                temp.splice(index, 1);

            setQuestions(temp)
            setDummy(true)

            document.querySelector("ion-item-sliding")?.closeOpened();
        } else {
            setAlert(true)
        }
    }

    async function submit() {
        if (questions.length > 0) {
            var arr = questions;
            if (invite.length > 0) {
                var total = invited.concat(invite)
                db.collection("packs").doc(id).update({
                    invited: (total)
                })
                for (let p of invite) {
                    db.collection("users").doc(p.uid).update({
                        invitedPacks: firebase.firestore.FieldValue.arrayUnion(id)
                    })
                }
            }
            db.collection("packs").doc(id).update({
                questions: (arr),
            })
            history.push("");
            Toast("Pack Updated!");
        } else {
            setAlert(true);
        }
    }

    function goToEdit(question: any) {
        var i = questions.indexOf(question);
        var temp = {
            index: i,
            pack,
        }
        history.push("/EditQuestion", temp)
        document.querySelector("ion-item-sliding")?.closeOpened()
    }

    return (
        <IonPage>
            <IonHeader>
                <IonItem lines="none">
                    <IonButton
                        style={{ position: "fixed", left: 0 }}
                        fill="clear"
                        onClick={() => history.replace("/Packs")}
                    >
                        <IonImg
                            style={{ width: 45, height: 45 }}
                            src={"../assets/pinkGoBack.png"}
                        />
                    </IonButton>
                    <IonText class="headerText1">Edit Pack</IonText>
                </IonItem>
            </IonHeader>

            <IonContent class='ionContent'>
                <IonItem class="packFriends">
                    <IonLabel color="light">Friends</IonLabel>
                    <IonSelect value={invite} multiple={true} cancelText="Cancel" okText="Submit" onIonChange={e => setInvite(e.detail.value)}>
                        {friends.map((friend: any, index: any) => {
                            return (
                                <IonSelectOption key={index} value={friend}>{friend.username}</IonSelectOption>
                            )
                        })}
                    </IonSelect>
                </IonItem>

                <IonItem lines="full" class="packFriends">
                    <IonText class="packText">Invited Friends</IonText>
                </IonItem>

                {invited.length > 0 ? invited.map((i: any, index: any) => {
                    return (
                        <IonItem lines="full" key={index}>
                            <IonText class='fql_name'>
                                {i.username}
                            </IonText>
                        </IonItem>
                    )
                }) : (<IonItem lines="none"><IonText class='fql_name'>No friends invited yet</IonText></IonItem>)}


                <IonItem lines="full" class="packFriends">
                    <IonText class="packText">Questions</IonText>
                </IonItem>
                <div id="questions">
                    {questions.map((question: any, index: any) => {
                        return (
                            <IonItemSliding id="slide" key={index}>
                                <IonItem lines="none" class='fql_item'>
                                    <IonAvatar slot='start'>
                                        <img src={question.image ? question.image : ("../assets/image.png")} />
                                    </IonAvatar>
                                    <IonText class='fql_name'>{question.question}</IonText>
                                </IonItem>
                                <IonItemOptions side="end">
                                    <IonItemOption id={index} onClick={() => goToEdit(question)}>Edit Question</IonItemOption>
                                    <IonItemOption color="danger" onClick={() => removeQuestion(question)}>Remove</IonItemOption>
                                </IonItemOptions>
                            </IonItemSliding>
                        )
                    })}
                </div>

                <IonButton className="mrgn" color="tertiary" size="large" class="homeButtons" expand="full" onClick={submit}> Submit </IonButton>

                <div className="warnText">
                    *Slide question for more options*
                </div>
                
                <IonAlert
                    cssClass='alert'
                    isOpen={alert}
                    onDidDismiss={() => setAlert(false)}
                    header={'Minimum Questions Required'}
                    message={"You need to have atleast 1 question"}
                    buttons={["Ok"]}
                />

            </IonContent>
        </IonPage>
    );
};

export default PackView;
