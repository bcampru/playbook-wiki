import { useState } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-textarea-code-editor/dist.css";
import { Save, XSquare, Braces, Trash3 } from "react-bootstrap-icons";
import { Nav } from "react-bootstrap";

const CodeEditor = dynamic(
	() => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
	{ ssr: false }
);

export default function Editor({ data, setWorkflowData, client, workflow }) {
	const [code, setCode] = useState(JSON.stringify(data, null, 2));
	const prettify = () => {
		try {
			JSON.parse(code);
		} catch (e) {
			alert("Invalid JSON!");
			return;
		}
		setCode(JSON.stringify(JSON.parse(code), null, 2));
	};
	const save = () => {
		try {
			JSON.parse(code);
		} catch (e) {
			alert("Invalid JSON!");
			return;
		}
		fetch("/api/workflow", {
			method: "POST",
			body: JSON.stringify({
				client: client,
				workflow: workflow,
				data: JSON.parse(code),
			}),
		}).then((res) => {
			if (!res.ok) {
				alert("Error when saving JSON!");
			} else {
				alert("Saved!");
			}
		});
	};
	const deleteWorkflow = () => {
		const confirmed = window.confirm(
			"Are you sure you want to delete this workflow?"
		);
		if (!confirmed) return;
		fetch(`/api/workflow/?client=${client}&workflow=${workflow}`, {
			method: "DELETE",
		}).then((res) => {
			if (!res.ok) {
				alert("Error when deleting workflow!");
			} else {
				alert("Deleted!");
				window.location.href = "/";
			}
		});
	};

	const discard = () => {
		setCode(JSON.stringify(data, null, 2));
	};
	return (
		<>
			<Nav>
				<Nav.Link onClick={save}>
					<Save />
					&nbsp; Save
				</Nav.Link>
				<Nav.Link onClick={discard}>
					<XSquare />
					&nbsp; Discard
				</Nav.Link>
				<Nav.Link onClick={prettify}>
					<Braces />
					&nbsp; Prettify
				</Nav.Link>
				{/*
				<Nav.Link onClick={deleteWorkflow}>
					<Trash3 />
					&nbsp; Delete
				</Nav.Link>*/}
			</Nav>

			<CodeEditor
				value={code}
				language="json"
				onChange={(evn) => setCode(evn.target.value)}
				padding={15}
				style={{
					fontSize: 12,
					backgroundColor: "#f5f5f5",
					fontFamily:
						"ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
				}}
			/>
		</>
	);
}
