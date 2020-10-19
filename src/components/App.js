import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import LoaderContainer from "./LoaderContainer";
import Leaderboard from "./Leaderboard";
import Character from "./Character";
import "../style/App.scss";
import Ready from "./Ready";
import { db } from "../config/fbConfig";
const AT = lazy(() => import("./AT"));

const App = () => {
	const [ready, setReady] = useState(false);
	const [find, setFind] = useState([false, false, false]);
	const [name, setName] = useState("");
	const [leaderboard, setLearderboard] = useState(null);
	const [seconds, setSeconds] = useState(0);

	// once it's mounted, go snag the leaderboard.
	useEffect(() => {
		console.log("use effect");
		let tempLeaderboard = [];
		db.collection("leaderboard")
			.get()
			.then((snapshot) => {
				snapshot.docs.forEach((doc) => {
					console.log(doc.data());
					tempLeaderboard.push(doc.data());
				});
				setLearderboard((oldLeaderboard) => tempLeaderboard).then(console.log("converted"));
			});
	}, []);

	const getReady = (newName) => {
		console.log("get ready");
		setName(newName);
		setReady(true);
	};

	const updateTime = (newTime) => {
		setSeconds((seconds) => newTime);
	};

	const successfulFind = (number) => {
		setFind(
			find.map((char, index) => {
				if (index === number) {
					char = true;
				}
				return char;
			})
		);
	};

	const dbAdd = useCallback(() => {
		return db.collection("leaderboard").add({ name: name, time: seconds });
	}, [name, seconds]);

	// when a level is completed, check to see if we're done.
	useEffect(() => {
		console.log("win check");

		if (!find.includes(false)) {
			console.log("u win!");
			setReady(false);
			setFind([false, false, false]);
			dbAdd();
		}
	}, [find, dbAdd]);

	return (
		<div className="App">
			<div className="main">
				{ready ? (
					<Suspense fallback={<LoaderContainer />}>
						<AT find={find} successfulFind={successfulFind} />
					</Suspense>
				) : (
					<Ready getReady={getReady} />
				)}
			</div>
			<div className="sidebar">
				<Character find={find} />
				{leaderboard ? (
					<Leaderboard
						name={name}
						seconds={seconds}
						updateTime={updateTime}
						start={ready}
						entrants={leaderboard}
					/>
				) : (
					<LoaderContainer />
				)}
			</div>
		</div>
	);
};

export default App;
