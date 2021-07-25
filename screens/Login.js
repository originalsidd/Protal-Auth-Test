import React, {useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {Formik} from 'formik';
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons'
import {
	StyledContainer,
	InnerContainer,
	PageLogo,
	PageTitle,
	SubTitle,
	StyledFormArea,
	StyledInputLabel,
	LeftIcon,
	RightIcon,
	StyledButton,
	ButtonText,
	Colors,
	StyledTextInput,
	MsgBox,
	Line,
	ExtraView,
	ExtraText,
	TextLink,
	TextLinkContent
} from './../components/styles';
import { View, ActivityIndicator } from 'react-native'
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import axios from 'axios';
import * as Google from 'expo-google-app-auth';

const {brand, darkLight, primary} = Colors;

const Login = ({navigation}) => {
	const [hidePassword, setHidePassword] = useState(true);
	const [message, setMessage] = useState();
	const [messageType, setMessageType] = useState();
	const [googleSubmitting, setGoogleSubmitting] = useState(false);

	const handleLogin = (credentials, setSubmitting) => {
		handleMessage(null);
		const url = 'https://whispering-headland-00232.herokuapp.com/user/signin'
		axios
			.post(url, credentials)
			.then((response) => {
				const result = response.data;
				const {message, status, data} = result;

				if (status !== 'SUCCESS') {
					handleMessage(message, status);
				} else {
					navigation.navigate("Welcome", {...data[0]});
				}
				setSubmitting(false);
			})
			.catch(error => {
				console.log(error.JSON());
				setSubmitting(false);
				handleMessage("An error occured. Check your network and try again.")
		})
	}

	const handleMessage = (message, type = 'FAILED') => {
		setMessage(message);
		setMessageType(type);
	}

	const handleGoogleSignin = () => {
		setGoogleSubmitting(true);
		const config = { 
			iosClientId: `210632771715-gf4su59ouipv4ar5deejmumdsvpj6akm.apps.googleusercontent.com`,
			androidClientId: `210632771715-vqu4l9234sprsssjf2bst1mf7vumv0tf.apps.googleusercontent.com`,
			scopes: ['profile', 'email']
		};

		Google
			.logInAsync(config)
			.then((result) => {
				const {type, user} = result;

				if (type === 'success') {
					const {email, name, photoUrl} = user;
					handleMessage('Google Sign in successful');
					setTimeout(() => navigation.navigate("Welcome", {email, name, photoUrl}), 1000);
				} else {
					handleMessage('Google Sign in was cancelled')
				}
				setGoogleSubmitting(false);
			})
			.catch(error => {
				console.log(error);
				handleMessage('An error occured. Check your network and try again.');
				setGoogleSubmitting(false);
			})
	}

	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer>
			<StatusBar style="dark"/>
			<InnerContainer>
				<PageLogo resizeMode="contain" source={require('./../assets/img/protal.png')} />
				<PageTitle>PRODUCING TALENTS</PageTitle>
				<SubTitle>Account Login</SubTitle>

				<Formik
					initialValues={{email: '', password: ''}}
					onSubmit={(values, {setSubmitting}) => {
						if (values.email === '') {
							handleMessage("Email cannot be empty")
							setSubmitting(false);
						} else if (values.password === '') {
							handleMessage("Password cannot be empty")
							setSubmitting(false);
						} else {
							handleLogin(values, setSubmitting);
						}
					}}
				>{({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
					<StyledFormArea>
						<MyTextInput 
							label="Email Address"
							icon="mail"
							placeholder="talent@gmail.com"
							placeholderTextColor={darkLight}
							onChangeText={handleChange('email')}
							onBlur={handleBlur('email')}
							value={values.email}
							keyboardType="email-address"
						/>
						<MyTextInput 
							label="Password"
							icon="lock"
							placeholder="* * * * * * * * * *"
							placeholderTextColor={darkLight}
							onChangeText={handleChange('password')}
							onBlur={handleBlur('password')}
							value={values.password}
							secureTextEntry={hidePassword}
							isPassword={true}
							hidePassword={hidePassword}
							setHidePassword={setHidePassword}
						/>
						<MsgBox type={messageType}>{message}</MsgBox>
						{!isSubmitting && <StyledButton onPress={handleSubmit}>
							<ButtonText>Login</ButtonText>
						</StyledButton>}
						{isSubmitting && <StyledButton disabled={true}>
							<ActivityIndicator size="large" color={primary} />
						</StyledButton>}

						<Line />

						{!googleSubmitting && (
							<StyledButton google={true} onPress={handleGoogleSignin}>
								<Fontisto name="google" color={primary} size={25} />
								<ButtonText google={true}>Sign in with Google</ButtonText>
							</StyledButton>
						)}

						{googleSubmitting && (
							<StyledButton google={true} disabled={true}>
								<ActivityIndicator size="large" color={primary} />
							</StyledButton>
						)}
						
						<ExtraView>
							<ExtraText>Don't have any account already? </ExtraText>
							<TextLink onPress={() => navigation.navigate("Signup")}>
								<TextLinkContent>Sign up</TextLinkContent>
							</TextLink>
						</ExtraView>
					</StyledFormArea>
				)}

				</Formik>
			</InnerContainer>
		</StyledContainer>
		</KeyboardAvoidingWrapper>
	)
}

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
	return (
		<View>
			<LeftIcon>
				<Octicons name={icon} size={30} color={brand} />
			</LeftIcon>
			<StyledInputLabel>{label}</StyledInputLabel>
			<StyledTextInput {...props} />
			{isPassword && (
				<RightIcon onPress={() => setHidePassword(!hidePassword)}>
					<Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight} />
				</RightIcon>
			)}
		</View>
	)
}

export default Login;