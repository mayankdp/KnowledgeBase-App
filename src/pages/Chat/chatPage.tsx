import React, { useEffect, useState } from "react";
import {
    IonContent,
    IonPage,
    IonHeader,
    IonImg,
    IonButton,
    IonFooter,
    IonItem,
    IonText,
    IonTextarea,
    IonRow,
    IonCol,
    IonGrid,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import { firebase } from "../../Firebase/firebaseConfig";

const ChatPage: React.FC = () => {
    const history = useHistory();
    const location = useLocation();
    const emptyarr: any = [];
    const emp: string = "";
    const [textMessage, setTextMessage] = useState("");
    const [msgArray, setMsgArray] = useState(emptyarr);
    const [msgUid, setMsgUid] = useState("");
    const [username, setUsername] = useState("");
    const [dummy, setDummy] = useState("");
    var currUser = firebase.auth().currentUser?.uid;

    useEffect(() => {
        var data: any;
        var mUid: any;
        var fUid: any;
        data = location.state;
        fUid = data.uid;
        setUsername(data.username);

        if (currUser)
            if (fUid < currUser) {
                mUid = (fUid + currUser)
            } else {
                mUid = (currUser + fUid)
            }

        setMsgUid(mUid);
        var db = firebase.database().ref("Chat/" + mUid);
        db.on("child_added", function (snapshot) {
            msgArray.push(snapshot.val());
            // console.log(snapshot.val().time);
            setTimeout(() => {
                updateDummy();
            }, 100);
        })
    }, []);

    function updateDummy() {
        var randomId = Math.random().toString(36).substr(2, 12);
        setDummy(randomId);
    }

    function sendMessage() {
        if (textMessage !== "") {
            var timeStamp = new Date();
            var hours = timeStamp.getHours();
            var findTime;
            if (hours >= 13) {
                var minutes = "";
                var min = timeStamp.getMinutes();
                if (min < 10) {
                    minutes = "0" + min;
                } else {
                    minutes += min;
                }
                findTime = hours - 12 + ":" + minutes + " PM";
            } else {
                var minutes = "";
                var min = timeStamp.getMinutes();
                if (min < 10) {
                    minutes = "0" + min;
                } else {
                    minutes += min;
                }
                findTime = hours + ":" + minutes + " AM";
            }
            var date = timeStamp.getMonth() + 1 + "/" + timeStamp.getDate() + "/" + timeStamp.getFullYear();

            var db = firebase.database();
            var chatRef = db.ref('Chat/' + msgUid);
            var newKey = chatRef.push().key;
            var ref = db.ref('Chat/' + msgUid + '/' + newKey);
            ref.set({
                from: currUser,
                message: textMessage,
                time: findTime,
                date: date,
            })
            setTextMessage(emp);
        }
    }

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
                    <IonText class="headerText1">{username}</IonText>
                </IonItem>
            </IonHeader>

            <IonContent class="ionContent">
                {msgArray.length !== 0 ? (
                    <IonGrid>
                        {msgArray.map((msg: any, index: any) => {
                            return (
                                <IonRow class="chatRow" key={index}>
                                    {msg.from === currUser ? (
                                        <IonCol class="chatItem1">
                                            <span className="spanStyle1" >{msg.message}</span>
                                            <br></br>
                                            <div className="divStyle1">{msg.time}</div>
                                        </IonCol>
                                    ) : (
                                        <IonCol class="chatItem">
                                            <span className="spanStyle">{msg.message}</span>
                                            <br></br>
                                            <div className="divStyle">{msg.time}</div>
                                        </IonCol>
                                    )}
                                </IonRow>
                            );
                        })}
                    </IonGrid>
                ) : null}
            </IonContent>

            <IonFooter class="footer">
                <IonRow>
                    <IonCol size="10">
                        <IonTextarea
                            autoGrow
                            inputMode="text"
                            class="textMessageInput"
                            placeholder="Text Message"
                            rows={1}
                            maxlength={200}
                            value={textMessage}
                            onIonChange={(e: any) => setTextMessage(e.target.value)}
                        ></IonTextarea>
                    </IonCol>
                    <IonCol size="2">
                        <IonButton
                            class="sendButton"
                            style={{ position: "fixed", right: 0 }}
                            fill="clear"
                            onClick={() => sendMessage()}
                        >
                            <IonImg
                                style={{ width: 30, height: 30 }}
                                src={"../assets/sendLogo.png"}
                            />
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonFooter>
        </IonPage>
    );
};

export default ChatPage;
