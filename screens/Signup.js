import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons'
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
import { View, TouchableOpacity, ActivityIndicator } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import axios from 'axios';

const { brand, darkLight, primary } = Colors;

const Signup = ({navigation}) => {
	const [hidePassword, setHidePassword] = useState(true);
	const [show, setShow] = useState(false);
	const [date, setDate] = useState(new Date(2000, 0, 1));
	
	const [message, setMessage] = useState();
	const [messageType, setMessageType] = useState();

	const [dob, setDob] = useState();

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(false);
		setDate(currentDate);
		setDob(currentDate);
	}

	const showDatePicker = () => {
		setShow(true);
	}


	const handleSignup = (credentials, setSubmitting) => {
		handleMessage(null);
		const url = 'https://whispering-headland-00232.herokuapp.com/user/signup'
		axios
			.post(url, credentials)
			.then((response) => {
				const result = response.data;
				const { message, status, data } = result;

				if (status !== 'SUCCESS') {
					handleMessage(message, status);
				} else {
					navigation.navigate("Welcome", { ...data });
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

	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer>
			<StatusBar style="dark"/>
			<InnerContainer>
				<PageTitle>PRODUCING TALENTS</PageTitle>
				<SubTitle>Account Signup</SubTitle>

				{show && (
					<DateTimePicker
						testID="dateTimePicker"
						value={date}
						mode='date'
						is24Hour={true}
						display="default"
						onChange={onChange}
					/>
				)}

				<Formik
					initialValues={{ name: '', email: '', dateOfBirth: '', password: '', confirmPassword: '' }}
					onSubmit={(values, {setSubmitting}) => {
						values = {...values, dateOfBirth: dob}; 
						if (
							values.email === '' ||
							values.password === '' ||
							values.name === '' ||
							values.dateOfBirth === '' ||
							values.confirmPassword === ''
						) {
							handleMessage("Please fill all the fields")
							setSubmitting(false);
						} else if (values.password !== values.confirmPassword) {
							handleMessage("Confirmation password does not match with your password");
							setSubmitting(false);
						}	else {
							handleSignup(values, setSubmitting);
						}
					}}
				>{({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
					<StyledFormArea>
						<MyTextInput
							label="Name"
							icon="person"
							placeholder="Talent's Name"
							placeholderTextColor={darkLight}
							onChangeText={handleChange('name')}
							onBlur={handleBlur('name')}
							value={values.name}
						/>
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
							label="Date of Birth"
							icon="calendar"
							placeholder="YYYY - MM - DD"
							placeholderTextColor={darkLight}
							onChangeText={handleChange('dateOfBirth')}
							onBlur={handleBlur('dateOfBirth')}
							value={dob ? dob.toDateString() : ''}
							isDate={true}
							editable={false}
							showDatePicker={showDatePicker}
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
						<MyTextInput
							label="Confirm Password"
							icon="lock"
							placeholder="Re-Write Your Password"
							placeholderTextColor={darkLight}
							onChangeText={handleChange('confirmPassword')}
							onBlur={handleBlur('confirmPassword')}
							value={values.confirmPassword}
							secureTextEntry={false}
							hidePassword={hidePassword}
							setHidePassword={setHidePassword}
						/>
						<MsgBox type={messageType}>{message}</MsgBox>
						{!isSubmitting && <StyledButton onPress={handleSubmit}>
							<ButtonText>Sign up</ButtonText>
						</StyledButton>}
						{isSubmitting && <StyledButton disabled={true}>
							<ActivityIndicator size="large" color={primary} />
						</StyledButton>}
						<Line />
						<ExtraView>
							<ExtraText>Already have an account? </ExtraText>
							<TextLink onPress={() => navigation.navigate("Login")}>
								<TextLinkContent>Login</TextLinkContent>
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

const MyTextInput = ({ 
	label, 
	icon, 
	isPassword, 
	hidePassword, 
	setHidePassword,
	showDatePicker, 
	isDate, 
	...props }) => {
	return (
		<View>
			<LeftIcon>
				<Octicons name={icon} size={30} color={brand} />
			</LeftIcon>
			<StyledInputLabel>{label}</StyledInputLabel>
			{!isDate && <StyledTextInput {...props} />}
			{isDate && (
				<TouchableOpacity onPress={showDatePicker}>
					<StyledTextInput {...props} />
				</TouchableOpacity>
			)}
			{isPassword && (
				<RightIcon onPress={setHidePassword.bind(this, !hidePassword)}>
					<Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight} />
				</RightIcon>
			)}
		</View>
	)
}

export default Signup;