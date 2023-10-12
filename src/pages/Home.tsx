//Home Page
import React from 'react';
import {
  IonButton,
  IonContent,
  IonText,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  CreateAnimation,
} from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent className='ion-padding' class='ionContent'>
        <IonImg class="homeLogo" src={"../assets/K-bulb.png"} />
        <IonGrid>
          <IonRow>
            <IonCol>
              <CreateAnimation
                duration={3000}
                keyframes={[
                  { offset: 0, color: 'yellow' },
                  { offset: .5, color: 'red' },
                  { offset: 1, color: 'pink' }
                ]}
                easing="ease-out"
                iterations={500}
                play={true}
              >
                <IonText class="KLable">Knowledgebase</IonText>
              </CreateAnimation>
            </IonCol>
            <IonRow>
              <IonText class="botText">Login / Signup to get started</IonText>
            </IonRow>
          </IonRow>
        </IonGrid>

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton expand='block' shape="round" routerLink="/login">LOGIN</IonButton>
            </IonCol>
            <IonCol>
              <IonButton expand='block' shape="round" routerLink="/signup">SIGNUP</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
