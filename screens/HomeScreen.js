import { View, Text, SafeAreaView, Image, TextInput } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AdjustmentsHorizontalIcon, ChevronDownIcon, MagnifyingGlassIcon, UserIcon } from "react-native-heroicons/outline";
import { ScrollView } from "react-native";
import Categories from "../components/Categories";
import FeaturedRow from "../components/FeaturedRow";
import sanityClient from '../sanity';

const HomeScreen = () => {
	const navigation = useNavigation();
	const [featuredCategories, setFeaturedCategories] = useState([]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: false,
		});
	}, []);

	useEffect(() => {
		sanityClient
			.fetch(
				`
				*[_type == "featured"] {
					...,
					restaurants[]->{
					...,
					dishes[]->
					}
				}`
			)
			.then((data) => {
				setFeaturedCategories(data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	return (
		<SafeAreaView className="bg-white pt-5">
			{/* Header */}
			<View className="flex-row pb-3 items-center space-x-2 px-4">
				<Image
					source={{
						uri: "https://links.papareact.com/wru",
					}}
					className="h-7 w-7 bg-gray-300 p-4 rounded-full"
				/>
				<View className="flex-1">
					<Text className="font-bold text-gray-400 text-xs">Deliver now!</Text>
					<Text className="font-bold text-xl">
						Current Location
						<ChevronDownIcon size={20} color="#00CCBB"></ChevronDownIcon>
					</Text>
				</View>
				<UserIcon size={35} color="#00CCBB" />
			</View>

			{/* Search */}
			<View className="flex-row items-center space-x-2 pb-2 mx-4">
				<View className="flex-row space-x-2 flex-1 bg-gray-200 p-3">
					<MagnifyingGlassIcon color="gray" size={20} />
					<TextInput placeholder="Restaurants and cuisines" keyboardType="default" />
				</View>
				<AdjustmentsHorizontalIcon color="#00CCBB" />
			</View>

			{/* Body */}
			<ScrollView className="bg-gray-100" contentContainerStyle={{
				paddingBottom: 100
			}}>

				{/* Categories */}
				<Categories />
				{/* Featureds */}

				{featuredCategories?.map((category) =>(
					<FeaturedRow
						id={category._id}
						key={category._id}
						title={category.name}
						description={category.short_description}
					/>
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomeScreen;
