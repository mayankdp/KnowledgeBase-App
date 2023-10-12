import React, { useState } from 'react';
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
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { firebase } from "../../Firebase/firebaseConfig";

const QuickAddUser: React.FC = () => {
    const history = useHistory();
    const [email, setEmail] = useState("");
    var empty: any[] | (() => any[]) = [];
    const [userData, setUserData] = useState(empty);
    const [fndUsername, setFndUsername] = useState("");
    const [fndImage, setFndImage] = useState("");
    const [fndScore, setFndScore] = useState(0);
    const [bool, setBool] = useState(false);

    var currUser = firebase.auth().currentUser?.uid;
    var db = firebase.firestore().collection("users");

    function searchFriend() {
        var userList: Array<any> = [];
        db.onSnapshot(function (querySnapshot) {
            userList = [];
            querySnapshot.forEach(function (doc) {
                var listUser = doc.data();
                if (listUser) {
                    userList.push({
                        email: listUser.email,
                        username: listUser.username,
                        url: listUser.url,
                        score: listUser.score,
                        uid: listUser.uid,
                        friends: listUser.friends,
                    });
                }
                for (let user of userList) {
                    if (email === user.email) {
                        setFndUsername(user.username);
                        setFndImage(user.url);
                        setFndScore(user.score);
                        setUserData(user);
                        setBool(true);
                    }
                }
            });
        });
    }

    function userPage() {
        history.push("/User", userData);
    }
    return (
        <IonPage>
            <IonHeader>
                <IonItem lines="full" class="topmargin">
                    <IonButton style={{ position: "fixed", left: 0 }} fill="clear" onClick={() => history.goBack()}>
                        <IonImg style={{ width: 45, height: 45 }} src={"../assets/pinkGoBack.png"} />
                    </IonButton>
                    <IonText class="username">Quick Add friends</IonText>
                </IonItem>
            </IonHeader>

            <IonContent class="ionContent">
                <IonText class="headtext">Enter your friend's email</IonText>
                <IonInput
                    title="email text"
                    class="emailInput"
                    placeholder="Email"
                    type="email"
                    onIonChange={(e: any) => setEmail(e.target.value)}
                />
                <IonButton class="searchButton" title="Search" onClick={searchFriend}>Search</IonButton>

                {bool === true ? (
                    <IonItem lines="inset" onClick={userPage}>
                        <IonAvatar slot='start'>
                            <img src={fndImage ? fndImage : ("../assets/person.png")} />
                        </IonAvatar>
                        <IonText class='fql_name'>{fndUsername}</IonText>
                        <IonText class='fql_name' slot='end'>{fndScore}</IonText>
                    </IonItem>
                ) : null}
            </IonContent>

        </IonPage>
    );
};

export default QuickAddUser;