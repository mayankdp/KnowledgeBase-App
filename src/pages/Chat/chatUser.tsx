import React, { useEffect, useState } from "react";
import {
    IonContent,
    IonPage,
    IonHeader,
    IonButton,
    IonItem,
    IonText,
    IonImg,
    IonList,
    IonAvatar,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { firebase } from "../../Firebase/firebaseConfig";

const ChatUser: React.FC = () => {
    const history = useHistory();
    const empArray: any = [];
    const [friendList, setFriendList] = useState(empArray);
    var currUser = firebase.auth().currentUser?.uid;

    useEffect(() => {
        var friends: Array<any> = [];
        var friendsList: Array<any> = [];

        firebase.firestore().collection("users")
            .doc(currUser).onSnapshot(function (doc) {
                var data = doc.data();
                if (data) {
                    friends = data.friends;
                }
                if (friends != null) {
                    for (let friend of friends) {
                        if (friend.status === "Friends") {
                            var image: any;
                            firebase.firestore().collection("users")
                                .doc(friend.uid).get().then(function (doc) {
                                    var data = doc.data();
                                    if (data) {
                                        image = data.url;
                                        friendsList.push({
                                            uid: friend.uid,
                                            url: image,
                                            username: friend.username
                                        });
                                    }
                                });
                        }
                    }
                }
                setTimeout(() => {
                    setFriendList(friendsList)
                }, 1000);
            });
    }, []);

    return (
        <IonPage>
           <IonHeader>
                <IonItem lines="none">
                    <IonButton
                        style={{ position: "fixed", left: 0 }}
                        fill="clear"
                        onClick={() => history.goBack()}
                    >
                        <IonImg
                            style={{ width: 45, height: 45 }}
                            src={"../assets/pinkGoBack.png"}
                        />
                    </IonButton>
                    <IonText class="headerText1">Chat</IonText>
                </IonItem>
            </IonHeader>

            <IonContent class="ionContent">
                {friendList.length !== 0 ? (
                    <IonList class="list">
                        {friendList.map((user: any, index: any) => {
                            return (
                                <IonItem key={index} lines="none" class='itemss' onClick={() => history.push("/Chat", user)}>
                                    <IonAvatar slot='start'>
                                        <img src={user.url ? user.url : ("../assets/person.png")} />
                                    </IonAvatar>
                                    <IonText class='fql_name'>{user.username}</IonText>
                                </IonItem>
                            )
                        })}
                    </IonList>
                    // </IonCard>
                ) : null}
            </IonContent>

        </IonPage>
    );
};

export default ChatUser;
