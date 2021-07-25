import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
	InnerContainer,
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
	WelcomeContainer,
	WelcomeImage,
	Avatar
} from './../components/styles';

const Welcome = ({navigation, route}) => {
	const {name, email, photoUrl} = route.params;
	const AvatarImg = photoUrl ? { uri: photoUrl } : require('./../assets/img/favicon.png')
	return (
		<>
			<StatusBar style="light"/>
			<InnerContainer>
				<WelcomeImage resizeMode="contain" source={require('./../assets/img/protal.png')} />
				<WelcomeContainer>
					<PageTitle welcome={true}>Welcome Talent!</PageTitle>
					<SubTitle welcome={true}>{name || "Talent's Name"}</SubTitle>
					<SubTitle welcome={true}>{email || "talent@gmail.com"}</SubTitle>
					<StyledFormArea>
						<Avatar resizeMode="cover" source={AvatarImg} />
						<Line />
						<MsgBox>...</MsgBox>
						<StyledButton onPress={() => navigation.navigate("Login")}>
							<ButtonText>Logout</ButtonText>
						</StyledButton>
					</StyledFormArea>
				</WelcomeContainer>
			</InnerContainer>
		</>
	)
}

export default Welcome;