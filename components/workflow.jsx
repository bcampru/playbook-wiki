import { Container, Row, Accordion, Col } from "react-bootstrap";

export default function Workflow({ data }) {
	const htmlDecode = (input) => {
		return (
			<div
				dangerouslySetInnerHTML={{
					__html: input,
				}}
			/>
		);
	};
	const parseTasks = (tasks) => {
		return (
			<Accordion defaultActiveKey="0" flush>
				{tasks.map((task, index) => (
					<Accordion.Item eventKey={index}>
						{console.log(task)}
						<Accordion.Header>
							Task {index + 1}: {task.taskName}
						</Accordion.Header>
						<Accordion.Body>
							{htmlDecode(task.tasks)}
						</Accordion.Body>
					</Accordion.Item>
				))}
			</Accordion>
		);
	};
	return (
		<>
			<Accordion defaultActiveKey="0" flush>
				<Accordion.Item eventKey="0">
					<Accordion.Header>
						<b>Tactic: {data.tactic}</b>{" "}
					</Accordion.Header>
					<Accordion.Body>
						{htmlDecode(data.technique)}
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
			<Accordion defaultActiveKey="0" flush>
				<Accordion.Item eventKey="0">
					<Accordion.Header>
						<b>Use Case Description</b>
					</Accordion.Header>
					<Accordion.Body>
						{htmlDecode(data.description)}
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
			<Row>
				<Col>
					<Accordion defaultActiveKey="0" flush>
						<Accordion.Item eventKey="0">
							<Accordion.Header>
								<b>L1 Instructions</b>
							</Accordion.Header>

							<Accordion.Body>
								{data.l1Instructions &&
									parseTasks(data.l1Instructions)}
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				</Col>
				<Col>
					<Accordion defaultActiveKey="0" flush>
						<Accordion.Item eventKey="0">
							<Accordion.Header>
								<b>Useful Links</b>
							</Accordion.Header>
							<Accordion.Body>
								<Row>
									{data.links &&
										data.links.map((link, index) => (
											<a key={index} href={link}>
												{link}
											</a>
										))}
								</Row>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				</Col>
			</Row>
			<Accordion defaultActiveKey="0" flush>
				<Row>
					<Col>
						<Accordion.Item eventKey="1">
							<Accordion.Header>
								<b>L2 Instructions</b>
							</Accordion.Header>
							<Accordion.Body>
								{data.l2Instructions &&
									parseTasks(data.l2Instructions)}
							</Accordion.Body>
						</Accordion.Item>
					</Col>
					<Col>
						<Accordion.Item eventKey="0">
							<Accordion.Header>
								<b>False Positive Definition</b>
							</Accordion.Header>
							<Accordion.Body>
								{htmlDecode(data.falsePositiveDefinition)}
							</Accordion.Body>
						</Accordion.Item>
					</Col>
				</Row>
			</Accordion>
		</>
	);
}
