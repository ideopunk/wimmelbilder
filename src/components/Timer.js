import React, { useState, useEffect } from "react";

const Timer = (props) => {
	const {start, seconds, updateTime} = props

	useEffect(() => {
		let interval = null;
		if (start) {
			interval = setInterval(() => {
				updateTime(seconds+1);
			}, 1000);
		} else if (!start && seconds !== 0) {
            clearInterval(interval)
        }
        return () => clearInterval(interval);
    }, [start, seconds, updateTime]);
    
    return (
		<ul className="entrant" key="new">
			<li>{props.name}</li>
			<li>{props.seconds}</li>
		</ul>
    )
};

export default Timer;
