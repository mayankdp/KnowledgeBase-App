import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonImg,
  IonButton,
  IonList,
  IonItem,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonAvatar,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
} from "@ionic/react";
import { useHistory } from "react-router";
import { firebase } from "../../Firebase/firebaseConfig";
import { Toast } from "../../components/toast";
import { checkmark, closeOutline } from "ionicons/icons";
import { RefresherEventDetail } from '@ionic/core';
import "../Home.css";

const Profile: React.FC = () => {
  const history = useHistory();
  const emptyarr: any = [];
  const [requestsArr, setRequestsArr] = useState(emptyarr);
  const [friendsArr, setFriendsArr] = useState(emptyarr);
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("../assets/person.png");
  const [score, setScore] = useState(0);

  var currUser = firebase.auth().currentUser?.uid;
  var db = firebase.firestore().collection("users");

  useEffect(() => {
    db.doc(currUser).onSnapshot(function (doc) {
      var friendReqList: Array<any> = [];
      var requests: Array<any> = [];
      var friends: Array<any> = [];

      var data = doc.data();
      if (data) {
        // var list = data.friends;
        friendReqList = data.friends;
        setUsername(data.username);
        setImage(data.url);
        setScore(data.score);
      }
      if (friendReqList != null) {
        // var temp: any = [];
        for (let friend of friendReqList) {
          if (friend.status === "requestReceivedFrom") {
            requests.push(friend);
          }
          else if (friend.status === "Friends") {
            var image: any;
            db.doc(friend.uid).get().then(function (doc) {
              var data = doc.data();
              if (data) {
                image = data.url;
                friends.push({
                  uid: friend.uid,
                  url: image,
                  username: friend.username,
                  score: data.score
                });
              }
            });
          }
        }
        setTimeout(() => {
          setRequestsArr(requests);
          setFriendsArr(friends);
        }, 1000);
      }
    });

  }, []);

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    var friendReqList: Array<any> = [];
    var requests: Array<any> = [];
    var friends: Array<any> = [];

    db.doc(currUser).get().then(function (doc) {
      var data = doc.data();
      if (data) {
        var list = data.friends;
        friendReqList = list;
        setUsername(data.username);
        setImage(data.url);
      }
      if (friendReqList != null) {
        // var temp: any = [];
        for (let friend of friendReqList) {
          if (friend.status === "requestReceivedFrom") {
            requests.push(friend);
          }
          else if (friend.status === "Friends") {
            var image = "";
            db.doc(friend.uid).get().then(function (doc) {
              var data = doc.data();
              if (data) {
                image = data.url;
                friends.push({
                  uid: friend.uid,
                  url: image,
                  username: friend.username,
                  score: data.score
                });
              }
            });
          }
        }
        setTimeout(() => {
          setRequestsArr(requests);
          setFriendsArr(friends);
        }, 1000);
      }
    });
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  }

  function acceptFriend(user: any) {
    console.log("Req Accepted");

    var msgUid = currUser + user.coming_uid;

    console.log(user);
    db.doc(currUser).update({
      friends: firebase.firestore.FieldValue.arrayUnion({
        username: user.username,
        uid: user.coming_uid,
        status: "Friends",
        msgUid: msgUid,
      })
    });
    db.doc(currUser).update({
      friends: firebase.firestore.FieldValue.arrayRemove({
        username: user.username,
        coming_uid: user.coming_uid,
        status: user.status,
      })
    });
    db.doc(currUser).get().then(function (doc) {
      var data = doc.data();
      if (data) {
        db.doc(user.coming_uid).update({
          friends: firebase.firestore.FieldValue.arrayUnion({
            username: data.username,
            uid: currUser,
            status: "Friends",
            msgUid: msgUid,
          })
        });
        db.doc(user.coming_uid).update({
          friends: firebase.firestore.FieldValue.arrayRemove({
            username: data.username,
            going_uid: currUser,
            status: "requestSentTo",
          })
        });
      }
    });
    requestsArr.pop({
      username: user.username,
      coming_uid: user.coming_uid,
      status: user.status,
    });
  }

  function rejectFriend(user: any) {
    console.log(user);
    db.doc(currUser).update({
      friends: firebase.firestore.FieldValue.arrayRemove({
        username: user.username,
        coming_uid: user.coming_uid,
        status: user.status,
      })
    });
    db.doc(currUser).get().then(function (doc) {
      var data = doc.data();
      if (data) {
        db.doc(user.coming_uid).update({
          friends: firebase.firestore.FieldValue.arrayRemove({
            username: data.username,
            going_uid: currUser,
            status: "requestSentTo",
          })
        });
      }
    });
    requestsArr.pop({
      username: user.username,
      coming_uid: user.coming_uid,
      status: user.status,
    });
  }

  function settings() {
    history.push("/Settings")
  }

  function chatUsers() {
    history.push("/ChatUser")
  }
  function quickAddFriend() {
    history.push("/quickAddUser")
  }
  return (
    <IonPage>
      <IonHeader>
        <IonItem class="topmargin" lines="none">
          <IonButton id="settings" style={{ position: "fixed", left: 0 }} fill="clear" onClick={settings}>
            <IonImg style={{ width: 30, height: 30 }} src={"../assets/setting.png"} />
          </IonButton>

          <IonText class="username">{username}</IonText>

          <IonButton style={{ position: "fixed", right: 0 }} fill="clear" onClick={() => chatUsers()}>
            <IonImg style={{ width: 30, height: 30 }} src={"../assets/chat1.png"} />
          </IonButton>
        </IonItem>
      </IonHeader>

      <IonContent class="ionContent">
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent>
          </IonRefresherContent>
        </IonRefresher>

        <IonImg class="avatar" src={image ? image : ("../assets/person.png")}></IonImg>

        <IonCard class="cardBackcolor">
          <IonGrid>
            <IonRow>
              <IonCol class='infoOfUser'>
                <IonLabel class="userLabel">Score</IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol class='infoOfUser'>
                <IonText class="userText">{score}</IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>

        {requestsArr.length !== 0 ? (
          <IonCard>
            <IonList>
              <IonItem lines="none">
                <IonText class='fql_label'>Friend Requests</IonText>
              </IonItem>
              {requestsArr.map((user: any, index: any) => {
                return (
                  <IonItem key={index} lines="none" class='itemss'>
                    <IonAvatar slot='start'>
                      <img src={user.url ? user.url : ("../assets/person.png")} />
                    </IonAvatar>
                    <IonText class='fql_name'>{user.username}</IonText>
                    <IonIcon slot='end' icon={closeOutline} onClick={() => rejectFriend(user)}></IonIcon>
                    <IonIcon slot='end' icon={checkmark} onClick={() => acceptFriend(user)}></IonIcon>
                  </IonItem>
                )
              })}
            </IonList>
          </IonCard>
        ) : null}

        {friendsArr.length !== 0 ? (
          // <IonCard>
          <IonList class="list">
            <IonItem class="center" lines="none">
              <IonLabel class="userLabel">Friends</IonLabel>
              <IonAvatar slot='end' style={{ width: 30, height: 30 }} onClick={() => quickAddFriend()}>
                <IonImg style={{ width: 30, height: 30 }} src={"../assets/pinkAddFriend.png"} />
              </IonAvatar>
            </IonItem>
            {friendsArr.map((user: any, index: any) => {
              return (
                <IonItem key={index} lines="none" class='itemss' onClick={() => history.push("/User", user)}>
                  <IonAvatar slot='start'>
                    <img src={user.url ? user.url : ("../assets/person.png")} />
                  </IonAvatar>
                  <IonText class='fql_name'>{user.username}</IonText>
                  <IonText class='fql_name' slot='end'>{user.score}</IonText>
                </IonItem>
              )
            })}
          </IonList>
          // </IonCard>
        ) : (
          <IonList class="list">
            <IonItem class="center" lines="none">
              <IonLabel class="userLabel">Friends</IonLabel>
              <IonAvatar slot='end' style={{ width: 30, height: 30 }} onClick={() => quickAddFriend()}>
                <IonImg style={{ width: 30, height: 30 }} src={"../assets/pinkAddFriend.png"} />
              </IonAvatar>
            </IonItem>
          </IonList>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Profile;