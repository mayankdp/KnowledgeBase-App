import React, { useEffect, useState } from 'react';
import {
    IonContent,
    IonPage,
    IonHeader,
    IonImg,
    IonItem,
    IonText,
    IonCard,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { firebase } from "../../Firebase/firebaseConfig";
import { Toast } from '../../components/toast';

const User: React.FC = () => {
    var empty: any[] | (() => any[]) = [];

    const history = useHistory();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [totalFriends, setTotalFriends] = useState(0);
    const [score, setScore] = useState(0);
    const [image, setImage] = useState("../assets/person.png");
    const [userUid, setUserUid] = useState("");
    const [bool, setBool] = useState(true);
    const [chat, setChat] = useState(false);
    const [msgUid, setMsgUid] = useState("");
    const [userData, setUserData] = useState(empty)

    var currUser = firebase.auth().currentUser?.uid;
    var db = firebase.firestore().collection("users");

    useEffect(() => {
        var userData: any;
        var friends: Array<any> = [];
        var currFriends: Array<any> = [];

        userData = location.state;
        setUserData(userData);
        setUserUid(userData.id)
        if (userData) {
            db.doc(userData.uid).get().then(function (doc) {
                var data = doc.data();
                if (data) {
                    setUserUid(userData.uid);
                    setUsername(data.username);
                    setScore(data.score);
                    setImage(data.url);
                    friends = data.friends;
                }

                if (friends !== null) {
                    let i = 0;
                    for (let friend of friends) {
                        if (friend.status === "Friends") {
                            setMsgUid(friend.msgUid)
                            i++;
                        }
                    }
                    setTotalFriends(i);
                }
            });

            db.doc(currUser).get().then(function (doc) {
                var data = doc.data();
                var fnd: any;
                if (data) {
                    fnd = data.friends;
                }
                if (fnd !== null) {
                    for (let f1 of fnd) {
                        if (f1.uid === userData.uid && f1.status === "Friends") {
                            setBool(false);
                            setChat(true);
                        }
                    }
                }
            });

            if (currUser === userData.uid) {
                setBool(false);
            }
        }

        setTimeout(() => {
            if (userData.uid === currUser) {
                setChat(false)
            } else if (bool === false) {
                setChat(false)
            }

        }, 300);
    }, []);

    function sendRequest() {
        var bool = true;
        var listOfFriends: Array<any> = [];

        db.doc(currUser).get().then(function (doc) {
            var data = doc.data();
            if (data) {
                listOfFriends = data.friends;
            }
            if (listOfFriends != null) {
                for (let friend of listOfFriends) {
                    if (friend.going_uid === userUid) {
                        bool = false;
                    }
                }
            }
        });
        setTimeout(function () {
            if (bool) {

                if (userUid === currUser) {
                    Toast("You cannot send friend request to your self!")
                } else {
                    db.doc(currUser).update({
                        friends: firebase.firestore.FieldValue.arrayUnion({
                            username: username,
                            going_uid: userUid,
                            status: "requestSentTo",
                        })
                    })
                    db.doc(currUser).get().then(function (doc) {
                        var data = doc.data();
                        if (data) {
                            db.doc(userUid).update({
                                friends: firebase.firestore.FieldValue.arrayUnion({
                                    username: data.username,
                                    coming_uid: currUser,
                                    status: "requestReceivedFrom",
                                })
                            })
                        }
                    })

                    Toast("Friend Request Sent!");
                }
            } else {
                Toast("Friend Request Already Sent!");
            }
        }, 1000);
    }

    function chatFriend() {
        history.push("/Chat", userData);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonItem lines="none" class="topmargin">
                    <IonButton id="back" style={{ position: "fixed", left: 0 }} fill="clear" onClick={() => history.goBack()}>
                        <IonImg style={{ width: 45, height: 45 }} src={"../assets/pinkGoBack.png"} />
                    </IonButton>

                    <IonText class="username">{username}</IonText>

                    {bool ? (
                        <IonButton style={{ position: "fixed", right: 0 }} fill="clear" onClick={() => sendRequest()}>
                            <IonImg style={{ width: 30, height: 28 }} src={"../assets/pinkAddFriend.png"} />
                        </IonButton>
                    ) : null}
                    {chat ? (
                        <IonButton style={{ position: "fixed", right: 0 }} fill="clear" onClick={() => chatFriend()}>
                            <IonImg style={{ width: 30, height: 30 }} src={"../assets/chat1.png"} />
                        </IonButton>
                    ) : null}
                </IonItem>
            </IonHeader>

            <IonContent class="ionContent">
                <IonImg class="avatar" src={image ? image : ("../assets/person.png")}></IonImg>
                <IonCard class="cardBackcolor">
                    <IonGrid>
                        <IonRow>
                            {!bool ? (
                                <IonCol class='infoOfUser'>
                                    <IonLabel class="userLabel">Friends</IonLabel>
                                </IonCol>
                            ) : null}
                            <IonCol class='infoOfUser'>
                                <IonLabel class="userLabel">Score</IonLabel>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            {!bool ? (
                                <IonCol class='infoOfUser'>
                                    <IonText class="userText">{totalFriends}</IonText>
                                </IonCol>
                            ) : null}
                            <IonCol class='infoOfUser'>
                                <IonText class="userText">{score}</IonText>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonCard>
            </IonContent>

        </IonPage>
    );
};

export default User;