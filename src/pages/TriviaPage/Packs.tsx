import React, { useEffect, useState } from 'react';
import {
    IonContent,
    IonPage,
    IonItem,
    IonHeader,
    IonText,
    IonButton,
    IonLabel,
    IonImg,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonAlert,
    IonFooter,
} from '@ionic/react';
import { useHistory } from "react-router";
import { firebase } from "../../Firebase/firebaseConfig";

import "../Home.css";

const Packs: React.FC = () => {

    const history = useHistory();
    var db = firebase.firestore();
    var currUser = firebase.auth().currentUser?.uid;
    var empty: any[] | (() => any[]) = [];

    const [myPacks, setMyPacks] = useState(empty);
    const [invPacks, setInvPacks] = useState(empty);
    const [packsList, setPacksList] = useState(empty);
    const [confirm, setConfirm] = useState(false);

    const [id, setId] = useState("");

    const [invited, setInvited] = useState("success");
    const [personal, setPersonal] = useState("primary");

    const [alert, setAlert] = useState(false);

    const [createdPacks, setCreatedPacks] = useState(false);

    useEffect(() => {
        db.collection("users").doc(currUser).get().then(function (doc) {
            var data = doc.data();

            var packsRef = data?.packs;
            var invRef = data?.invitedPacks;

            setPacksList(packsRef);

            var arr: any[] = [];
            var inv: any[] = [];

            for (let i of invRef) {
                db.collection("packs").doc(i).get().then(function (invDoc) {
                    var iData = invDoc.data();
                    if (iData) {
                        var temp = ({
                            user: iData?.username,
                            invited: iData?.invited,
                            name: iData?.name,
                            questions: iData?.questions,
                            id: invDoc.id,
                        })
                        invPacks.push(temp);
                    }
                })
            }

            for (let pack of packsRef) {
                db.collection("packs").doc(pack).get().then(function (packDoc) {
                    var pData = packDoc.data();
                    if (pData) {
                        var temp = ({
                            user: pData?.username,
                            invited: pData?.invited,
                            name: pData?.name,
                            questions: pData?.questions,
                            id: packDoc.id,
                        })
                        arr.push(temp);
                    }
                })
            }
            setTimeout(() => {
                setMyPacks(arr);
            }, 500);
        });
    }, []);

    function goToCreate() {
        history.push("Create")
    }

    function goToPackView(pack: any) {
        history.push("PackView", pack)
    }

    function goToAnswer(pack: any) {
        history.push("packQuestion", pack)
    }

    function showInvited() {
        setCreatedPacks(false);
        setInvited("success");
        setPersonal("primary");
    }

    function showCreated() {
        setCreatedPacks(true);
        setInvited("primary");
        setPersonal("success");
    }

    function removePack() {
        console.log(`Removing Pack: ${id}`);
        db.collection("packs").doc(id).delete().then(() => {
            var filtered = myPacks.filter((item) => item.id !== id);
            setMyPacks(filtered);
        }).catch((e) => {
            console.log(e);
        })
        document.querySelector("ion-item-sliding")?.closeOpened();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonItem lines="none">
                    <IonButton
                        id="back"
                        style={{ position: "fixed", left: 0 }}
                        fill="clear"
                        onClick={() => history.push("/tabs/tab2")}
                    >
                        <IonImg
                            style={{ width: 45, height: 45 }}
                            src={"../assets/pinkGoBack.png"}
                        />
                    </IonButton>
                    <IonText class="headerText1">Packs</IonText>
                </IonItem>
            </IonHeader>
            <IonContent class='ionContent'>
                <IonItem lines="none">
                    <IonButton color="tertiary" size="large" class="packButtons" onClick={goToCreate}> Create a new pack </IonButton>
                </IonItem>
                <IonItem class="packSwitch" lines="none">
                    <IonButton color={invited} onClick={showInvited}>Invited Packs</IonButton>
                    <IonButton color={personal} onClick={showCreated}>Your Packs</IonButton>
                </IonItem>
                {createdPacks ? (
                    <>
                        {myPacks.map((pack: any, index: any) => {
                            return (
                                <IonItemSliding key={pack.id}>
                                    <IonItem lines="full" class='fql_item' onClick={() => goToPackView(pack)}>
                                        <IonText class='fql_name'>{pack.name}</IonText>
                                    </IonItem>
                                    <IonItemOptions side="end">
                                        <IonItemOption id={index} color="danger" onClick={() => { setAlert(true); setId(pack.id) }}>Delete</IonItemOption>
                                    </IonItemOptions>
                                </IonItemSliding>

                            )
                        })}
                        <div className="warnText">
                            *Slide pack to delete*
                        </div>
                    </>
                )
                    :
                    invPacks.map((pack: any, index: any) => {
                        return (
                            <IonItem key={pack.id} lines="full" class='fql_item' onClick={() => goToAnswer(pack)}>
                                <IonLabel color='light'>{pack.name}</IonLabel>
                                <IonText class='fql_name'>By: {pack.user}</IonText>
                            </IonItem>
                        )
                    })
                }

                <IonAlert
                    isOpen={alert}
                    onDidDismiss={() => setAlert(false)}
                    header={'Are you sure?'}
                    message={"This will delete the pack permanently"}
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: () => {
                                console.log('Confirm Cancel: blah');
                                document.querySelector("ion-item-sliding")?.closeOpened();
                            }
                        },
                        {
                            text: 'Yes',
                            handler: () => {
                                removePack();
                            }
                        }
                    ]}
                />
            </IonContent>
        </IonPage>
    );
};

export default Packs;
