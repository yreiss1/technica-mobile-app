import React, { Component } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  ViewContainer,
  Heading,
  SubHeading,
  Button,
  PadContainer,
} from '../components/Base';
import Modal from "react-native-modal";
import { colors } from '../components/Colors';
import firebase from 'react-native-firebase';
import QuestionCard from '../components/QuestionCard'
import { AsyncStorage } from "react-native"
import { H1, H2, H3, H4, H6, P } from '../components/Text';
import Toast from 'react-native-simple-toast';

export default class Mentors extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { question: '', tableNumber: "", newQuestionScreen:false, listData: [] };
    this.sendQuestion = this.sendQuestion.bind(this);
    this.showToast = this.showToast.bind(this);
  }
  // initially loads question data
  async componentDidMount() {
    const listData = [];
    const question = await AsyncStorage.getItem("questions");
    const qList = JSON.parse(question)
    this.setState({listData: qList})
  }
  clearInputs() {
    this.setState({ question: '', tableNumber: ''});
  }
  cancelQuestion() {
    this.setState({ question: '', newQuestionScreen: !this.state.newQuestionScreen });
  }
  toggleModal() {
    this.setState({ newQuestionScreen: !this.state.newQuestionScreen });
  }
  storeQuestion = async (questionObject) => {
    try {
      let questions = await AsyncStorage.getItem("questions")
      var qList
      if (questions != null) {
        qList = JSON.parse(questions)
        qList.unshift(questionObject)
      } else {
        qList = [questionObject]
      }
      await AsyncStorage.setItem("questions", JSON.stringify(qList))
      this.setState({listData: qList})
      this.clearInputs()
    } catch (error) {
      // Error saving data
      console.log(error)
    }
  }

  showToast() {
    // Show toast after 600ms
    // This 600ms delay ensures the toast loads after the modal animation close
    // happens. There is a weird iOS issue where toast will vanish the moment
    // modal closes. This is the best workaround I could make for now.
    setTimeout(() => {
      Toast.show('Question sent! Our next available mentor will come assist you.', Toast.LONG);
    }, 400)
  }

  async sendQuestion() {
    if (this.state.question === '' || this.state.tableNumber === '') {
      Alert.alert(
        "Try Again",
        "Your question or location was empty.",
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      );
    } else {
      const fcmToken = await AsyncStorage.getItem("FCMToken");
      var questionObject = {
        question: this.state.question,
        tableNumber: this.state.tableNumber,
        status: "Awaiting Response",
        key: this.state.question,
      }
      if (fcmToken != null) {
        questionObject.fcmToken = fcmToken
      }
      var questionString = JSON.stringify(questionObject)
      fetch('https://technicamentorshipservertest.herokuapp.com/question', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: questionString,
      }).catch(error => {
        console.log(error)
      })
      this.storeQuestion(questionObject)

      // TODO: show popup with feedback

      this.showToast();
      this.toggleModal()

    }
  }
  renderHeading() {
    return (
      <React.Fragment>
        <Heading>
          Mentors
        </Heading>
        <SubHeading>
          Ask our mentors for help
        </SubHeading>
      </React.Fragment>
      )
  }

  renderNewQuestionModal() {
    const { question, tableNumber, newQuestionScreen  } = this.state;
    return (
      <Modal
        isVisible={newQuestionScreen}
        backdropColor={colors.black}
        backdropOpacity={1}
        animationInTiming={250}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationOutTiming={300}
        backdropTransitionInTiming={250}
        backdropTransitionOutTiming={300}
        avoidKeyboard={true}
        onBackButtonPress={() => this.toggleModal()}
        style={{ margin: 0 }}
      >
        <View style={{ padding: 20 }}>
          <H3 style={{ color: 'white', marginBottom: 10 }}>How can we help you?</H3>
          <TextInput
            style={{
              borderColor: colors.white,
              borderBottomWidth: 1,
              padding: 0,
              fontFamily: "Poppins-Regular",
              paddingBottom: 2,
              marginBottom: 20,
              fontSize: 14,
              color: colors.white,
            }}
            onChangeText={(text) => this.setState({question: text})}
            value={question}
            underlineColorAndroid='transparent'
            placeholder="How do I make X using Y?"
            placeholderTextColor="#666666"
          />
          <View marginTop = {10}>
            <H3 style={{ color: 'white', marginBottom: 10 }}>Where can we find you?</H3>
            <TextInput
              style={{
                borderColor: colors.white,
                borderBottomWidth: 1,
                fontFamily: "Poppins-Regular",
                padding: 0,
                paddingBottom: 2,
                fontSize: 14,
                color: colors.white,
              }}              onChangeText={(text) => this.setState({tableNumber: text})}
              value={tableNumber}
              underlineColorAndroid='transparent'
              placeholder="Table B5"
              placeholderTextColor="#666666"
            />
          </View>
        </View>
        <View marginTop = {10}>
        <TouchableOpacity onPress={() => this.sendQuestion()}>
          <Button
            text="Submit Question"
          />
        </TouchableOpacity>
        </View>
        <View marginTop = {10}>
          <TouchableOpacity onPress={() => this.cancelQuestion()}>
            <Button
              text="Cancel"
            />
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  render() {
    const dimensions = require('Dimensions').get('window');
    const buttonWidth = (dimensions.width / 2) - 30;

    this.notificationListener = firebase
    .notifications()
    .onNotification(async (notification: Notification) => {
      console.log('notification received', notification.body);
      var msg = notification.body;
      // checking that the message is for a question being claimed
      if (msg.indexOf("Your question: ") != -1) {
        var question = msg.substring(msg.indexOf("Your question: ") + 15, msg.indexOf("has been claimed!")-1)
        console.log(question)
        let questions = await AsyncStorage.getItem("questions")
        var qList = JSON.parse(questions)
        // update status of question
        qList.forEach((element, index) => {
          if (element.question == question){
            console.log("found!")
            element.status = "Responded!"
            qList[index] = element
          }
        })
        // store update in local storage
        await AsyncStorage.setItem("questions", JSON.stringify(qList))
        this.setState({listData: qList})
      }
    });

      return (
      <ViewContainer>
      <PadContainer>
        {this.renderHeading()}
        {this.renderNewQuestionModal()}
      </PadContainer>
      <TouchableOpacity
        onPress={() => { this.toggleModal() }}
        style={{ marginBottom: 40 }}
      >
        <Button text="Ask a Question" />
      </TouchableOpacity>
      <PadContainer>
        <H2 style={{ marginBottom: 20 }}>Your Questions</H2>
        <FlatList
            data = {this.state.listData}
            renderItem={({item}) => <QuestionCard question = {item.question} status = {item.status}/>}
          />
      </PadContainer>
    </ViewContainer>
    )
    }
  }
