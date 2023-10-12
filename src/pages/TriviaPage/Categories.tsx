//User Categories Page
import React from 'react';
import {
    IonContent,
    IonPage,
    IonList,
    IonItem,
    IonHeader,
    IonBackButton,
    IonRow,
    IonIcon,
    IonText,
    IonButton,
    IonImg

} from '@ionic/react';
import { categorieslist } from '../../categorieslist';
import { useHistory } from "react-router";
import { chevronForwardOutline } from "ionicons/icons";

import "../Home.css";

const Categories: React.FC = () => {
    const history = useHistory();
    var categories = categorieslist;

    function goToQuestions(category: String) {
        history.push("QuestionPage", category)
    }

    return (
        <IonPage>
            <IonHeader>
                <IonItem lines="none">
                    <IonButton
                        id="back"
                        style={{ position: "fixed", left: 0 }}
                        fill="clear"
                        onClick={() => history.goBack()}
                    >
                        <IonImg
                            style={{ width: 45, height: 45 }}
                            src={"../assets/pinkGoBack.png"}
                        />
                    </IonButton>
                    <IonText class="headerText1">Categories</IonText>
                </IonItem>
            </IonHeader>

            <IonContent class='ionContent'>
                <IonList class="topmargin">
                    {categories.map((category, index) => {
                        return (
                            <IonItem lines="full" key={index} onClick={() => { if (category) goToQuestions(category) }}>
                                <IonText class="categoryText">{category}</IonText>
                                <IonIcon slot='end' class="chevColor" icon={chevronForwardOutline}></IonIcon>
                            </IonItem>
                        )
                    })}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Categories;
