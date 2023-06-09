"use client";
import React, { useState, useEffect } from "react";
import Editor from "../../../../components/editor";
import { PencilSquare, Book } from "react-bootstrap-icons";
import { Row, Col } from "react-bootstrap";
import Workflow from "../../../../components/workflow";

export default function App({ params: { client, workflow } }) {
	const [workflowData, setWorkflowData] = useState({});
	const [edit, setEdit] = useState(false);
	useEffect(() => {
		fetch(`/api/workflow?client=${client}&workflow=${workflow}`).then(
			(res) => {
				if (res.ok) {
					res.json().then((data) => {
						setWorkflowData(data);
					});
				} else {
					alert("Workflow doesn't exist!");
					window.location.href = "/";
				}
			}
		);
	}, []);
	return (
		<div>
			<Row className="align-items-end">
				<Col>
					<h1 style={{ marginBottom: "0rem" }}>
						Workflow:{" "}
						{decodeURI(client) + " - " + workflowData.name}
					</h1>
				</Col>
				<Col
					style={{ marginBottom: "5px", cursor: "pointer" }}
					onClick={() => setEdit(!edit)}
				>
					{edit ? (
						<>
							<Book />
							&nbsp; View Mode
						</>
					) : (
						<>
							<PencilSquare />
							&nbsp; Edit Mode
						</>
					)}
				</Col>
			</Row>
			{edit ? (
				<Editor
					data={workflowData}
					setWorkflowData={setWorkflowData}
					client={client}
					workflow={workflow}
				/>
			) : (
				<>
					<br />
					<Workflow data={workflowData} />
				</>
			)}
		</div>
	);
}
